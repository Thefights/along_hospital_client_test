import TeleSessionCall from '@/components/TeleSessionCall'
import { Box, Container, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

const MeetingRoomPage = () => {
	const { id: transactionId } = useParams()

	if (!transactionId) {
		return (
			<Box
				sx={{
					py: { xs: 2, md: 3 },
					px: { xs: 1, md: 0 },
					bgcolor: (t) => t.palette.background.default,
				}}
			>
				<Container maxWidth='lg'>
					<Typography variant='h5' color='error' align='center' sx={{ mt: 4 }}>
						Lỗi: Không tìm thấy mã cuộc hẹn (Transaction ID)
					</Typography>
				</Container>
			</Box>
		)
	}

	return (
		<Box
			sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 0 }, bgcolor: (t) => t.palette.background.default }}
		>
			<Container maxWidth='lg'>
				<TeleSessionCall transactionId={transactionId} />
			</Container>
		</Box>
	)
}

export default MeetingRoomPage
