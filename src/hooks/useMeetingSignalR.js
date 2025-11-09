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
	const resolvedHubUrl = useMemo(() => hubUrl, [hubUrl])

	const buildConnection = useCallback(() => {
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(resolvedHubUrl, {
				transport: signalR.HttpTransportType.WebSockets,
				skipNegotiation: true,
			})
			.configureLogging(signalR.LogLevel.Information)
			.build()

		connection.on('JoinSucceeded', (payload) => {
			onJoinSucceeded && onJoinSucceeded(payload)
		})
		connection.on('JoinFailed', (err) => {
			onJoinFailed && onJoinFailed(err)
		})
		connection.on('ParticipantJoined', (participant) => {
			onParticipantJoined && onParticipantJoined(participant)
		})
		connection.on('ParticipantLeft', (participantId) => {
			onParticipantLeft && onParticipantLeft(participantId)
		})
		connection.on('ReceiveOffer', (senderId, offer) => {
			onOffer && onOffer(senderId, offer)
		})
		connection.on('ReceiveAnswer', (senderId, answer) => {
			onAnswer && onAnswer(senderId, answer)
		})
		connection.on('ReceiveIceCandidate', (senderId, candidate) => {
			onIceCandidate && onIceCandidate(senderId, candidate)
		})
		connection.on('StateUpdated', (state) => {
			onStateUpdated && onStateUpdated(state)
		})

		return connection
	}, [
		resolvedHubUrl,
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
		if (!connectionRef.current) {
			connectionRef.current = buildConnection()
		}

		const conn = connectionRef.current

		await conn.start()
		startedRef.current = true

		if (transactionId) {
			await conn.invoke('JoinSession', transactionId)
		}

		return true
	}, [buildConnection, transactionId])

	const stopConnection = useCallback(async () => {
		const conn = connectionRef.current
		if (conn) {
			await conn.stop()
		}
		connectionRef.current = null
		startedRef.current = false
	}, [])

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

	useEffect(() => {
		if (!transactionId || !hubUrl) {
			return
		}
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
	}, [transactionId, hubUrl, startConnection, stopConnection, onJoinFailed])

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
