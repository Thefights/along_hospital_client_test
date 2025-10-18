import ConfirmationButton from '@/components/generals/ConfirmationButton'
import SkeletonTextField from '@/components/skeletons/SkeletonTextField'
import { defaultScrollbarStyle } from '@/configs/defaultStylesConfig'
import useTranslation from '@/hooks/useTranslation'
import { Divider, Stack, Typography } from '@mui/material'

const LeftCreateAppointmentSection = ({
	patientFields,
	appointmentFields,
	renderField,
	handleSubmit,
	loadingGet,
	loadingSubmit,
}) => {
	const { t } = useTranslation()

	return (
		<Stack spacing={2}>
			<Typography variant='h4' sx={{ color: 'text.primary' }}>
				{t('appointment.title.create_appointment')}
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
				{loadingGet ? (
					<SkeletonTextField numberOfRow={patientFields?.length || 0} withTitle withLabel />
				) : (
					<>
						<Typography variant='h6' sx={{ mb: 2, color: 'text.primary' }}>
							{t('appointment.title.patient_info')}
						</Typography>
						<Stack spacing={2}>
							{patientFields.map((f) => renderField({ ...f, props: { disabled: true } }))}
						</Stack>
					</>
				)}

				<Divider />

				{loadingGet ? (
					<SkeletonTextField numberOfRow={appointmentFields?.length || 0} withLabel withTitle />
				) : (
					<>
						<Typography variant='h6' sx={{ mb: 2, color: 'text.primary' }}>
							{t('appointment.title.appointment_info')}
						</Typography>
						<Stack spacing={2}>{appointmentFields.map((f) => renderField(f))}</Stack>
					</>
				)}
			</Stack>
			<ConfirmationButton
				confirmationTitle={t('appointment.dialog.confirm_create_title')}
				confirmationDescription={t('appointment.dialog.confirm_create_description')}
				confirmButtonText={t('button.create')}
				confirmButtonColor='primary'
				onConfirm={handleSubmit}
				variant='contained'
				sx={{ width: '50%' }}
				loading={loadingSubmit}
			>
				{t('button.create')}
			</ConfirmationButton>
		</Stack>
	)
}

export default LeftCreateAppointmentSection
