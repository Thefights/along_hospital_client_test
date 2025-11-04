import FilterButton from '@/components/buttons/FilterButton'
import SearchBar from '@/components/generals/SearchBar'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Grid, Paper, Stack } from '@mui/material'
import { useEffect, useState } from 'react'

const DoctorManagementFilterSection = ({
	filters = {},
	setFilters,
	loading = false,
	specialties = [],
}) => {
	const { t } = useTranslation()

	const [doctorName, setDoctorName] = useState(filters?.doctorName || '')

	console.log(filters?.specialtyId)

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

	const filterFields = [
		{
			key: 'specialtyId',
			title: t('doctor.field.specialty'),
			type: 'select',
			options: [
				{ value: '', label: t('text.all') },
				...(specialties || [])
					.map((s) => ({ value: s?.id, label: s?.name }))
					.filter((o) => o.value != null),
			],
			required: false,
		},
	]

	useEffect(() => {
		setDoctorName(filters?.doctorName || '')
	}, [filters])

	const applyFilters = () => {
		setFilters({ ...filters, doctorName: doctorName, specialtyId: values.specialtyId })
	}

	return (
		<Paper
			sx={{
				bgcolor: 'background.default',
				p: 2,
			}}
		>
			<Stack spacing={2}>
				<Grid container spacing={2} columns={10} alignItems='center'>
					<Grid size={3}>
						<Stack direction='row' spacing={2} alignItems='center'>
							{filterFields.map(renderField)}
						</Stack>
					</Grid>
					<Grid size={5}>
						<SearchBar
							value={doctorName}
							setValue={setDoctorName}
							placeholder={t('doctor.placeholder.search_doctor')}
							onEnterDown={applyFilters}
						/>
					</Grid>
					<Grid size={2}>
						<FilterButton fullWidth loading={loading} onFilterClick={applyFilters} />
					</Grid>
				</Grid>
			</Stack>
		</Paper>
	)
}

export default DoctorManagementFilterSection
