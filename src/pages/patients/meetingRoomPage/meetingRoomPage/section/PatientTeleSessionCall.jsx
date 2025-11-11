import { ApiUrls } from '@/configs/apiUrls'
import useAuth from '@/hooks/useAuth'
import useFetch from '@/hooks/useFetch'
import useMeetingSignalR from '@/hooks/useMeetingSignalR'
import useTranslation from '@/hooks/useTranslation'
import useWebRtcPeer from '@/hooks/useWebRtcPeer'
import { MicOff, VideocamOff } from '@mui/icons-material'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import ChatSidebar from './ChatSidebar'
import ControlBar from './ControlBar'

const PatientTeleSessionCall = ({ transactionId }) => {
	const { t } = useTranslation()
	const { auth } = useAuth()
	const localVideoRef = useRef(null)
	const remoteVideoRef = useRef(null)
	const offerSentRef = useRef(false)
	const [error, setError] = useState('')
	const [hasRemoteParticipant, setHasRemoteParticipant] = useState(false)
	const [remoteConnectionId, setRemoteConnectionId] = useState(null)
	const [isMicOn, setIsMicOn] = useState(true)
	const [isCamOn, setIsCamOn] = useState(true)
	const [showChat, setShowChat] = useState(false)
	const [chatInput, setChatInput] = useState('')
	const [messages, setMessages] = useState([])
	const [remoteMicOn, setRemoteMicOn] = useState(true)
	const [remoteCamOn, setRemoteCamOn] = useState(true)
	const isCaller = String(auth?.role || '').toLowerCase() === 'patient'

	const { data: session, error: sessionError } = useFetch(
		ApiUrls.TELE_SESSION.DETAIL(transactionId),
		{},
		[transactionId]
	)

	useEffect(() => {
		if (sessionError) {
			setError(t('telehealth.error.session_not_ready'))
		}
	}, [sessionError, t])

	console.log(session)
	const iceServers = session?.credentials?.iceServers || []
	const signalRHubUrl = session?.credentials?.signalR?.hubUrl || null

	const onLocalStream = (stream) => {
		if (localVideoRef.current) localVideoRef.current.srcObject = stream
	}
	const onRemoteStream = (stream) => {
		if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream
	}

	const {
		createOffer,
		createAnswer,
		setRemoteDescription,
		addIceCandidate,
		toggleAudio,
		toggleVideo,
		hangUp,
		renegotiate, // CHANGED: dùng cho re-negotiation sau khi bật/tắt cam
	} = useWebRtcPeer({
		iceServers,
		onLocalStream,
		onRemoteStream,
		onIceCandidate: (c) => sendIceCandidate(c),
	})

	const {
		sendOffer,
		sendAnswer,
		sendIceCandidate,
		notifyState,
		leaveSession,
		startConnection,
		stopConnection,
		// joinedRoomCode: có thể lấy ra nếu cần hiển thị
	} = useMeetingSignalR({
		transactionId,
		roomCode: null, // patient join bằng transactionId
		hubUrl: signalRHubUrl,
		onJoinSucceeded: () => {},
		onJoinFailed: () => {
			setError(t('telehealth.error.session_not_ready'))
		},
		onParticipantJoined: (connectionId) => {
			setRemoteConnectionId(connectionId)
			setHasRemoteParticipant(true)
		},
		onParticipantLeft: (connectionId) => {
			if (connectionId === remoteConnectionId) {
				setHasRemoteParticipant(false)
				setRemoteConnectionId(null)
			}
		},
		onOffer: async (senderId, offer) => {
			await setRemoteDescription(offer)
			const answer = await createAnswer()
			await sendAnswer(answer)
		},
		onAnswer: async (senderId, answer) => {
			await setRemoteDescription(answer)
		},
		onIceCandidate: async (senderId, candidate) => {
			await addIceCandidate(candidate)
		},
		onStateUpdated: (_senderId, state) => {
			// CHANGED: nhận (senderId, state)
			if (typeof state?.micOn === 'boolean') setRemoteMicOn(state.micOn)
			if (typeof state?.camOn === 'boolean') setRemoteCamOn(state.camOn)
		},
	})

	useEffect(() => {
		if (!session?.credentials || !signalRHubUrl) return
		startConnection()
		return () => stopConnection()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signalRHubUrl])

	// Tạo & gửi offer khi phát hiện có participant (patient là caller)
	useEffect(() => {
		if (!hasRemoteParticipant || !isCaller) return
		if (offerSentRef.current) return
		;(async () => {
			const offer = await createOffer()
			offerSentRef.current = true
			await sendOffer(offer)
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasRemoteParticipant, isCaller])

	if (error) {
		return (
			<Paper variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
				<Typography color='error'>{error}</Typography>
			</Paper>
		)
	}

	const handleSendMessage = () => {
		if (!chatInput.trim()) return
		setMessages((prev) => [...prev, { text: chatInput, me: true }])
		setChatInput('')
	}

	const renegotiateAndSend = async () => {
		try {
			const offer = await renegotiate()
			await sendOffer(offer)
		} catch (err) {
			console.error('Renegotiate failed', err)
		}
	}

	return (
		<Box>
			<Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
				<Stack sx={{ flex: 1 }}>
					<Box sx={{ position: 'relative', mb: 2 }}>
						{/* Remote video */}
						<Paper
							variant='outlined'
							sx={{
								position: 'relative',
								p: 1,
								borderRadius: 2,
								height: { xs: '400px', md: '600px' },
								backgroundColor: 'black',
							}}
						>
							{!remoteMicOn && (
								<Box
									sx={{
										position: 'absolute',
										top: 12,
										right: 12,
										zIndex: 2,
										bgcolor: 'error.main',
										color: 'common.white',
										width: 32,
										height: 32,
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: 2,
									}}
								>
									<MicOff fontSize='small' />
								</Box>
							)}
							{!remoteCamOn && (
								<Box
									sx={{
										position: 'absolute',
										inset: 8,
										borderRadius: 1.5,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										backgroundColor: 'action.hover',
										zIndex: 1,
									}}
								>
									<VideocamOff sx={{ fontSize: 64, color: 'text.disabled' }} />
								</Box>
							)}
							<video
								ref={remoteVideoRef}
								autoPlay
								playsInline
								style={{
									display: remoteCamOn ? 'block' : 'none',
									width: '100%',
									height: '100%',
									borderRadius: 8,
									objectFit: 'contain',
								}}
							/>
						</Paper>

						{/* Local preview */}
						<Paper
							variant='outlined'
							sx={{
								p: 0.5,
								position: 'absolute',
								bottom: 16,
								right: 16,
								width: { xs: '120px', md: '180px' },
								height: { xs: '80px', md: '120px' },
								borderRadius: 2,
								backgroundColor: 'black',
								zIndex: 1,
							}}
						>
							{!isMicOn && (
								<Box
									sx={{
										position: 'absolute',
										top: 6,
										right: 6,
										zIndex: 3,
										bgcolor: 'error.main',
										color: 'common.white',
										width: 24,
										height: 24,
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: 2,
									}}
								>
									<MicOff sx={{ fontSize: 16 }} />
								</Box>
							)}
							{!isCamOn && (
								<Box
									sx={{
										position: 'absolute',
										inset: 4,
										borderRadius: 1,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										backgroundColor: 'action.hover',
										zIndex: 2,
									}}
								>
									<VideocamOff sx={{ fontSize: 32, color: 'text.disabled' }} />
								</Box>
							)}
							<video
								ref={localVideoRef}
								autoPlay
								playsInline
								muted
								style={{
									display: isCamOn ? 'block' : 'none',
									width: '100%',
									height: '100%',
									borderRadius: 6,
									objectFit: 'cover',
								}}
							/>
						</Paper>
					</Box>

					<ControlBar
						micOn={isMicOn}
						camOn={isCamOn}
						onToggleMic={() => {
							const next = !isMicOn
							setIsMicOn(next)
							toggleAudio()
							notifyState({ micOn: next })
						}}
						onToggleCam={async () => {
							const next = !isCamOn
							setIsCamOn(next)
							await toggleVideo()
							notifyState({ camOn: next })
							// CHANGED: caller chủ động renegotiate để remote cập nhật SDP
							if (isCaller) {
								renegotiateAndSend()
							}
						}}
						onToggleChat={() => setShowChat(!showChat)}
						onEndCall={() => {
							hangUp()
							leaveSession()
						}}
					/>
				</Stack>

				<ChatSidebar
					show={showChat}
					messages={messages}
					chatInput={chatInput}
					setShow={setShowChat}
					setChatInput={setChatInput}
					onSend={handleSendMessage}
				/>
			</Stack>
		</Box>
	)
}

export default PatientTeleSessionCall
