import FilterButton from '@/components/buttons/FilterButton'
import SearchBar from '@/components/generals/SearchBar'
import { EnumConfig } from '@/configs/enumConfig'
import useAuth from '@/hooks/useAuth'
import useEnum from '@/hooks/useEnum'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Stack, Typography } from '@mui/material'

const ManageAppointmentFilterBarSection = ({
	filters,
	setFilters,
	specialties,
	onFilterClick = (values) => Promise.resolve(values),
	loading = false,
}) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const { auth } = useAuth()
	const role = auth?.role
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
				{fields1st.map((field) => renderField(field))}
			</Stack>
			<Stack direction='row' spacing={2} alignItems='center'>
				{fields2nd.map((field) => renderField(field))}
			</Stack>
			<Stack direction={'row'} spacing={2}>
				<SearchBar
					placeholder={
						isDoctor ? t('appointment.field.search_patient') : t('appointment.field.search_doctor')
					}
					value={filters?.search}
					setValue={(searchTerm) => setFilters({ ...filters, search: searchTerm })}
					widthPercent={80}
				/>
				<FilterButton
					onFilterClick={() => onFilterClick(values)}
					loading={loading}
					sx={{ flexGrow: 1 }}
				/>
			</Stack>
		</Stack>
	)
}

export default ManageAppointmentFilterBarSection
