import useAuth from '@/hooks/useAuth'
import useTranslation from '@/hooks/useTranslation'
import { Button } from '@mui/material'

const DoctorActions = ({ onCreateMedicalHistory }) => {
	const { hasRole } = useAuth()
	const { t } = useTranslation()
	const isDoctor = hasRole(['DOCTOR'])
	if (!isDoctor) return null
	return (
		<Button
			variant='outlined'
			color='primary'
			sx={{ ml: 1, borderRadius: 999, px: 2.5 }}
			onClick={onCreateMedicalHistory}
		>
			{t('meeting_room.create_medical_history')}
		</Button>
	)
}

export default DoctorActions
