import * as signalR from '@microsoft/signalr'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const useMeetingSignalR = ({
	transactionId,
	roomCode,
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
	const callbacksRef = useRef({}) // 🔥 giữ callback ổn định

	// 🔥 Mỗi lần props callback đổi → update vào ref, KHÔNG khiến hook re-run
	useEffect(() => {
		callbacksRef.current = {
			onJoinSucceeded,
			onJoinFailed,
			onParticipantJoined,
			onParticipantLeft,
			onOffer,
			onAnswer,
			onIceCandidate,
			onStateUpdated,
		}
	}, [
		onJoinSucceeded,
		onJoinFailed,
		onParticipantJoined,
		onParticipantLeft,
		onOffer,
		onAnswer,
		onIceCandidate,
		onStateUpdated,
	])

	const resolvedHubUrl = useMemo(() => hubUrl, [hubUrl])
	const [joinedRoomCode, setJoinedRoomCode] = useState(null)

	// --------------------------------------------------------------------
	// 🔥 buildConnection — KHÔNG phụ thuộc callback nữa → không bị recreate
	// --------------------------------------------------------------------
	const buildConnection = useCallback(() => {
		const conn = new signalR.HubConnectionBuilder()
			.withUrl(resolvedHubUrl, {
				transport: signalR.HttpTransportType.WebSockets,
				skipNegotiation: true,
			})
			.configureLogging(signalR.LogLevel.Information)
			.build()

		conn.on('JoinSucceeded', (payload) => {
			const room = payload.roomCode ?? payload.RoomCode
			console.log('>>> Joined room:', room)
			setJoinedRoomCode(room)

			callbacksRef.current.onJoinSucceeded?.(payload)
		})

		conn.on('JoinFailed', (err) => {
			console.log('JoinFailed', err)
			callbacksRef.current.onJoinFailed?.(err)
		})

		conn.on('ParticipantJoined', (connId) => {
			callbacksRef.current.onParticipantJoined?.(connId)
		})

		conn.on('ParticipantLeft', (connId) => {
			callbacksRef.current.onParticipantLeft?.(connId)
		})

		conn.on('ReceiveOffer', ({ from, offer }) => {
			callbacksRef.current.onOffer?.(from, offer)
		})

		conn.on('ReceiveAnswer', ({ from, answer }) => {
			callbacksRef.current.onAnswer?.(from, answer)
		})

		conn.on('ReceiveIceCandidate', ({ from, candidate }) => {
			callbacksRef.current.onIceCandidate?.(from, candidate)
		})

		conn.on('StateUpdated', ({ from, state }) => {
			callbacksRef.current.onStateUpdated?.(from, state)
		})

		return conn
	}, [resolvedHubUrl])

	// --------------------------------------------------------------------
	// 🔥 Start connection CHỈ chạy đúng 1 lần (per hubUrl)
	// --------------------------------------------------------------------
	const startConnection = useCallback(async () => {
		if (startedRef.current) return
		if (!resolvedHubUrl) return

		startedRef.current = true

		if (!connectionRef.current) {
			connectionRef.current = buildConnection()
		}

		if (connectionRef.current.state === signalR.HubConnectionState.Disconnected) {
			await connectionRef.current.start()
			await connectionRef.current.invoke('JoinSession', transactionId || null, roomCode || null)
		}
	}, [buildConnection, resolvedHubUrl, transactionId, roomCode])

	const stopConnection = useCallback(async () => {
		const conn = connectionRef.current
		startedRef.current = false

		if (conn && conn.state !== signalR.HubConnectionState.Disconnected) {
			await conn.stop()
		}

		connectionRef.current = null
		setJoinedRoomCode(null)
	}, [])

	// --------------------------------------------------------------------
	// 🔥 useEffect — chỉ phụ thuộc hubUrl → không loop forever
	// --------------------------------------------------------------------
	useEffect(() => {
		if (!hubUrl) return

		startConnection()

		return () => {
			stopConnection()
		}
	}, [hubUrl]) // chỉ hubUrl → không callback nào gây re-run nữa

	// --------------------------------------------------------------------
	// Send methods
	// --------------------------------------------------------------------
	const sendOffer = useCallback(
		async (offer) => {
			if (!connectionRef.current || !joinedRoomCode) return
			await connectionRef.current.invoke('SendOffer', joinedRoomCode, offer)
		},
		[joinedRoomCode]
	)

	const sendAnswer = useCallback(
		async (answer) => {
			if (!connectionRef.current || !joinedRoomCode) return
			await connectionRef.current.invoke('SendAnswer', joinedRoomCode, answer)
		},
		[joinedRoomCode]
	)

	const sendIceCandidate = useCallback(
		async (candidate) => {
			if (!connectionRef.current || !joinedRoomCode) return
			await connectionRef.current.invoke('SendIceCandidate', joinedRoomCode, candidate)
		},
		[joinedRoomCode]
	)

	const notifyState = useCallback(
		async (state) => {
			if (!connectionRef.current || !joinedRoomCode) return
			await connectionRef.current.invoke('NotifyState', joinedRoomCode, state)
		},
		[joinedRoomCode]
	)

	const leaveSession = useCallback(async () => {
		if (!connectionRef.current) return
		try {
			await connectionRef.current.invoke('LeaveSession')
		} finally {
			await stopConnection()
		}
	}, [stopConnection])

	return {
		sendOffer,
		sendAnswer,
		sendIceCandidate,
		notifyState,
		leaveSession,
		startConnection,
		stopConnection,
		joinedRoomCode,
	}
}

export default useMeetingSignalR
