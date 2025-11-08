import { getEnv } from '@/utils/commons'
import * as signalR from '@microsoft/signalr'
import { useCallback, useEffect, useMemo, useRef } from 'react'

/**
 * useMeetingSignalR
 * Establishes and manages a SignalR connection for a tele-session.
 *
 * @param {Object} params
 * @param {string} params.transactionId - The tele-session transaction id
 * @param {string} params.accessToken - Bearer token used for hub authentication
 * @param {string=} params.hubUrl - Optional SignalR hub URL from API
 * @param {function=} params.onJoinSucceeded - Callback when JoinSession succeeded (payload)
 * @param {function=} params.onJoinFailed - Callback when JoinSession failed (error)
 * @param {function=} params.onParticipantJoined - Callback when a participant joined (participant)
 * @param {function=} params.onParticipantLeft - Callback when a participant left (participantId)
 * @param {function=} params.onOffer - Callback when receiving SDP offer (senderId, offer)
 * @param {function=} params.onAnswer - Callback when receiving SDP answer (senderId, answer)
 * @param {function=} params.onIceCandidate - Callback when receiving ICE candidate (senderId, candidate)
 * @param {function=} params.onStateUpdated - Callback when meeting state updated (state)
 *
 * @returns {{
 *  sendOffer: (offer: RTCSessionDescriptionInit) => Promise<void>,
 *  sendAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>,
 *  sendIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>,
 *  notifyState: (state: any) => Promise<void>,
 *  leaveSession: () => Promise<void>,
 *  startConnection: () => Promise<void>,
 *  stopConnection: () => Promise<void>,
 * }}
 */
const useMeetingSignalR = ({
	transactionId,
	accessToken,
	hubUrl,
	onJoinSucceeded,
	onJoinFailed,
	onParticipantJoined,
	onParticipantLeft,
	onOffer,
	onAnswer,
	onIceCandidate,
	onStateUpdated,
}) => {
	const connectionRef = useRef(null)
	const startedRef = useRef(false)
	const attemptsRef = useRef(0)

	const resolvedHubUrl = useMemo(() => {
		// Ưu tiên sử dụng hubUrl từ props (API)
		if (hubUrl) return hubUrl
		// Fallback: kiểm tra env variable
		const explicit = getEnv('VITE_SIGNALR_URL', '')
		if (explicit) return explicit
		// Fallback cuối: suy ra từ base API url
		const base = getEnv('VITE_BASE_API_URL', '').replace(/\/api\/.+$/, '')
		return `${base}/hubs/tele-session`
	}, [hubUrl])

	const buildConnection = useCallback(() => {
		const conn = new signalR.HubConnectionBuilder()
			.withUrl(resolvedHubUrl, {
				accessTokenFactory: () => accessToken || '',
				transport: signalR.HttpTransportType.WebSockets,
				skipNegotiation: true,
			})
			.withAutomaticReconnect([0, 2000, 5000]) // secondary safety net
			.configureLogging(signalR.LogLevel.Information)
			.build()

		// inbound handlers
		conn.on('JoinSucceeded', (payload) => onJoinSucceeded && onJoinSucceeded(payload))
		conn.on('JoinFailed', (err) => onJoinFailed && onJoinFailed(err))
		conn.on(
			'ParticipantJoined',
			(participant) => onParticipantJoined && onParticipantJoined(participant)
		)
		conn.on(
			'ParticipantLeft',
			(participantId) => onParticipantLeft && onParticipantLeft(participantId)
		)
		// Hub broadcasts: (senderId, offer/answer/candidate)
		conn.on('ReceiveOffer', (senderId, offer) => onOffer && onOffer(senderId, offer))
		conn.on('ReceiveAnswer', (senderId, answer) => onAnswer && onAnswer(senderId, answer))
		conn.on(
			'ReceiveIceCandidate',
			(senderId, candidate) => onIceCandidate && onIceCandidate(senderId, candidate)
		)
		conn.on('StateUpdated', (state) => onStateUpdated && onStateUpdated(state))

		return conn
	}, [
		resolvedHubUrl,
		accessToken,
		onAnswer,
		onIceCandidate,
		onJoinFailed,
		onJoinSucceeded,
		onOffer,
		onParticipantJoined,
		onParticipantLeft,
		onStateUpdated,
	])

	const startConnection = useCallback(async () => {
		if (startedRef.current) return
		if (!connectionRef.current) connectionRef.current = buildConnection()
		const conn = connectionRef.current

		// manual retry with exponential backoff 1s / 2s / 4s
		attemptsRef.current = 0
		let delay = 1000
		while (attemptsRef.current < 3) {
			try {
				await conn.start()
				startedRef.current = true
				// auto join after start
				if (transactionId) await conn.invoke('JoinSession', transactionId)
				return
			} catch (err) {
				attemptsRef.current += 1
				if (attemptsRef.current >= 3) throw err
				await new Promise((r) => setTimeout(r, delay))
				delay *= 2
			}
		}
	}, [buildConnection, transactionId])

	const stopConnection = useCallback(async () => {
		const conn = connectionRef.current
		if (conn) {
			try {
				await conn.stop()
			} catch {
				// ignore
			}
		}
		connectionRef.current = null
		startedRef.current = false
	}, [])

	// outbound APIs
	const sendOffer = useCallback(
		async (offer) => {
			if (!connectionRef.current) return
			await connectionRef.current.invoke('SendOffer', transactionId, offer)
		},
		[transactionId]
	)

	const sendAnswer = useCallback(
		async (answer) => {
			if (!connectionRef.current) return
			await connectionRef.current.invoke('SendAnswer', transactionId, answer)
		},
		[transactionId]
	)

	const sendIceCandidate = useCallback(
		async (candidate) => {
			if (!connectionRef.current) return
			await connectionRef.current.invoke('SendIceCandidate', transactionId, candidate)
		},
		[transactionId]
	)

	const notifyState = useCallback(
		async (state) => {
			if (!connectionRef.current) return
			await connectionRef.current.invoke('NotifyState', transactionId, state)
		},
		[transactionId]
	)

	const leaveSession = useCallback(async () => {
		if (!connectionRef.current) return
		try {
			await connectionRef.current.invoke('LeaveSession', transactionId)
		} finally {
			await stopConnection()
		}
	}, [stopConnection, transactionId])

	// lifecycle
	useEffect(() => {
		// start immediately when both token and transactionId are available
		if (!transactionId || !accessToken) return
		let cancelled = false
		;(async () => {
			try {
				if (!cancelled) await startConnection()
			} catch (err) {
				onJoinFailed && onJoinFailed(err)
			}
		})()

		return () => {
			cancelled = true
			stopConnection()
		}
	}, [transactionId, accessToken, startConnection, stopConnection, onJoinFailed])

	return {
		sendOffer,
		sendAnswer,
		sendIceCandidate,
		notifyState,
		leaveSession,
		startConnection,
		stopConnection,
	}
}

export default useMeetingSignalR
