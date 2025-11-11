import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import useFetch from '@/hooks/useFetch'
import useMeetingSignalR from '@/hooks/useMeetingSignalR'
import useTranslation from '@/hooks/useTranslation'
import useWebRtcPeer from '@/hooks/useWebRtcPeer'
import { MicOff, VideocamOff } from '@mui/icons-material'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatSidebar from '../../components/ChatSidebar'
import ControlBar from '../../components/ControlBar'

const PatientMeetingRoomTeleSessionSection = ({ transactionId }) => {
	const { t } = useTranslation()
	const { auth } = useAuth()
	const navigate = useNavigate()
	const localVideoRef = useRef(null)
	const remoteVideoRef = useRef(null)
	const [error, setError] = useState('')
	const [hasRemoteParticipant, setHasRemoteParticipant] = useState(false)
	const [pendingOffer, setPendingOffer] = useState(null)
	const [remoteConnectionId, setRemoteConnectionId] = useState(null)
	const [isMicOn, setIsMicOn] = useState(true)
	const [isCamOn, setIsCamOn] = useState(true)
	const [showChat, setShowChat] = useState(false)
	const [chatInput, setChatInput] = useState('')
	const [messages, setMessages] = useState([])
	const [remoteMicOn, setRemoteMicOn] = useState(true)
	const [remoteCamOn, setRemoteCamOn] = useState(true)
	const isCaller = String(auth?.role || '').toLowerCase() === 'patient'

	const session = useFetch(ApiUrls.TELE_SESSION.DETAIL(transactionId), {}, [transactionId])

	const iceServers = useMemo(() => session?.credentials?.iceServers ?? [], [session])
	const signalRHubUrl = useMemo(() => session?.credentials?.signalR?.hubUrl, [session])

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
		renegotiate,
		clearRemoteStream,
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
		joinedRoomCode,
	} = useMeetingSignalR({
		transactionId,
		roomCode: null,
		hubUrl: signalRHubUrl,
		onJoinSucceeded: () => {},
		onJoinFailed: () => {
			setError(t('telehealth.error.session_not_ready'))
		},
		onParticipantJoined: (connectionId) => {
			setRemoteConnectionId(connectionId)
			setHasRemoteParticipant(true)
		},
		onParticipantLeft: (id) => {
			if (id === remoteConnectionId) {
				setHasRemoteParticipant(false)
				setRemoteConnectionId(null)

				// Reset remote states
				setRemoteMicOn(true)
				setRemoteCamOn(true)

				// Clear remote video and stream
				clearRemoteStream()
				if (remoteVideoRef.current) {
					remoteVideoRef.current.srcObject = null
					// Force refresh video element
					remoteVideoRef.current.load()
				}
			}
		},
		onOffer: async (senderId, offer) => {
			await setRemoteDescription(offer)
			const answer = await createAnswer()
			await sendAnswer(answer)
		},
		onAnswer: async (senderId, answer) => {
			await setRemoteDescription(answer)
			setPendingOffer(null)
		},
		onIceCandidate: async (senderId, candidate) => {
			await addIceCandidate(candidate)
		},
		onStateUpdated: (_senderId, state) => {
			if (typeof state?.micOn === 'boolean') setRemoteMicOn(state.micOn)
			if (typeof state?.camOn === 'boolean') setRemoteCamOn(state.camOn)
		},
	})

	useEffect(() => {
		if (!session?.credentials || !signalRHubUrl) return
		startConnection()
		return () => stopConnection()
	}, [session, signalRHubUrl, startConnection, stopConnection])

	useEffect(() => {
		if (!localStream) return
		if (!joinedRoomCode) return
		if (!hasRemoteParticipant) return
		if (!isCaller) return
		if (pendingOffer) return
		;(async () => {
			const offer = await createOffer()
			setPendingOffer(offer)
			await sendOffer(offer)
		})()
	}, [
		localStream,
		joinedRoomCode,
		hasRemoteParticipant,
		isCaller,
		pendingOffer,
		createOffer,
		sendOffer,
	])

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
							toggleVideo()
							notifyState({ camOn: next })
							if (isCaller) {
								try {
									const offer = await renegotiate()
									await sendOffer(offer)
								} catch (e) {
									console.error('Renegotiate failed', e)
								}
							}
						}}
						onToggleChat={() => setShowChat(!showChat)}
						onEndCall={async () => {
							try {
								// Clear video elements immediately
								if (localVideoRef.current) {
									localVideoRef.current.srcObject = null
									localVideoRef.current.load()
								}
								if (remoteVideoRef.current) {
									remoteVideoRef.current.srcObject = null
									remoteVideoRef.current.load()
								}

								// Clear remote stream and hangup
								clearRemoteStream()
								hangUp()
								await leaveSession()
							} finally {
								// Navigate to end meeting page
								navigate(
									routeUrls.BASE_ROUTE.PATIENT(
										routeUrls.PATIENT.APPOINTMENT.JOIN_MEETING_ROOM + '/complete'
									),
									{
										replace: true,
									}
								)
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

export default PatientMeetingRoomTeleSessionSection
