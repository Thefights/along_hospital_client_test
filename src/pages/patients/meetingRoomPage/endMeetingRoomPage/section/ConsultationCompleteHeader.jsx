import useTranslation from '@/hooks/useTranslation'
import { CheckCircle } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'

const ConsultationCompleteHeader = ({
	titleKey = 'meeting_room.consultation_complete_title',
	subtitleKey = 'meeting_room.consultation_complete_subtitle',
}) => {
	const { t } = useTranslation()
	return (
		<Stack alignItems='center' spacing={1} sx={{ textAlign: 'center', mb: 2 }}>
			<CheckCircle color='success' sx={{ fontSize: 40 }} />
			<Typography variant='h5' fontWeight={700}>
				{t(titleKey)}
			</Typography>
			<Typography color='text.secondary'>{t(subtitleKey)}</Typography>
		</Stack>
	)
}

export default ConsultationCompleteHeader
