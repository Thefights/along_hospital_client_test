import { ApiUrls } from '@/configs/apiUrls'
import useAuth from '@/hooks/useAuth'
import useFetch from '@/hooks/useFetch'
import useMeetingSignalR from '@/hooks/useMeetingSignalR'
import { useLocalStorage } from '@/hooks/useStorage'
import useTranslation from '@/hooks/useTranslation'
import useWebRtcPeer from '@/hooks/useWebRtcPeer'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'

const TeleSessionCall = ({ transactionId }) => {
	const { t } = useTranslation()
	const { auth } = useAuth()
	const [accessToken] = useLocalStorage('accessToken')
	const localVideoRef = useRef(null)
	const remoteVideoRef = useRef(null)
	const [error, setError] = useState('')
	const [participants, setParticipants] = useState([])
	const [hasRemoteParticipant, setHasRemoteParticipant] = useState(false)
	const [pendingOffer, setPendingOffer] = useState(null)
	const [remoteConnectionId, setRemoteConnectionId] = useState(null)
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
			accessToken: accessToken || '',
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

	return (
		<Box>
			<Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
				<Paper variant='outlined' sx={{ p: 1, flex: 1, borderRadius: 2 }}>
					<video
						ref={localVideoRef}
						autoPlay
						playsInline
						muted
						style={{ width: '100%', borderRadius: 8 }}
					/>
				</Paper>
				<Paper variant='outlined' sx={{ p: 1, flex: 1, borderRadius: 2 }}>
					<video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 8 }} />
				</Paper>
			</Stack>

			<Stack direction='row' spacing={1} sx={{ mt: 2 }}>
				<Button variant='contained' onClick={startConnection}>
					{t('telehealth.button.start_call')}
				</Button>
				<Button
					variant='outlined'
					color='error'
					onClick={() => {
						hangUp()
						leaveSession()
					}}
				>
					{t('telehealth.button.hang_up')}
				</Button>
				<Button variant='outlined' onClick={toggleAudio}>
					{t('telehealth.button.mute_unmute')}
				</Button>
				<Button variant='outlined' onClick={toggleVideo}>
					{t('telehealth.button.toggle_video')}
				</Button>
			</Stack>

			<Paper variant='outlined' sx={{ p: 1.5, mt: 2, borderRadius: 2 }}>
				<Typography variant='subtitle2' sx={{ mb: 1 }}>
					{t('telehealth.participants.title')}
				</Typography>
				{participants.length === 0 ? (
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
				)}
			</Paper>
		</Box>
	)
}

export default TeleSessionCall
