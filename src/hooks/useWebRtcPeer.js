import { useCallback, useEffect, useRef, useState } from 'react'

const useWebRtcPeer = ({ iceServers = [], onLocalStream, onRemoteStream, onIceCandidate }) => {
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const candidateQueueRef = useRef<any[]>([])
  const expectingAnswerRef = useRef(false) // 🔥 NEW

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  useEffect(() => {
    const pc = new RTCPeerConnection({ iceServers })
    pcRef.current = pc

    const ensureRemoteStream = () => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream()
        setRemoteStream(remoteStreamRef.current)
        onRemoteStream && onRemoteStream(remoteStreamRef.current)
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
      onRemoteStream && onRemoteStream(rs)
    }

    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        localStreamRef.current = stream
        setLocalStream(stream)
        onLocalStream && onLocalStream(stream)
        stream.getTracks().forEach((track) => pc.addTrack(track, stream))
      } catch (err) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          localStreamRef.current = stream
          setLocalStream(stream)
          onLocalStream && onLocalStream(stream)
          stream.getTracks().forEach((track) => pc.addTrack(track, stream))
          setIsVideoEnabled(false)
        } catch {
          setIsAudioEnabled(false)
          setIsVideoEnabled(false)
        }
      }
    })()

    return () => {
      try { pc.close() } catch {}
      pcRef.current = null

      const ls = localStreamRef.current
      if (ls) ls.getTracks().forEach((t) => t.stop())
      localStreamRef.current = null

      remoteStreamRef.current = null
      setRemoteStream(null)
      expectingAnswerRef.current = false // 🔥 reset
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createOffer = useCallback(async () => {
    const pc = pcRef.current
    if (!pc) throw new Error('PeerConnection not ready')
    const offer = await pc.createOffer({ iceRestart: false })
    await pc.setLocalDescription(offer)
    expectingAnswerRef.current = true // 🔥 sẽ chờ answer cho offer này
    return offer
  }, [])

  const createAnswer = useCallback(async () => {
    const pc = pcRef.current
    if (!pc) throw new Error('PeerConnection not ready')
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    return answer
  }, [])

  const setRemoteDescription = useCallback(async (desc: RTCSessionDescriptionInit) => {
    const pc = pcRef.current
    if (!pc) throw new Error('PeerConnection not ready')

    // 🔥 Guard chống “answer” sai pha (thường gây lỗi stable)
    if (desc.type === 'answer') {
      if (pc.signalingState !== 'have-local-offer' || !expectingAnswerRef.current) {
        console.warn('Ignoring unexpected answer: signalingState=', pc.signalingState)
        return
      }
    }

    await pc.setRemoteDescription(new RTCSessionDescription(desc))

    if (desc.type === 'answer') {
      // ✅ Đã hoàn tất bắt tay cho offer vừa gửi
      expectingAnswerRef.current = false
    }

    if (candidateQueueRef.current.length > 0) {
      for (const c of candidateQueueRef.current) {
        try { await pc.addIceCandidate(new RTCIceCandidate(c)) } catch {}
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
    try { await pc.addIceCandidate(new RTCIceCandidate(candidate)) } catch {}
  }, [])

  const renegotiate = useCallback(async () => {
    const pc = pcRef.current
    if (!pc) throw new Error('PeerConnection not ready')
    const offer = await pc.createOffer({ iceRestart: false })
    await pc.setLocalDescription(offer)
    expectingAnswerRef.current = true // 🔥 re-negotiation cũng chờ answer
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
    const senders = pc.getSenders ? pc.getSenders() : []
    const videoSender = senders.find((s) => s.track && s.track.kind === 'video')

    if (isVideoEnabled) {
      ls.getVideoTracks().forEach((t) => { try { t.stop(); ls.removeTrack(t) } catch {} })
      try { if (videoSender) await videoSender.replaceTrack(null) } catch {}
      setIsVideoEnabled(false)
      setLocalStream(ls)
      onLocalStream && onLocalStream(ls)
      return
    }

    try {
      const cam = await navigator.mediaDevices.getUserMedia({ video: true })
      const [videoTrack] = cam.getVideoTracks()
      if (videoTrack) {
        if (videoSender) { await videoSender.replaceTrack(videoTrack) } else { pc.addTrack(videoTrack, ls) }
        ls.addTrack(videoTrack)
        localStreamRef.current = ls
        setLocalStream(ls)
        onLocalStream && onLocalStream(ls)
        setIsVideoEnabled(true)
      }
    } catch {}
  }, [isVideoEnabled, onLocalStream])

  const hangUp = useCallback(() => {
    const pc = pcRef.current
    try {
      pc?.getSenders().forEach((s) => { try { s.track && s.track.stop() } catch {} })
      pc?.close()
    } catch {}
    finally {
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

  // Optional: expose signalingState (nếu cần debug)
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
    getSignalingState, // optional
  }
}

export default useWebRtcPeer
