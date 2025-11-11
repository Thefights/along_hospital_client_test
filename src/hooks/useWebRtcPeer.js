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

	//------------------------------------------------------------
	// ❗ CHỈ TẠO RTCPeerConnection KHI iceServers ĐÃ CÓ DỮ LIỆU
	//------------------------------------------------------------
	useEffect(() => {
		if (!iceServers || iceServers.length === 0) {
			console.log('[WEBRTC] waiting for iceServers…')
			return
		}

		console.log('[WEBRTC] creating RTCPeerConnection with', iceServers)

		const pc = new RTCPeerConnection({
			iceServers,
			iceTransportPolicy: 'all',
		})
		pcRef.current = pc

		//--------------------------------
		// Logging
		//--------------------------------
		pc.onsignalingstatechange = () => console.log('[PC] signalingState =', pc.signalingState)
		pc.onicegatheringstatechange = () => console.log('[PC] iceGatheringState =', pc.iceGatheringState)
		pc.oniceconnectionstatechange = () =>
			console.log('[PC] iceConnectionState =', pc.iceConnectionState)
		pc.onconnectionstatechange = () => console.log('[PC] connectionState =', pc.connectionState)

		//--------------------------------
		// ICE candidates
		//--------------------------------
		pc.onicecandidate = (e) => {
			if (e.candidate) {
				const c = e.candidate
				console.log(
					'[ICE][LOCAL]',
					c.type,
					c.protocol,
					c.address,
					c.port,
					c.relatedAddress,
					c.relatedPort
				)
				onIceCandidate?.(c.toJSON())
			} else {
				console.log('[ICE] end-of-candidates')
			}
		}

		//--------------------------------
		// Remote track
		//--------------------------------
		const ensureRemoteStream = () => {
			if (!remoteStreamRef.current) {
				remoteStreamRef.current = new MediaStream()
				setRemoteStream(remoteStreamRef.current)
				onRemoteStream?.(remoteStreamRef.current)
			}
			return remoteStreamRef.current
		}

		pc.ontrack = (e) => {
			console.log('[PC] ontrack: tracks =', e.streams[0].getTracks().length)
			const rs = ensureRemoteStream()
			e.streams[0].getTracks().forEach((t) => {
				const exists = rs.getTracks().some((x) => x.id === t.id)
				if (!exists) rs.addTrack(t)
			})
			setRemoteStream(rs)
			onRemoteStream?.(rs)
		}

		//--------------------------------
		// Local media
		//--------------------------------
		;(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true,
				})
				console.log('[GUM] got audio+video')
				localStreamRef.current = stream
				setLocalStream(stream)
				onLocalStream?.(stream)
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
			try {
				pc.close()
			} catch {}
			pcRef.current = null

			localStreamRef.current?.getTracks().forEach((t) => t.stop())
			localStreamRef.current = null

			remoteStreamRef.current = null
			setRemoteStream(null)

			expectingAnswerRef.current = false
			candidateQueueRef.current = []
		}
	}, [JSON.stringify(iceServers)]) // 🔥 đảm bảo chỉ chạy khi server list khác

	//------------------------------------------------------------
	// OFFER / ANSWER
	//------------------------------------------------------------
	const createOffer = useCallback(async () => {
		const pc = pcRef.current
		const offer = await pc.createOffer({ iceRestart: false })
		console.log('[SDP] createOffer done')
		await pc.setLocalDescription(offer)
		console.log('[SDP] setLocalDescription(offer)')
		expectingAnswerRef.current = true
		return offer
	}, [])

	const createAnswer = useCallback(async () => {
		const pc = pcRef.current
		const answer = await pc.createAnswer()
		console.log('[SDP] createAnswer done')
		await pc.setLocalDescription(answer)
		console.log('[SDP] setLocalDescription(answer)')
		return answer
	}, [])

	const setRemoteDescription = useCallback(async (desc) => {
		const pc = pcRef.current

		if (desc?.type === 'answer') {
			if (pc.signalingState !== 'have-local-offer' || !expectingAnswerRef.current) {
				console.warn('[SDP] ignoring unexpected answer. signalingState =', pc.signalingState)
				return
			}
		}

		await pc.setRemoteDescription(new RTCSessionDescription(desc))
		console.log('[SDP] setRemoteDescription', desc?.type)

		if (desc?.type === 'answer') expectingAnswerRef.current = false

		if (candidateQueueRef.current.length > 0) {
			console.log('[ICE] flushing queued candidates:', candidateQueueRef.current.length)
			for (const c of candidateQueueRef.current) {
				try {
					await pc.addIceCandidate(new RTCIceCandidate(c))
				} catch (e) {
					console.warn('[ICE] addIceCandidate failed', e)
				}
			}
			candidateQueueRef.current = []
		}
	}, [])

	const addIceCandidate = useCallback(async (candidate) => {
		if (!candidate) return
		const pc = pcRef.current

		if (!pc.remoteDescription) {
			console.log('[ICE] queueing candidate (no remoteDescription)')
			candidateQueueRef.current.push(candidate)
			return
		}

		try {
			await pc.addIceCandidate(new RTCIceCandidate(candidate))
			console.log('[ICE][REMOTE] added')
		} catch (e) {
			console.warn('[ICE] addIceCandidate failed', e)
		}
	}, [])

	const renegotiate = useCallback(async () => {
		const pc = pcRef.current
		const offer = await pc.createOffer({ iceRestart: false })
		console.log('[SDP] renegotiate offer created')
		await pc.setLocalDescription(offer)
		console.log('[SDP] renegotiate setLocalDescription(offer)')
		expectingAnswerRef.current = true
		return offer
	}, [])

	//------------------------------------------------------------
	// TOGGLE MEDIA
	//------------------------------------------------------------
	const toggleAudio = () => {
		const ls = localStreamRef.current
		if (!ls) return
		ls.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
		const next = !isAudioEnabled
		console.log('[MEDIA] toggleAudio ->', next)
		setIsAudioEnabled(next)
	}

	const toggleVideo = useCallback(() => {
		const ls = localStreamRef.current
		if (!ls) return
		ls.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
		const next = !isVideoEnabled
		console.log('[MEDIA] toggleVideo ->', next)
		setIsVideoEnabled(next)
		onLocalStream?.(ls)
	}, [isVideoEnabled, onLocalStream])

	//------------------------------------------------------------
	// HANG UP
	//------------------------------------------------------------
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
