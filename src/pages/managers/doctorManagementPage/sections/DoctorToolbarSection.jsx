import useTranslation from '@/hooks/useTranslation'
import { Button, Stack, Typography } from '@mui/material'

const DoctorToolbarSection = ({ onCreate }) => {
	const { t } = useTranslation()

	return (
		<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 2 }}>
			<Typography variant='h5'>
				{t('doctor.title.doctor_management') || 'Doctor Management'}
			</Typography>
			<Stack direction='row' spacing={1}>
				<Button variant='contained' color='primary' onClick={onCreate}>
					{t('button.create') || 'Create'}
				</Button>
			</Stack>
		</Stack>
	)
}

export default DoctorToolbarSection
