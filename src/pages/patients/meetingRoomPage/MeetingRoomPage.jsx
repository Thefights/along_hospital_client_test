import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import useTranslation from '@/hooks/useTranslation'
import { CallEnd, Chat, Close, Mic, MicOff, Send, Videocam, VideocamOff } from '@mui/icons-material'
import {
	Box,
	Button,
	Container,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Paper,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ControlButton = ({ title, active = true, onClick, children }) => (
	<Tooltip title={title} arrow>
		<IconButton
			onClick={onClick}
			sx={{
				bgcolor: (t) => (active ? t.palette.success.softBg : t.palette.action.hover),
				color: (t) => (active ? t.palette.success.main : t.palette.text.secondary),
				'&:hover': { bgcolor: (t) => t.palette.success.softBg },
				width: 52,
				height: 52,
			}}
		>
			{children}
		</IconButton>
	</Tooltip>
)

const MeetingRoomPage = () => {
	const { t } = useTranslation()
	const { hasRole } = useAuth()
	const navigate = useNavigate()

	const isDoctor = hasRole(['DOCTOR'])

	const [micOn, setMicOn] = useState(true)
	const [camOn, setCamOn] = useState(true)
	const [showChat, setShowChat] = useState(false)
	const [chatInput, setChatInput] = useState('')
	const [messages, setMessages] = useState([])

	const meetingDurationText = useMemo(() => t('meeting_room.title.duration_left'), [t])

	return (
		<Box
			sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 0 }, bgcolor: (t) => t.palette.background.default }}
		>
			<Container maxWidth='lg'>
				<Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
					<Paper elevation={3} sx={{ px: 1.5, py: 0.5, borderRadius: 3 }}>
						<Stack direction='row' spacing={1} alignItems='center'>
							<Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
							<Typography variant='body2' fontWeight={700}>
								0:43
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								• {meetingDurationText}
							</Typography>
						</Stack>
					</Paper>
				</Box>

				<Stack direction='row' spacing={2} alignItems='stretch'>
					<Paper
						variant='outlined'
						sx={{
							borderRadius: 3,
							height: { xs: 360, md: 520 },
							position: 'relative',
							bgcolor: (t) => t.palette.background.paper,
							overflow: 'hidden',
							flex: 1,
						}}
					>
						{/* Remote feed placeholder */}
						<Box
							sx={{
								position: 'absolute',
								inset: 0,
								bgcolor: 'action.hover',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'text.disabled',
							}}
						>
							<Typography variant='h6' color='text.disabled'>
								{t('meeting_room.remote_placeholder')}
							</Typography>
						</Box>

						{/* Remote name chip */}
						<Box sx={{ position: 'absolute', left: 16, bottom: 16 }}>
							<Paper elevation={2} sx={{ px: 1.25, py: 0.5, borderRadius: 2 }}>
								<Typography variant='body2'>Dr. Sarah Chen</Typography>
							</Paper>
						</Box>

						{/* Local preview */}
						<Paper
							elevation={3}
							sx={{
								position: 'absolute',
								right: 16,
								bottom: 16,
								width: { xs: 140, md: 200 },
								height: { xs: 90, md: 120 },
								borderRadius: 2,
								overflow: 'hidden',
								bgcolor: 'action.hover',
							}}
						>
							<Box sx={{ position: 'absolute', left: 8, bottom: 8 }}>
								<Paper elevation={1} sx={{ px: 1, py: 0.25, borderRadius: 2 }}>
									<Typography variant='caption'>You</Typography>
								</Paper>
							</Box>
						</Paper>
					</Paper>

					{showChat && (
						<Paper
							variant='outlined'
							sx={{
								borderRadius: 3,
								width: { xs: '100%', md: 340 },
								height: { xs: 360, md: 520 },
								display: { xs: 'none', md: 'flex' },
								flexDirection: 'column',
								overflow: 'hidden',
							}}
						>
							<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ p: 1.5 }}>
								<Typography fontWeight={700}>{t('meeting_room.chat_title')}</Typography>
								<IconButton onClick={() => setShowChat(false)}>
									<Close />
								</IconButton>
							</Stack>
							<Divider />
							<Box sx={{ flex: 1, overflow: 'auto', p: 1.5 }}>
								{messages.length === 0 ? (
									<Typography variant='body2' color='text.secondary'>
										{t('meeting_room.no_messages')}
									</Typography>
								) : (
									<List dense>
										{messages.map((m, idx) => (
											<ListItem key={idx} sx={{ justifyContent: m.me ? 'flex-end' : 'flex-start' }}>
												<Paper
													sx={{
														px: 1.25,
														py: 0.75,
														borderRadius: 2,
														bgcolor: m.me ? 'primary.softBg' : 'background.default',
													}}
												>
													<ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={m.text} />
												</Paper>
											</ListItem>
										))}
									</List>
								)}
							</Box>
							<Divider />
							<Stack direction='row' spacing={1} sx={{ p: 1.5 }}>
								<TextField
									size='small'
									fullWidth
									placeholder={t('meeting_room.chat_input_placeholder')}
									value={chatInput}
									onChange={(e) => setChatInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && chatInput.trim()) {
											setMessages((arr) => [...arr, { me: true, text: chatInput.trim() }])
											setChatInput('')
										}
									}}
								/>
								<IconButton
									color='primary'
									disabled={!chatInput.trim()}
									onClick={() => {
										if (!chatInput.trim()) return
										setMessages((arr) => [...arr, { me: true, text: chatInput.trim() }])
										setChatInput('')
									}}
								>
									<Send />
								</IconButton>
							</Stack>
						</Paper>
					)}
				</Stack>

				{/* Controls */}
				<Stack
					direction='row'
					spacing={1.5}
					alignItems='center'
					justifyContent='center'
					sx={{ mt: 2.5 }}
				>
					<ControlButton title={t('meeting_room.mic')} onClick={() => setMicOn((v) => !v)}>
						{micOn ? <Mic /> : <MicOff />}
					</ControlButton>
					<ControlButton title={t('meeting_room.camera')} onClick={() => setCamOn((v) => !v)}>
						{camOn ? <Videocam /> : <VideocamOff />}
					</ControlButton>

					<ControlButton title={t('meeting_room.chat')} onClick={() => setShowChat((v) => !v)}>
						<Chat />
					</ControlButton>
					<Button
						variant='contained'
						color='error'
						startIcon={<CallEnd />}
						sx={{ ml: 2, borderRadius: 999, px: 2.5 }}
						onClick={() => navigate(routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.APPOINTMENT.INDEX))}
					>
						{t('meeting_room.end_call')}
					</Button>

					{isDoctor && (
						<Button
							variant='outlined'
							color='primary'
							sx={{ ml: 1, borderRadius: 999, px: 2.5 }}
							onClick={() => {
								// Placeholder action to create medical history
								// TODO: replace with real creation flow
								navigate(routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.APPOINTMENT_MANAGEMENT))
							}}
						>
							{t('meeting_room.create_medical_history')}
						</Button>
					)}
				</Stack>
			</Container>
		</Box>
	)
}

export default MeetingRoomPage
