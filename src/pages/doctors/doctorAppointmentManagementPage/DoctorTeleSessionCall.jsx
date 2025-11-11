import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import useFetch from '@/hooks/useFetch'
import useMeetingSignalR from '@/hooks/useMeetingSignalR'
import useTranslation from '@/hooks/useTranslation'
import useWebRtcPeer from '@/hooks/useWebRtcPeer'
import ChatSidebar from '@/pages/patients/meetingRoomPage/meetingRoomPage/section/ChatSidebar'
import ControlBar from '@/pages/patients/meetingRoomPage/meetingRoomPage/section/ControlBar'
import { MicOff, VideocamOff } from '@mui/icons-material'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorTeleSessionCall = ({ doctorId }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const localVideoRef = useRef(null)
	const remoteVideoRef = useRef(null)

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

	const room = useFetch(ApiUrls.TELE_ROOM.GET_BY_DOCTOR(doctorId), {}, [doctorId])
	const iceServers = useMemo(() => room?.credentials?.iceServers ?? [], [room])
	const signalRHubUrl = useMemo(() => room?.credentials?.signalR?.hubUrl, [room])
	const roomCode = room?.roomCode

	const onLocalStream = (stream) => {
		if (localVideoRef.current) localVideoRef.current.srcObject = stream
	}
	const onRemoteStream = (stream) => {
		if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream
		// đảm bảo autoplay
		remoteVideoRef.current?.play?.().catch(() => {})
	}

	const {
		createAnswer,
		setRemoteDescription,
		addIceCandidate,
		toggleAudio,
		toggleVideo,
		hangUp,
		renegotiate, // giữ để sau dùng nếu add/remove track thực sự
		localStream,
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
	} = useMeetingSignalR({
		transactionId: null,
		roomCode,
		hubUrl: signalRHubUrl,
		onJoinSucceeded: () => {},
		onJoinFailed: () => setError(t('telehealth.error.session_not_ready')),
		onParticipantJoined: (id) => {
			setRemoteConnectionId(id)
			setHasRemoteParticipant(true)
		},
		onParticipantLeft: (id) => {
			if (id && id === remoteConnectionId) {
				setHasRemoteParticipant(false)
				setRemoteConnectionId(null)
				if (remoteVideoRef.current) {
					remoteVideoRef.current.srcObject = null
				}
			}
		},
		onOffer: async (_senderId, offer) => {
			await setRemoteDescription(offer)
			// đợi local tracks sẵn sàng rồi mới tạo answer
			const waitForLocal = async (timeoutMs = 4000) => {
				const start = Date.now()
				while (!localStream) {
					await new Promise((r) => setTimeout(r, 40))
					if (Date.now() - start > timeoutMs) break
				}
			}
			await waitForLocal()
			const answer = await createAnswer()
			await sendAnswer(answer)
		},
		onAnswer: async (_senderId, answer) => {
			await setRemoteDescription(answer)
		},
		onIceCandidate: async (_senderId, candidate) => {
			await addIceCandidate(candidate)
		},
		onStateUpdated: (_senderId, state) => {
			if (typeof state?.micOn === 'boolean') setRemoteMicOn(state.micOn)
			if (typeof state?.camOn === 'boolean') setRemoteCamOn(state.camOn)
		},
	})

	useEffect(() => {
		if (!roomCode || !signalRHubUrl) return
		startConnection()
		return () => stopConnection()
	}, [roomCode, signalRHubUrl, startConnection, stopConnection])

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
						onToggleCam={() => {
							const next = !isCamOn
							setIsCamOn(next)
							toggleVideo()
							notifyState({ camOn: next })
							// Không renegotiate khi chỉ bật/tắt track.enabled
						}}
						onToggleChat={() => setShowChat(!showChat)}
						onEndCall={async () => {
							try {
								hangUp()
								await leaveSession()
							} finally {
								navigate(routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.DASHBOARD), { replace: true })
							}
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

export default DoctorTeleSessionCall
