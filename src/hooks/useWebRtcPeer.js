import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useWebRtcPeer (phiên bản đã tối ưu)
 *
 * Params:
 * - iceServers: [{ urls, username?, credential? }, ...]
 * - onLocalStream(stream)
 * - onRemoteStream(stream)
 * - onIceCandidate(candidateInit)
 *
 * Returns:
 * - createOffer(): Promise<RTCSessionDescriptionInit>
 * - createAnswer(): Promise<RTCSessionDescriptionInit>
 * - setRemoteDescription(desc): Promise<void>
 * - addIceCandidate(candidate): Promise<void>
 * - renegotiate(): Promise<RTCSessionDescriptionInit>   // tiện cho toggle video/ICE restart
 * - toggleAudio(): void
 * - toggleVideo(): Promise<void>
 * - hangUp(): void
 * - localStream, remoteStream, isAudioEnabled, isVideoEnabled
 */
const useWebRtcPeer = ({ iceServers = [], onLocalStream, onRemoteStream, onIceCandidate }) => {
	const pcRef = useRef(null)
	const localStreamRef = useRef(null)
	const remoteStreamRef = useRef(null)
	const candidateQueueRef = useRef([]) // hàng đợi ICE khi chưa setRemoteDescription

	const [localStream, setLocalStream] = useState(null)
	const [remoteStream, setRemoteStream] = useState(null)
	const [isAudioEnabled, setIsAudioEnabled] = useState(true)
	const [isVideoEnabled, setIsVideoEnabled] = useState(true)

	// Khởi tạo PC + media
	useEffect(() => {
		const pc = new RTCPeerConnection({ iceServers })
		pcRef.current = pc

		// Tạo remoteStream một lần
		const ensureRemoteStream = () => {
			if (!remoteStreamRef.current) {
				remoteStreamRef.current = new MediaStream()
				setRemoteStream(remoteStreamRef.current)
				onRemoteStream && onRemoteStream(remoteStreamRef.current)
			}
			return remoteStreamRef.current
		}

		// ICE local
		pc.onicecandidate = (e) => {
			if (e.candidate && onIceCandidate) {
				onIceCandidate(e.candidate.toJSON())
			}
		}

		// Khi remote add track
		pc.ontrack = (e) => {
			const rs = ensureRemoteStream()
			// Thêm từng track nếu chưa có
			e.streams[0].getTracks().forEach((t) => {
				const exists = rs.getTracks().some((x) => x.id === t.id)
				if (!exists) rs.addTrack(t)
			})
			// cập nhật state cho UI
			setRemoteStream(rs)
			onRemoteStream && onRemoteStream(rs)
		}

		// Kết nối/ICE state (tùy cần log/debug)
		pc.onconnectionstatechange = () => {
			// console.log('connectionState:', pc.connectionState)
		}
		pc.oniceconnectionstatechange = () => {
			// console.log('iceConnectionState:', pc.iceConnectionState)
		}
		;(async () => {
			try {
				// Lấy mic+cam ngay từ đầu
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
				localStreamRef.current = stream
				setLocalStream(stream)
				onLocalStream && onLocalStream(stream)

				// Add track lên PC (mỗi kind một sender)
				stream.getTracks().forEach((track) => pc.addTrack(track, stream))
			} catch (err) {
				console.error('getUserMedia failed', err)
				// Nếu user deny camera, vẫn thử xin audio
				try {
					const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
					localStreamRef.current = stream
					setLocalStream(stream)
					onLocalStream && onLocalStream(stream)
					stream.getTracks().forEach((track) => pc.addTrack(track, stream))
					setIsVideoEnabled(false)
				} catch (e2) {
					console.error('getUserMedia audio-only failed', e2)
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

			// Dừng local tracks
			const ls = localStreamRef.current
			if (ls) {
				ls.getTracks().forEach((t) => t.stop())
			}
			localStreamRef.current = null

			// Clear remote
			remoteStreamRef.current = null
			setRemoteStream(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const createOffer = useCallback(async () => {
		const pc = pcRef.current
		if (!pc) throw new Error('PeerConnection not ready')
		const offer = await pc.createOffer({ iceRestart: false })
		await pc.setLocalDescription(offer)
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
		await pc.setRemoteDescription(new RTCSessionDescription(desc))

		// Sau khi có remoteDescription, add các ICE đã xếp hàng
		if (candidateQueueRef.current.length > 0) {
			for (const c of candidateQueueRef.current) {
				try {
					await pc.addIceCandidate(new RTCIceCandidate(c))
				} catch (err) {
					console.warn('Queued addIceCandidate failed', err)
				}
			}
			candidateQueueRef.current = []
		}
	}, [])

	const addIceCandidate = useCallback(async (candidate) => {
		if (!candidate) return
		const pc = pcRef.current
		if (!pc) return
		// Nếu chưa có remote description, xếp hàng đợi
		if (!pc.remoteDescription) {
			candidateQueueRef.current.push(candidate)
			return
		}
		try {
			await pc.addIceCandidate(new RTCIceCandidate(candidate))
		} catch (err) {
			console.warn('addIceCandidate failed', err)
		}
	}, [])

	// Tiện ích: tạo Offer để renegotiation khi thay đổi video
	const renegotiate = useCallback(async () => {
		const pc = pcRef.current
		if (!pc) throw new Error('PeerConnection not ready')
		const offer = await pc.createOffer({ iceRestart: false })
		await pc.setLocalDescription(offer)
		return offer
	}, [])

	const toggleAudio = useCallback(() => {
		const ls = localStreamRef.current
		setIsAudioEnabled((prev) => {
			const next = !prev
			ls?.getAudioTracks().forEach((t) => (t.enabled = next))
			return next
		})
	}, [])

	const toggleVideo = useCallback(async () => {
		const pc = pcRef.current
		if (!pc) return
		const ls = localStreamRef.current || new MediaStream()

		// Tìm video sender hiện tại (nếu có)
		const senders = pc.getSenders ? pc.getSenders() : []
		const videoSender = senders.find((s) => s.track && s.track.kind === 'video')

		if (isVideoEnabled) {
			// TẮT VIDEO: stop track hiện tại, replaceTrack(null) để giữ transceiver
			ls.getVideoTracks().forEach((t) => {
				try {
					t.stop()
					ls.removeTrack(t)
				} catch {}
			})
			try {
				if (videoSender) await videoSender.replaceTrack(null)
			} catch (e) {
				console.warn('replaceTrack(null) failed', e)
			}
			setIsVideoEnabled(false)
			setLocalStream(ls)
			onLocalStream && onLocalStream(ls)
			// Sau khi thay đổi track → cần renegotiate ở phía caller (gọi renegotiate() và gửi Offer)
			return
		}

		// BẬT LẠI VIDEO: xin video track mới, replaceTrack hoặc addTrack
		try {
			const cam = await navigator.mediaDevices.getUserMedia({ video: true })
			const [videoTrack] = cam.getVideoTracks()
			if (videoTrack) {
				if (videoSender) {
					await videoSender.replaceTrack(videoTrack)
				} else {
					// Không còn sender video (do trước đó null) → addTrack mới
					pc.addTrack(videoTrack, ls)
				}

				// Gắn lại vào localStream để preview
				ls.addTrack(videoTrack)
				localStreamRef.current = ls
				setLocalStream(ls)
				onLocalStream && onLocalStream(ls)

				setIsVideoEnabled(true)
			}
		} catch (err) {
			console.error('Re-acquire camera failed', err)
		}
	}, [isVideoEnabled, onLocalStream])

	const hangUp = useCallback(() => {
		const pc = pcRef.current
		try {
			pc?.getSenders().forEach((s) => {
				try {
					s.track && s.track.stop()
				} catch {}
			})
			pc?.close()
		} catch (err) {
			console.error('hangUp error', err)
		} finally {
			pcRef.current = null
			// Stop local
			const ls = localStreamRef.current
			if (ls) {
				ls.getTracks().forEach((t) => t.stop())
			}
			localStreamRef.current = null
			// Clear remote
			remoteStreamRef.current = null
			setRemoteStream(null)
			setLocalStream(null)
			setIsVideoEnabled(false)
			setIsAudioEnabled(false)
			candidateQueueRef.current = []
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

export default useWebRtcPeer
