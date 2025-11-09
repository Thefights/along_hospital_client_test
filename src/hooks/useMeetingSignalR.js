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
	const attemptsRef = useRef(0)

	const resolvedHubUrl = useMemo(() => hubUrl, [hubUrl])

	const buildConnection = useCallback(() => {
		console.log('🔄 Starting to build connection...')
		console.log('📡 Meeting hub URL: ', hubUrl)

		const conn = new signalR.HubConnectionBuilder()
			.withUrl(resolvedHubUrl, {
				transport: signalR.HttpTransportType.WebSockets,
				skipNegotiation: true,
			})
			.withAutomaticReconnect([0, 2000, 5000]) // secondary safety net
			.configureLogging(signalR.LogLevel.Information)
			.build()

		console.log('🛠️ Connection built successfully')

		// inbound handlers
		conn.on('JoinSucceeded', (payload) => {
			console.log('✅ Join session succeeded:', payload)
			onJoinSucceeded && onJoinSucceeded(payload)
		})
		conn.on('JoinFailed', (err) => {
			console.error('❌ Join session failed:', err)
			onJoinFailed && onJoinFailed(err)
		})
		conn.on('ParticipantJoined', (participant) => {
			console.log('👤 Participant joined:', participant)
			onParticipantJoined && onParticipantJoined(participant)
		})
		conn.on('ParticipantLeft', (participantId) => {
			console.log('👋 Participant left:', participantId)
			onParticipantLeft && onParticipantLeft(participantId)
		})
		// Hub broadcasts: (senderId, offer/answer/candidate)
		conn.on('ReceiveOffer', (senderId, offer) => {
			console.log('📨 Received offer from:', senderId)
			onOffer && onOffer(senderId, offer)
		})
		conn.on('ReceiveAnswer', (senderId, answer) => {
			console.log('📩 Received answer from:', senderId)
			onAnswer && onAnswer(senderId, answer)
		})
		conn.on('ReceiveIceCandidate', (senderId, candidate) => {
			console.log('🧊 Received ICE candidate from:', senderId)
			onIceCandidate && onIceCandidate(senderId, candidate)
		})
		conn.on('StateUpdated', (state) => {
			console.log('🔄 State updated:', state)
			onStateUpdated && onStateUpdated(state)
		})

		return conn
	}, [
		resolvedHubUrl,
		hubUrl,
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
		console.log('🚀 Starting connection attempt...')
		if (startedRef.current) {
			console.log('⏭️ Connection already started, skipping')
			return
		}

		return new Promise((resolve, reject) => {
			;(async () => {
				try {
					if (!connectionRef.current) {
						console.log('🔨 Building new connection...')
						connectionRef.current = buildConnection()
					}
					const conn = connectionRef.current

					// manual retry with exponential backoff 1s / 2s / 4s
					attemptsRef.current = 0
					let delay = 1000
					while (attemptsRef.current < 3) {
						try {
							console.log(`📡 Attempt ${attemptsRef.current + 1}/3 to connect...`)
							await conn.start()
							startedRef.current = true
							console.log('✅ Connection started successfully')

							// auto join after start
							if (transactionId) {
								console.log('🔄 Joining session:', transactionId)
								await conn.invoke('JoinSession', transactionId)
								console.log('✅ Join session request sent')
							}

							// Connection successful
							resolve(true)
							return
						} catch (err) {
							attemptsRef.current += 1
							console.error(`❌ Attempt ${attemptsRef.current}/3 failed:`, err)
							if (attemptsRef.current >= 3) {
								console.error('❌ All connection attempts failed')
								reject(err)
								return
							}
							console.log(`⏳ Waiting ${delay}ms before next attempt...`)
							await new Promise((r) => setTimeout(r, delay))
							delay *= 2
						}
					}
				} catch (err) {
					reject(err)
				}
			})()
		})
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
		// start immediately when token, transactionId and hubUrl are all available
		if (!transactionId || !hubUrl) {
			console.log('Waiting for required params:', { transactionId, hubUrl })
			return
		}

		let cancelled = false
		;(async () => {
			try {
				if (!cancelled) await startConnection()
			} catch (err) {
				console.error('Connection failed:', err)
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
