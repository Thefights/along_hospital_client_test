import { useCallback, useEffect, useRef, useState } from 'react'

type IceServer = {
  urls: string | string[]
  username?: string | null
  credential?: string | null
}

type Props = {
  iceServers?: IceServer[]
  onLocalStream?: (s: MediaStream | null) => void
  onRemoteStream?: (s: MediaStream | null) => void
  onIceCandidate?: (c: RTCIceCandidateInit) => void
}

const useWebRtcPeer = ({ iceServers = [], onLocalStream, onRemoteStream, onIceCandidate }: Props) => {
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const candidateQueueRef = useRef<RTCIceCandidateInit[]>([])
  const expectingAnswerRef = useRef(false)

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  useEffect(() => {
    console.log('[WEBRTC] creating RTCPeerConnection with', iceServers)
    const pc = new RTCPeerConnection({
      iceServers,
      iceTransportPolicy: 'all', // bám TCP/TLS khi NAT chặt
    })
    pcRef.current = pc

    // ====== LOG TRẠNG THÁI ======
    pc.onsignalingstatechange = () => console.log('[PC] signalingState =', pc.signalingState)
    pc.onicegatheringstatechange = () => console.log('[PC] iceGatheringState =', pc.iceGatheringState)
    pc.oniceconnectionstatechange = () => console.log('[PC] iceConnectionState =', pc.iceConnectionState)
    pc.onconnectionstatechange = () => console.log('[PC] connectionState =', pc.connectionState)

    const ensureRemoteStream = () => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream()
        setRemoteStream(remoteStreamRef.current)
        onRemoteStream?.(remoteStreamRef.current)
      }
      return remoteStreamRef.current
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        const c = e.candidate
        console.log('[ICE][LOCAL]', c.type, c.protocol, c.address, c.port, c.relatedAddress, c.relatedPort)
        onIceCandidate?.(c.toJSON())
      } else {
        console.log('[ICE] end-of-candidates')
      }
    }

    pc.ontrack = (e) => {
      console.log('[PC] ontrack: streams[0] tracks =', e.streams?.[0]?.getTracks()?.length)
      const rs = ensureRemoteStream()
      e.streams[0].getTracks().forEach((t) => {
        const exists = rs.getTracks().some((x) => x.id === t.id)
        if (!exists) rs.addTrack(t)
      })
      setRemoteStream(rs)
      onRemoteStream?.(rs)
    }

    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        console.log('[GUM] got audio+video')
        localStreamRef.current = stream
        setLocalStream(stream)
        onLocalStream?.(stream)
        stream.getTracks().forEach((track) => pc.addTrack(track, stream))
      } catch (err) {
        console.warn('[GUM] video failed, retry audio-only', err)
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          console.log('[GUM] got audio-only')
          localStreamRef.current = stream
          setLocalStream(stream)
          onLocalStream?.(stream)
          stream.getTracks().forEach((track) => pc.addTrack(track, stream))
          setIsVideoEnabled(false)
        } catch (e) {
          console.error('[GUM] audio/video denied', e)
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
    console.log('[SDP] createOffer done')
    await pc.setLocalDescription(offer)
    console.log('[SDP] setLocalDescription(offer)')
    expectingAnswerRef.current = true
    return offer
  }, [])

  const createAnswer = useCallback(async () => {
    const pc = pcRef.current
    if (!pc) throw new Error('PeerConnection not ready')
    const answer = await pc.createAnswer()
    console.log('[SDP] createAnswer done')
    await pc.setLocalDescription(answer)
    console.log('[SDP] setLocalDescription(answer)')
    return answer
  }, [])

  const setRemoteDescription = useCallback(async (desc: RTCSessionDescriptionInit) => {
    const pc = pcRef.current
    if (!pc) throw new Error('PeerConnection not ready')

    if (desc?.type === 'answer') {
      if (pc.signalingState !== 'have-local-offer' || !expectingAnswerRef.current) {
        console.warn('[SDP] ignoring unexpected answer. signalingState =', pc.signalingState)
        return
      }
    }

    await pc.setRemoteDescription(new RTCSessionDescription(desc))
    console.log('[SDP] setRemoteDescription', desc?.type)

    if (desc?.type === 'answer') {
      expectingAnswerRef.current = false
    }

    if (candidateQueueRef.current.length > 0) {
      console.log('[ICE] flushing queued remote candidates:', candidateQueueRef.current.length)
      for (const c of candidateQueueRef.current) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(c))
        } catch (e) {
          console.warn('[ICE] addIceCandidate (flushed) failed', e)
        }
      }
      candidateQueueRef.current = []
    }
  }, [])

  const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    if (!candidate) return
    const pc = pcRef.current
    if (!pc) return
    if (!pc.remoteDescription) {
      console.log('[ICE] queue remote candidate (no remoteDescription yet)')
      candidateQueueRef.current.push(candidate)
      return
    }
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
      // optional: log một phần string candidate
      console.log('[ICE][REMOTE] added')
    } catch (e) {
      console.warn('[ICE] addIceCandidate failed', e)
    }
  }, [])

  const renegotiate = useCallback(async () => {
    const pc = pcRef.current
    if (!pc) throw new Error('PeerConnection not ready')
    const offer = await pc.createOffer({ iceRestart: false })
    console.log('[SDP] renegotiate -> createOffer done')
    await pc.setLocalDescription(offer)
    console.log('[SDP] renegotiate -> setLocalDescription(offer)')
    expectingAnswerRef.current = true
    return offer
  }, [])

  const toggleAudio = () => {
    const ls = localStreamRef.current
    if (!ls) return
    ls.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
    const next = !isAudioEnabled
    console.log('[MEDIA] toggleAudio ->', next ? 'ON' : 'OFF')
    setIsAudioEnabled(next)
  }

  const toggleVideo = useCallback(() => {
    const ls = localStreamRef.current
    if (!ls) return
    ls.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
    const next = !isVideoEnabled
    console.log('[MEDIA] toggleVideo ->', next ? 'ON' : 'OFF')
    setIsVideoEnabled(next)
    onLocalStream?.(ls)
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
      console.log('[CALL] hangUp -> closed')
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
