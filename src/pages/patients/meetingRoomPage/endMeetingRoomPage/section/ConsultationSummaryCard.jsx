import useTranslation from '@/hooks/useTranslation'
import { Box, Paper, Typography } from '@mui/material'

const ConsultationSummaryCard = ({
	titleKey = 'meeting_room.consultation_summary_title',
	complaintTextKey = 'meeting_room.sample_chief_complaint',
	diagnosisTextKey = 'meeting_room.sample_diagnosis',
	recommendations = [
		'meeting_room.sample_rec_1',
		'meeting_room.sample_rec_2',
		'meeting_room.sample_rec_3',
		'meeting_room.sample_rec_4',
	],
}) => {
	const { t } = useTranslation()
	return (
		<Box>
			<Typography variant='subtitle1' fontWeight={700} sx={{ mb: 1.5 }}>
				{t(titleKey)}
			</Typography>
			<Paper variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
				<Box sx={{ mb: 2 }}>
					<Typography variant='subtitle2' fontWeight={700}>
						{t('meeting_room.chief_complaint')}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{t(complaintTextKey)}
					</Typography>
				</Box>
				<Box sx={{ mb: 2 }}>
					<Typography variant='subtitle2' fontWeight={700}>
						{t('meeting_room.diagnosis')}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{t(diagnosisTextKey)}
					</Typography>
				</Box>
				<Box>
					<Typography variant='subtitle2' fontWeight={700}>
						{t('meeting_room.recommendations')}
					</Typography>
					<Box component='ul' sx={{ mt: 0.5, pl: 3 }}>
						{recommendations.map((recKey, idx) => (
							<li key={idx}>
								<Typography variant='body2' color='text.secondary'>
									{t(recKey)}
								</Typography>
							</li>
						))}
					</Box>
				</Box>
			</Paper>
		</Box>
	)
}

export default ConsultationSummaryCard
