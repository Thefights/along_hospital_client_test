import useAuth from '@/hooks/useAuth'
import { Box, Container } from '@mui/material'
import DoctorTeleSessionCall from './DoctorTeleSessionCall'

const DoctorMeetingRoomPage = () => {
	const { auth } = useAuth()
	const doctorId = auth?.userId

	if (!doctorId) return null

	return (
		<Box
			sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 0 }, bgcolor: (t) => t.palette.background.default }}
		>
			<Container maxWidth='lg'>
				<DoctorTeleSessionCall doctorId={doctorId} />
			</Container>
		</Box>
	)
}

export default DoctorMeetingRoomPage
