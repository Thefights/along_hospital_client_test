import { routeUrls } from '@/configs/routeUrls'
import { Box, Container, Stack } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatSidebar from './section/ChatSidebar'
import ControlBar from './section/ControlBar'
import DoctorActions from './section/DoctorActions'
import MeetingStatusBadge from './section/MeetingStatusBadge'
import VideoStage from './section/VideoStage'

const MeetingRoomPage = () => {
	const navigate = useNavigate()

	const [micOn, setMicOn] = useState(true)
	const [camOn, setCamOn] = useState(true)
	const [showChat, setShowChat] = useState(false)
	const [chatInput, setChatInput] = useState('')
	const [messages, setMessages] = useState([])

	// duration text is handled inside MeetingStatusBadge

	return (
		<Box
			sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 0 }, bgcolor: (t) => t.palette.background.default }}
		>
			<Container maxWidth='lg'>
				<MeetingStatusBadge timeText='0:43' />

				<Stack direction='row' spacing={2} alignItems='stretch'>
					<VideoStage remoteName='Dr. Sarah Chen' />
					<ChatSidebar
						show={showChat}
						messages={messages}
						chatInput={chatInput}
						setShow={setShowChat}
						setChatInput={setChatInput}
						onSend={() => {
							if (!chatInput.trim()) return
							setMessages((arr) => [...arr, { me: true, text: chatInput.trim() }])
							setChatInput('')
						}}
					/>
				</Stack>

				<ControlBar
					micOn={micOn}
					camOn={camOn}
					onToggleMic={() => setMicOn((v) => !v)}
					onToggleCam={() => setCamOn((v) => !v)}
					onToggleChat={() => setShowChat((v) => !v)}
					onEndCall={() =>
						navigate(
							routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.APPOINTMENT.JOIN_MEETING_ROOM + '/complete')
						)
					}
				/>
				<DoctorActions
					onCreateMedicalHistory={() =>
						navigate(routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.APPOINTMENT_MANAGEMENT))
					}
				/>
			</Container>
		</Box>
	)
}

export default MeetingRoomPage
