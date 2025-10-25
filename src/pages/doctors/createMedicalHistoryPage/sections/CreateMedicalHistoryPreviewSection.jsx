import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, TextField, Typography } from '@mui/material'

const CreateMedicalHistoryPreviewSection = () => {
	const { t } = useTranslation()

	return (
		<Paper variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
			<Typography variant='subtitle1' sx={{ mb: 1.5 }}>
				{t('medical_history.title.medical_record_info')}
			</Typography>
			<Stack spacing={1.5}>
				<TextField
					fullWidth
					label={t('medical_history.field.diagnosis')}
					disabled
					multiline
					minRows={2}
				/>
				<Stack direction='row' spacing={1.5}>
					<TextField fullWidth label={t('medical_history.field.follow_up_appointment_date')} disabled />
					<TextField fullWidth label={t('medical_history.field.status')} disabled />
				</Stack>
			</Stack>
			<Typography variant='caption' sx={{ mt: 1.5, display: 'block', color: 'text.secondary' }}>
				{t('medical_history.placeholder.note_edit_after_creation')}
			</Typography>
		</Paper>
	)
}

export default CreateMedicalHistoryPreviewSection
