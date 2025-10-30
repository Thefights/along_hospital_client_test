import FilterButton from '@/components/buttons/FilterButton'
import { EnumConfig } from '@/configs/enumConfig'
import useAuth from '@/hooks/useAuth'
import useEnum from '@/hooks/useEnum'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Grid, Stack, Typography } from '@mui/material'

const ManageAppointmentFilterBarSection = ({
	filters,
	setFilters,
	specialties,
	loading = false,
}) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const { auth } = useAuth()
	const role = auth?.role
	const isPatient = role === EnumConfig.Role.Patient
	const isDoctor = role === EnumConfig.Role.Doctor

	const { values, handleChange, setField, registerRef } = useForm(filters)
	const { renderField } = useFieldRenderer(
		values,
		setField,
		handleChange,
		registerRef,
		false,
		'outlined',
		'small'
	)

	const fields1st = [
		{ key: 'startDate', title: t('appointment.field.start_date'), type: 'date', required: false },
		{ key: 'endDate', title: t('appointment.field.end_date'), type: 'date', required: false },
		{
			key: 'specialtyId',
			title: t('appointment.field.specialty'),
			type: 'select',
			options: [{ value: '', label: t('text.all') }, ...specialties],
			required: false,
		},
	]

	const fields2nd = [
		{
			key: 'paymentStatus',
			title: t('appointment.field.payment_status'),
			type: 'select',
			options: [{ value: '', label: t('text.all') }, ..._enum.appointmentPaymentStatusOptions],
			required: false,
		},
		{
			key: 'type',
			title: t('appointment.field.type'),
			type: 'select',
			options: [{ value: '', label: t('text.all') }, ..._enum.appointmentTypeOptions],
			required: false,
		},
		{
			key: 'meetingType',
			title: t('appointment.field.meeting_type'),
			type: 'select',
			options: [{ value: '', label: t('text.all') }, ..._enum.appointmentMeetingTypeOptions],
			required: false,
		},
	]

	const fields3rd = [
		isPatient
			? undefined
			: {
					key: 'patientName',
					title: t('appointment.field.search_patient'),
					type: 'search',
					required: false,
			  },
		isDoctor
			? undefined
			: {
					key: 'doctorName',
					title: t('appointment.field.search_doctor'),
					type: 'search',
					required: false,
			  },
	].filter(Boolean)

	return (
		<Stack
			spacing={1.5}
			sx={{
				pt: 1,
				pb: 2,
				px: 2,
				bgcolor: 'background.paper',
				border: (theme) => `1px solid ${theme.palette.divider}`,
				borderRadius: 1,
			}}
		>
			<Typography variant='caption'>{t('appointment.title.filters')}</Typography>

			<Stack direction='row' spacing={2} alignItems='center'>
				{fields1st.map(renderField)}
			</Stack>
			<Stack direction='row' spacing={2} alignItems='center'>
				{fields2nd.map(renderField)}
			</Stack>
			<Grid container spacing={2}>
				{fields3rd.map((field) => (
					<Grid size={fields3rd.length === 1 ? 10 : 5} key={field.key}>
						{renderField(field)}
					</Grid>
				))}
				<Grid size={2}>
					<FilterButton
						onFilterClick={() => setFilters({ ...values, page: 1 })}
						fullWidth
						loading={loading}
						sx={{ flexGrow: 1 }}
					/>
				</Grid>
			</Grid>
		</Stack>
	)
}

export default ManageAppointmentFilterBarSection
