import ConfirmationButton from '@/components/generals/ConfirmationButton'
import { defaultScrollbarStyle } from '@/configs/defaultStylesConfig'
import useTranslation from '@/hooks/useTranslation'
import { Divider, Stack, Typography } from '@mui/material'

const LeftCreateAppointmentSection = ({
	patientFields,
	appointmentFields,
	renderField,
	handleSubmit,
	loading,
}) => {
	const { t } = useTranslation()

	return (
		<Stack spacing={2}>
			<Typography variant='h4' sx={{ color: 'text.primary' }}>
				{t('appointment.create_appointment')}
			</Typography>
			<Stack
				spacing={3}
				px={2}
				maxHeight={500}
				overflow={'auto'}
				sx={{
					...defaultScrollbarStyle,
				}}
			>
				<Typography variant='h6' sx={{ mb: 2, color: 'text.primary' }}>
					{t('appointment.patient_info')}
				</Typography>
				<Stack spacing={2}>{patientFields.map((f) => renderField(f))}</Stack>
				<Divider />
				<Typography variant='h6' sx={{ mb: 2, color: 'text.primary' }}>
					{t('appointment.appointment_info')}
				</Typography>
				<Stack spacing={2}>{appointmentFields.map((f) => renderField(f))}</Stack>
			</Stack>
			<ConfirmationButton
				confirmationTitle={t('appointment.confirm_create_title')}
				confirmationDescription={t('appointment.confirm_create_description')}
				confirmButtonText={t('appointment.create_appointment')}
				confirmButtonColor='primary'
				onConfirm={handleSubmit}
				variant='contained'
				sx={{ width: '50%' }}
				loading={loading}
			>
				{t('appointment.create_appointment')}
			</ConfirmationButton>
		</Stack>
	)
}

export default LeftCreateAppointmentSection
