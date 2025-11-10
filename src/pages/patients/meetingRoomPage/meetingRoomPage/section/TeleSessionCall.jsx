import { ApiUrls } from '@/configs/apiUrls'
import useAuth from '@/hooks/useAuth'
import useFetch from '@/hooks/useFetch'
import useMeetingSignalR from '@/hooks/useMeetingSignalR'
import useTranslation from '@/hooks/useTranslation'
import useWebRtcPeer from '@/hooks/useWebRtcPeer'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import ChatSidebar from './ChatSidebar'
import ControlBar from './ControlBar'

const TeleSessionCall = ({ transactionId }) => {
	const { t } = useTranslation()
	const { auth } = useAuth()
	const localVideoRef = useRef(null)
	const remoteVideoRef = useRef(null)
	const [error, setError] = useState('')
	const [participants, setParticipants] = useState([])
	const [hasRemoteParticipant, setHasRemoteParticipant] = useState(false)
	const [pendingOffer, setPendingOffer] = useState(null)
	const [remoteConnectionId, setRemoteConnectionId] = useState(null)
	const [isMicOn, setIsMicOn] = useState(true)
	const [isCamOn, setIsCamOn] = useState(true)
	const [showChat, setShowChat] = useState(false)
	const [chatInput, setChatInput] = useState('')
	const [messages, setMessages] = useState([])
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

	const iceServers = useMemo(() => session?.credentials?.iceServers ?? [], [session])
	const signalRHubUrl = useMemo(() => session?.credentials?.signalR?.hubUrl, [session])

	console.log(session)

	console.log(session)

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
	} = useWebRtcPeer({
		iceServers,
		onLocalStream,
		onRemoteStream,
		onIceCandidate: (c) => sendIceCandidate(c),
	})

	const { sendOffer, sendAnswer, sendIceCandidate, leaveSession, startConnection, stopConnection } =
		useMeetingSignalR({
			transactionId,
			hubUrl: signalRHubUrl,
			onJoinSucceeded: () => {
				// Chỉ log hoặc đánh dấu đã vào phòng
				console.log('Joined meeting room successfully')
			},
			onJoinFailed: () => {
				setError(t('telehealth.error.session_not_ready'))
			},
			onParticipantJoined: (connectionId) => {
				console.log('Participant joined:', connectionId)
				// Thêm vào danh sách participants
				setParticipants((prev) => {
					const existing = prev.find((x) => x.id === connectionId)
					if (existing) return prev
					return [...prev, { id: connectionId, displayName: connectionId }]
				})
				// Đánh dấu có remote participant và lưu connectionId
				setRemoteConnectionId(connectionId)
				setHasRemoteParticipant(true)
			},
			onParticipantLeft: (connectionId) => {
				console.log('Participant left:', connectionId)
				setParticipants((prev) => prev.filter((x) => x.id !== connectionId))
				// Nếu remote participant rời đi, reset state
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
				// Xóa pendingOffer khi nhận được answer
				setPendingOffer(null)
			},
			onIceCandidate: async (senderId, candidate) => {
				await addIceCandidate(candidate)
			},
		})

	useEffect(() => {
		if (!session) return
		// Chờ có credentials trước khi kết nối
		if (!session?.credentials) return
		startConnection()
		return () => stopConnection()
	}, [session, startConnection, stopConnection])

	// Effect để tạo và gửi offer khi có remote participant
	useEffect(() => {
		if (!hasRemoteParticipant || !isCaller) return

		// Tạo offer mới nếu chưa có
		if (!pendingOffer) {
			;(async () => {
				try {
					console.log('Creating and sending new offer')
					const offer = await createOffer()
					setPendingOffer(offer)
					await sendOffer(offer)
				} catch (err) {
					console.error('Failed to create/send offer:', err)
				}
			})()
		} else {
			// Nếu đã có pendingOffer, gửi lại cho participant mới
			console.log('Resending pending offer to new participant')
			sendOffer(pendingOffer).catch((err) => {
				console.error('Failed to resend offer:', err)
			})
		}
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
		// Thêm tin nhắn mới vào danh sách
		setMessages((prev) => [...prev, { text: chatInput, me: true }])
		// Gửi tin nhắn qua SignalR (có thể thêm vào useMeetingSignalR)
		// sendMessage(chatInput)
		setChatInput('')
	}

	return (
		<Box>
			<Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
				<Stack sx={{ flex: 1 }}>
					<Box sx={{ position: 'relative', mb: 2 }}>
						{/* Video chính (người đối diện) */}
						<Paper
							variant='outlined'
							sx={{
								p: 1,
								borderRadius: 2,
								height: { xs: '400px', md: '600px' },
								backgroundColor: 'black',
							}}
						>
							<video
								ref={remoteVideoRef}
								autoPlay
								playsInline
								style={{
									width: '100%',
									height: '100%',
									borderRadius: 8,
									objectFit: 'contain',
								}}
							/>
						</Paper>

						{/* Video nhỏ (local video) */}
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
							<video
								ref={localVideoRef}
								autoPlay
								playsInline
								muted
								style={{
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
							setIsMicOn(!isMicOn)
							toggleAudio()
						}}
						onToggleCam={() => {
							setIsCamOn(!isCamOn)
							toggleVideo()
						}}
						onToggleChat={() => setShowChat(!showChat)}
						onEndCall={() => {
							hangUp()
							leaveSession()
						}}
					/>

					<Paper variant='outlined' sx={{ p: 1.5, mt: 2, borderRadius: 2 }}>
						<Typography variant='subtitle2' sx={{ mb: 1 }}>
							{t('telehealth.participants.title')}
						</Typography>
						{/* {participants.length === 0 ? (
							<Typography variant='body2' color='text.secondary'>
								{t('telehealth.participants.empty')}
							</Typography>
						) : (
							<ul style={{ margin: 0, paddingLeft: 16 }}>
								{participants.map((p) => (
									<li key={p.id}>
										<Typography variant='body2'>{p.displayName || p.id}</Typography>
									</li>
								))}
							</ul>
						)} */}
					</Paper>
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

export default TeleSessionCall
