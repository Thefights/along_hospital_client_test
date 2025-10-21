import { Box, Container, Divider, Paper } from '@mui/material'
import ConsultationCompleteHeader from './section/ConsultationCompleteHeader'
import ConsultationSummaryCard from './section/ConsultationSummaryCard'
import DoctorInfoBar from './section/DoctorInfoBar'
import EndConsultationActions from './section/EndConsultationActions'
import SummaryNoticeText from './section/SummaryNoticeText'

const EndMeetingRoomPage = () => {
	return (
		<Box sx={{ py: { xs: 4, md: 6 }, bgcolor: (t) => t.palette.background.default }}>
			<Container maxWidth='md'>
				<Paper variant='outlined' sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3 }}>
					<ConsultationCompleteHeader />
					<DoctorInfoBar />
					<ConsultationSummaryCard />
					<Divider sx={{ my: 2 }} />
					<EndConsultationActions onScheduleFollowUp={() => {}} />
					<SummaryNoticeText />
				</Paper>
			</Container>
		</Box>
	)
}

export default EndMeetingRoomPage
