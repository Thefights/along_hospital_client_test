import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useWebRtcPeer
 * Manages an RTCPeerConnection and local/remote media streams.
 *
 * @param {Object} params
 * @param {{urls: string}[]|RTCIceServer[]} params.iceServers - ICE servers from backend
 * @param {(stream: MediaStream) => void} params.onLocalStream - Callback with local stream
 * @param {(stream: MediaStream) => void} params.onRemoteStream - Callback with remote stream
 * @param {(candidate: RTCIceCandidateInit) => void} params.onIceCandidate - Callback when local ICE is generated
 *
 * @returns {{
 *  createOffer: () => Promise<RTCSessionDescriptionInit>,
 *  createAnswer: () => Promise<RTCSessionDescriptionInit>,
 *  setRemoteDescription: (desc: RTCSessionDescriptionInit) => Promise<void>,
 *  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>,
 *  toggleAudio: () => void,
 *  toggleVideo: () => void,
 *  hangUp: () => void,
 *  localStream: MediaStream | null,
 *  remoteStream: MediaStream | null,
 *  isAudioEnabled: boolean,
 *  isVideoEnabled: boolean,
 * }}
 */
const useWebRtcPeer = ({ iceServers = [], onLocalStream, onRemoteStream, onIceCandidate }) => {
	const pcRef = useRef(null)
	const [localStream, setLocalStream] = useState(null)
	const [remoteStream, setRemoteStream] = useState(null)
	const [isAudioEnabled, setIsAudioEnabled] = useState(true)
	const [isVideoEnabled, setIsVideoEnabled] = useState(true)

	// init peer connection
	useEffect(() => {
		const pc = new RTCPeerConnection({ iceServers })
		pcRef.current = pc

		pc.onicecandidate = (e) => {
			if (e.candidate && onIceCandidate) onIceCandidate(e.candidate.toJSON())
		}

		pc.ontrack = (e) => {
			const [stream] = e.streams
			setRemoteStream(stream)
			onRemoteStream && onRemoteStream(stream)
		}
		;(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
				setLocalStream(stream)
				onLocalStream && onLocalStream(stream)
				stream.getTracks().forEach((track) => pc.addTrack(track, stream))
			} catch (err) {
				console.error('getUserMedia failed', err)
			}
		})()

		return () => {
			pc.close()
			pcRef.current = null
			if (localStream) localStream.getTracks().forEach((t) => t.stop())
		}
		// it's okay to ignore dependencies for one-time init
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const createOffer = useCallback(async () => {
		const pc = pcRef.current
		const offer = await pc.createOffer()
		await pc.setLocalDescription(offer)
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
		await pc.setRemoteDescription(new RTCSessionDescription(desc))
	}, [])

	const addIceCandidate = useCallback(async (candidate) => {
		const pc = pcRef.current
		if (!candidate) return
		await pc.addIceCandidate(new RTCIceCandidate(candidate))
	}, [])

	const toggleAudio = useCallback(() => {
		setIsAudioEnabled((prev) => {
			const next = !prev
			localStream?.getAudioTracks().forEach((t) => (t.enabled = next))
			return next
		})
	}, [localStream])

	const toggleVideo = useCallback(() => {
		setIsVideoEnabled((prev) => {
			const next = !prev
			localStream?.getVideoTracks().forEach((t) => (t.enabled = next))
			return next
		})
	}, [localStream])

	const hangUp = useCallback(() => {
		const pc = pcRef.current
		try {
			pc?.getSenders().forEach((s) => s.track && s.track.stop())
			pc?.close()
		} catch (err) {
			console.error('hangUp error', err)
		}
	}, [])

	return {
		createOffer,
		createAnswer,
		setRemoteDescription,
		addIceCandidate,
		toggleAudio,
		toggleVideo,
		hangUp,
		localStream,
		remoteStream,
		isAudioEnabled,
		isVideoEnabled,
	}
}

export default useWebRtcPeer
