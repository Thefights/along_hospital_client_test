import * as signalR from '@microsoft/signalr'
import { useCallback, useEffect, useRef } from 'react'

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
	const isStarting = useRef(false)
	const isStarted = useRef(false)

	const buildConnection = useCallback(() => {
		if (connectionRef.current) return connectionRef.current

		const conn = new signalR.HubConnectionBuilder()
			.withUrl(hubUrl) // KHÔNG skipNegotiation nữa
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Information)
			.build()

		conn.on('JoinSucceeded', (p) => onJoinSucceeded?.(p))
		conn.on('JoinFailed', (e) => onJoinFailed?.(e))
		conn.on('ParticipantJoined', (p) => onParticipantJoined?.(p))
		conn.on('ParticipantLeft', (p) => onParticipantLeft?.(p))
		conn.on('ReceiveOffer', (s, o) => onOffer?.(s, o))
		conn.on('ReceiveAnswer', (s, a) => onAnswer?.(s, a))
		conn.on('ReceiveIceCandidate', (s, c) => onIceCandidate?.(s, c))
		conn.on('StateUpdated', (st) => onStateUpdated?.(st))

		connectionRef.current = conn
		return conn
	}, [hubUrl])

	const startConnection = useCallback(async () => {
		const conn = buildConnection()

		if (isStarted.current) return
		if (isStarting.current) return

		isStarting.current = true

		try {
			await conn.start()
			await conn.invoke('JoinSession', transactionId)
			isStarted.current = true
		} catch (err) {
			console.error('SignalR start failed:', err)
			setTimeout(() => startConnection(), 2000)
		} finally {
			isStarting.current = false
		}
	}, [buildConnection, transactionId])

	const stopConnection = useCallback(async () => {
		const conn = connectionRef.current
		if (!conn) return

		if (isStarting.current) return // không stop khi đang start
		if (!isStarted.current) return

		try {
			await conn.stop()
		} catch {}

		isStarted.current = false
	}, [])

	// Start chỉ CHẠY 1 LẦN khi mount (KHÔNG bao giờ stop khi dependency đổi)
	useEffect(() => {
		if (!hubUrl || !transactionId) return
		startConnection()
	}, [hubUrl, transactionId])

	// Stop ONLY when unmount
	useEffect(() => {
		return () => {
			stopConnection()
		}
	}, [])

	return {
		sendOffer: async (o) => connectionRef.current?.invoke('SendOffer', transactionId, o),
		sendAnswer: async (a) => connectionRef.current?.invoke('SendAnswer', transactionId, a),
		sendIceCandidate: async (c) =>
			connectionRef.current?.invoke('SendIceCandidate', transactionId, c),
		leaveSession: async () => {
			await connectionRef.current?.invoke('LeaveSession', transactionId)
			await stopConnection()
		},
		startConnection,
		stopConnection,
	}
}

export default useMeetingSignalR
