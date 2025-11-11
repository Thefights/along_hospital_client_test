import { useCallback, useEffect, useRef, useState } from 'react'

const useWebRtcPeer = ({ iceServers = [], onLocalStream, onRemoteStream, onIceCandidate }) => {
	const pcRef = useRef(null)
	const localStreamRef = useRef(null)
	const remoteStreamRef = useRef(null)
	const candidateQueueRef = useRef([]) // []
	const expectingAnswerRef = useRef(false) // NEW

	const [localStream, setLocalStream] = useState(null)
	const [remoteStream, setRemoteStream] = useState(null)
	const [isAudioEnabled, setIsAudioEnabled] = useState(true)
	const [isVideoEnabled, setIsVideoEnabled] = useState(true)

	useEffect(() => {
		const pc = new RTCPeerConnection({ iceServers })
		pcRef.current = pc

		const ensureRemoteStream = () => {
			if (!remoteStreamRef.current) {
				remoteStreamRef.current = new MediaStream()
				setRemoteStream(remoteStreamRef.current)
				if (onRemoteStream) onRemoteStream(remoteStreamRef.current)
			}
			return remoteStreamRef.current
		}

		pc.onicecandidate = (e) => {
			if (e.candidate && onIceCandidate) onIceCandidate(e.candidate.toJSON())
		}

		pc.ontrack = (e) => {
			const rs = ensureRemoteStream()
			e.streams[0].getTracks().forEach((t) => {
				const exists = rs.getTracks().some((x) => x.id === t.id)
				if (!exists) rs.addTrack(t)
			})
			setRemoteStream(rs)
			if (onRemoteStream) onRemoteStream(rs)
		}
		;(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
				localStreamRef.current = stream
				setLocalStream(stream)
				if (onLocalStream) onLocalStream(stream)
				stream.getTracks().forEach((track) => pc.addTrack(track, stream))
			} catch (err) {
				try {
					const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
					localStreamRef.current = stream
					setLocalStream(stream)
					if (onLocalStream) onLocalStream(stream)
					stream.getTracks().forEach((track) => pc.addTrack(track, stream))
					setIsVideoEnabled(false)
				} catch {
					setIsAudioEnabled(false)
					setIsVideoEnabled(false)
				}
			}
		})()

		return () => {
			try {
				pc.close()
			} catch {}
			pcRef.current = null

			const ls = localStreamRef.current
			if (ls) ls.getTracks().forEach((t) => t.stop())
			localStreamRef.current = null

			remoteStreamRef.current = null
			setRemoteStream(null)
			expectingAnswerRef.current = false
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const createOffer = useCallback(async () => {
		const pc = pcRef.current
		if (!pc) throw new Error('PeerConnection not ready')
		const offer = await pc.createOffer({ iceRestart: false })
		await pc.setLocalDescription(offer)
		expectingAnswerRef.current = true
		return offer
	}, [])

	const createAnswer = useCallback(async () => {
		const pc = pcRef.current
		if (!pc) throw new Error('PeerConnection not ready')
		const answer = await pc.createAnswer()
		await pc.setLocalDescription(answer)
		return answer
	}, [])

	const setRemoteDescription = useCallback(async (desc) => {
		const pc = pcRef.current
		if (!pc) throw new Error('PeerConnection not ready')

		if (desc?.type === 'answer') {
			if (pc.signalingState !== 'have-local-offer' || !expectingAnswerRef.current) {
				console.warn('Ignoring unexpected answer. signalingState=', pc.signalingState)
				return
			}
		}

		await pc.setRemoteDescription(new RTCSessionDescription(desc))

		if (desc?.type === 'answer') {
			expectingAnswerRef.current = false
		}

		if (candidateQueueRef.current.length > 0) {
			for (const c of candidateQueueRef.current) {
				try {
					await pc.addIceCandidate(new RTCIceCandidate(c))
				} catch {}
			}
			candidateQueueRef.current = []
		}
	}, [])

	const addIceCandidate = useCallback(async (candidate) => {
		if (!candidate) return
		const pc = pcRef.current
		if (!pc) return
		if (!pc.remoteDescription) {
			candidateQueueRef.current.push(candidate)
			return
		}
		try {
			await pc.addIceCandidate(new RTCIceCandidate(candidate))
		} catch {}
	}, [])

	const renegotiate = useCallback(async () => {
		const pc = pcRef.current
		if (!pc) throw new Error('PeerConnection not ready')
		const offer = await pc.createOffer({ iceRestart: false })
		await pc.setLocalDescription(offer)
		expectingAnswerRef.current = true
		return offer
	}, [])

	const toggleAudio = () => {
		const ls = localStreamRef.current
		if (!ls) return

		ls.getAudioTracks().forEach((track) => {
			track.enabled = !track.enabled
		})

		setIsAudioEnabled((prev) => !prev)
	}

	const toggleVideo = useCallback(() => {
		const ls = localStreamRef.current
		if (!ls) return

		ls.getVideoTracks().forEach((track) => {
			track.enabled = !track.enabled
		})

		setIsVideoEnabled((prev) => !prev)

		if (onLocalStream) onLocalStream(ls)
	}, [])

	const hangUp = useCallback(() => {
		const pc = pcRef.current
		try {
			pc?.getSenders().forEach((s) => {
				try {
					s.track && s.track.stop()
				} catch {}
			})
			pc?.close()
		} catch {
		} finally {
			pcRef.current = null
			const ls = localStreamRef.current
			if (ls) ls.getTracks().forEach((t) => t.stop())
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

	const getSignalingState = useCallback(() => pcRef.current?.signalingState, [])

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
		getSignalingState,
	}
}

export default useWebRtcPeer
