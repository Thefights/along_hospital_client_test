import { useCallback, useEffect, useRef, useState } from 'react'

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

	const [localStream, setLocalStream] = useState(null)
	const [remoteStream, setRemoteStream] = useState(null)
	const [isAudioEnabled, setIsAudioEnabled] = useState(true)
	const [isVideoEnabled, setIsVideoEnabled] = useState(true)

	useEffect(() => {
		if (!iceServers || iceServers.length === 0) {
			console.log('[WEBRTC] waiting for iceServers…')
			return
		}

		const pc = new RTCPeerConnection({ iceServers, iceTransportPolicy: 'all' })
		pcRef.current = pc

		try {
			pc.addTransceiver('audio', { direction: 'sendrecv' })
			pc.addTransceiver('video', { direction: 'sendrecv' })
		} catch {}

		pc.onicecandidate = (e) => {
			const c = e.candidate
			if (!c) return
			const data = typeof c.toJSON === 'function' ? c.toJSON() : c
			onIceCandidate?.(data)
		}

		const ensureRemoteStream = () => {
			if (!remoteStreamRef.current) {
				remoteStreamRef.current = new MediaStream()
				setRemoteStream(remoteStreamRef.current)
				onRemoteStream?.(remoteStreamRef.current)
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
			onRemoteStream?.(rs)
			const tag = (document || {}).querySelector?.('video[autoplay][playsinline]')
			tag?.play?.().catch(() => {})
		}
		;(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
				localStreamRef.current = stream
				setLocalStream(stream)
				onLocalStream?.(stream)
				stream.getTracks().forEach((track) => pc.addTrack(track, stream))
			} catch (err) {
				console.warn('[GUM] failed → audio only', err)
				try {
					const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
					localStreamRef.current = stream
					setLocalStream(stream)
					onLocalStream?.(stream)
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
	}, [JSON.stringify(iceServers)])

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
			if (pc.signalingState !== 'have-local-offer' || !expectingAnswerRef.current) return
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
		ls.getAudioTracks().forEach((t) => (t.enabled = !t.enabled))
		setIsAudioEnabled((x) => !x)
	}

	const toggleVideo = useCallback(() => {
		const ls = localStreamRef.current
		if (!ls) return
		ls.getVideoTracks().forEach((t) => (t.enabled = !t.enabled))
		setIsVideoEnabled((x) => !x)
		onLocalStream?.(ls)
	}, [onLocalStream])

	const hangUp = useCallback(() => {
		const pc = pcRef.current
		try {
			pc?.getSenders().forEach((s) => s.track?.stop())
			pc?.close()
		} finally {
			pcRef.current = null
			localStreamRef.current?.getTracks().forEach((t) => t.stop())
			localStreamRef.current = null
			remoteStreamRef.current = null
			setRemoteStream(null)
			setLocalStream(null)
			setIsVideoEnabled(false)
			setIsAudioEnabled(false)
			candidateQueueRef.current = []
			expectingAnswerRef.current = false
		}
	}, [])

	return {
		createOffer,
		createAnswer,
		setRemoteDescription,
		addIceCandidate,
		renegotiate,
		toggleAudio,
		toggleVideo,
		hangUp,
		localStream,
		remoteStream,
		isAudioEnabled,
		isVideoEnabled,
	}
}
