import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export default function useWebRtcPeer({
	iceServers = [],
	onLocalStream,
	onRemoteStream,
	onIceCandidate,
}) {
	const pcRef = useRef(null)
	const localStreamRef = useRef(null)
	const remoteStreamRef = useRef(null)
	const candidateQueueRef = useRef([])
	const expectingAnswerRef = useRef(false)

	// Keep latest callbacks without forcing effect re-run
	const onLocalStreamRef = useRef(onLocalStream)
	const onRemoteStreamRef = useRef(onRemoteStream)
	const onIceCandidateRef = useRef(onIceCandidate)

	useEffect(() => {
		onLocalStreamRef.current = onLocalStream
	}, [onLocalStream])

	useEffect(() => {
		onRemoteStreamRef.current = onRemoteStream
	}, [onRemoteStream])

	useEffect(() => {
		onIceCandidateRef.current = onIceCandidate
	}, [onIceCandidate])

	const [localStream, setLocalStream] = useState(null)
	const [remoteStream, setRemoteStream] = useState(null)
	const [isAudioEnabled, setIsAudioEnabled] = useState(true)
	const [isVideoEnabled, setIsVideoEnabled] = useState(true)

	const iceKey = useMemo(() => JSON.stringify(iceServers || []), [iceServers])

	useEffect(() => {
		if (!iceServers || iceServers.length === 0) {
			console.log('[WEBRTC] waiting for iceServers…')
			return
		}

		const pc = new RTCPeerConnection({
			iceServers,
			iceTransportPolicy: 'all',
		})
		pcRef.current = pc

		pc.onicecandidate = (e) => {
			const c = e.candidate
			// Khi ICE gathering kết thúc, trình duyệt sẽ bắn một event với candidate=null.
			// Cần guard để tránh gọi toJSON trên null.
			if (!c) {
				// Tuỳ logic trên server, có thể gửi null để báo end-of-candidates hoặc đơn giản là bỏ qua.
				onIceCandidateRef.current?.(null)
				return
			}
			const payload = typeof c.toJSON === 'function' ? c.toJSON() : c
			onIceCandidateRef.current?.(payload)
		}

		const ensureRemoteStream = () => {
			if (!remoteStreamRef.current) {
				remoteStreamRef.current = new MediaStream()
				setRemoteStream(remoteStreamRef.current)
				onRemoteStreamRef.current?.(remoteStreamRef.current)
			}
			return remoteStreamRef.current
		}

		pc.ontrack = (e) => {
			const rs = ensureRemoteStream()
			e.streams[0].getTracks().forEach((t) => {
				const exists = rs.getTracks().some((x) => x.id === t.id)
				if (!exists) rs.addTrack(t)
			})
			setRemoteStream(rs)
			onRemoteStreamRef.current?.(rs)
		}
		;(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true,
				})
				localStreamRef.current = stream
				setLocalStream(stream)
				onLocalStreamRef.current?.(stream)
				stream.getTracks().forEach((track) => pc.addTrack(track, stream))
			} catch (err) {
				console.warn('[GUM] failed → fallback audio only', err)
				try {
					const stream = await navigator.mediaDevices.getUserMedia({
						audio: true,
						video: false,
					})
					console.log('[GUM] got audio-only')
					localStreamRef.current = stream
					setLocalStream(stream)
					onLocalStreamRef.current?.(stream)
					stream.getTracks().forEach((track) => pc.addTrack(track, stream))
					setIsVideoEnabled(false)
				} catch (e) {
					console.error('[GUM] permission denied', e)
					setIsAudioEnabled(false)
					setIsVideoEnabled(false)
				}
			}
		})()

		return () => {
			pc.close()
			pcRef.current = null

			localStreamRef.current?.getTracks().forEach((t) => t.stop())
			localStreamRef.current = null

			remoteStreamRef.current = null
			setRemoteStream(null)

			expectingAnswerRef.current = false
			candidateQueueRef.current = []
		}
	}, [iceKey, iceServers])

	const createOffer = useCallback(async () => {
		const pc = pcRef.current
		const offer = await pc.createOffer({ iceRestart: false })
		await pc.setLocalDescription(offer)
		expectingAnswerRef.current = true
		return offer
	}, [])

	const createAnswer = useCallback(async () => {
		const pc = pcRef.current
		const answer = await pc.createAnswer()
		await pc.setLocalDescription(answer)
		return answer
	}, [])

	const setRemoteDescription = useCallback(async (desc) => {
		const pc = pcRef.current

		if (desc?.type === 'answer') {
			if (pc.signalingState !== 'have-local-offer' || !expectingAnswerRef.current) {
				return
			}
		}

		await pc.setRemoteDescription(new RTCSessionDescription(desc))

		if (desc?.type === 'answer') expectingAnswerRef.current = false

		if (candidateQueueRef.current.length > 0) {
			for (const c of candidateQueueRef.current) {
				await pc.addIceCandidate(new RTCIceCandidate(c))
			}
			candidateQueueRef.current = []
		}
	}, [])

	const addIceCandidate = useCallback(async (candidate) => {
		if (!candidate) return
		const pc = pcRef.current

		if (!pc.remoteDescription) {
			candidateQueueRef.current.push(candidate)
			return
		}
		await pc.addIceCandidate(new RTCIceCandidate(candidate))
	}, [])

	const renegotiate = useCallback(async () => {
		const pc = pcRef.current
		const offer = await pc.createOffer({ iceRestart: false })
		await pc.setLocalDescription(offer)
		expectingAnswerRef.current = true
		return offer
	}, [])

	const toggleAudio = () => {
		const ls = localStreamRef.current
		if (!ls) return
		ls.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
		const next = !isAudioEnabled
		setIsAudioEnabled(next)
	}

	const toggleVideo = useCallback(() => {
		const ls = localStreamRef.current
		if (!ls) return
		ls.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
		const next = !isVideoEnabled
		setIsVideoEnabled(next)
		onLocalStreamRef.current?.(ls)
	}, [isVideoEnabled])

	const clearRemoteStream = useCallback(() => {
		if (remoteStreamRef.current) {
			remoteStreamRef.current.getTracks().forEach((track) => track.stop())
			remoteStreamRef.current = null
			setRemoteStream(null)
		}
	}, [])

	const hangUp = useCallback(() => {
		const pc = pcRef.current

		try {
			pc?.getSenders().forEach((s) => s.track?.stop())
			pc?.close()
			console.log('[CALL] hangUp -> closed')
		} finally {
			pcRef.current = null
			localStreamRef.current?.getTracks().forEach((t) => t.stop())
			localStreamRef.current = null
			clearRemoteStream()
			setLocalStream(null)
			setIsVideoEnabled(false)
			setIsAudioEnabled(false)
			candidateQueueRef.current = []
			expectingAnswerRef.current = false
		}
	}, [clearRemoteStream])

	return {
		createOffer,
		createAnswer,
		setRemoteDescription,
		addIceCandidate,
		renegotiate,
		toggleAudio,
		toggleVideo,
		hangUp,
		clearRemoteStream,
		localStream,
		remoteStream,
		isAudioEnabled,
		isVideoEnabled,
	}
}
