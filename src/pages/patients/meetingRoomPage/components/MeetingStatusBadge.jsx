import useTranslation from '@/hooks/useTranslation'
import { Box, Paper, Stack, Typography } from '@mui/material'

const MeetingStatusBadge = ({ timeText = '0:43' }) => {
	const { t } = useTranslation()
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
			<Paper elevation={3} sx={{ px: 1.5, py: 0.5, borderRadius: 3 }}>
				<Stack direction='row' spacing={1} alignItems='center'>
					<Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
					<Typography variant='body2' fontWeight={700}>
						{timeText}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						• {t('meeting_room.title.duration_left')}
					</Typography>
				</Stack>
			</Paper>
		</Box>
	)
}

export default MeetingStatusBadge
