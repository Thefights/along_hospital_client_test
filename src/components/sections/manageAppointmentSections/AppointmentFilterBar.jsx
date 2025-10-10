import FilterButton from '@/components/buttons/FilterButton'
import SearchBar from '@/components/generals/SearchBar'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import useTranslation from '@/hooks/useTranslation'
import { MenuItem, Stack, Typography } from '@mui/material'

const AppointmentFilterBar = ({
	filters,
	setFilters,
	specialties,
	doctors,
	onFilterClick = () => {},
	loading = false,
	showSpecialtiesAndDoctorsFilter = true,
}) => {
	const { t } = useTranslation()

	return (
		<Stack
			spacing={1.5}
			sx={{
				py: 1,
				px: 2,
				bgcolor: 'background.paper',
				border: (theme) => `1px solid ${theme.palette.divider}`,
				borderRadius: 1,
			}}
		>
			<Typography variant='caption'>{t('appointment.title.filters')}</Typography>

			<Stack direction='row' spacing={2} alignItems='center'>
				<ValidationTextField
					type='date'
					size='small'
					label={t('appointment.field.start_date')}
					required={false}
					value={filters?.dateRange?.start}
					onChange={(e) =>
						setFilters({
							...filters,
							dateRange: { ...filters?.dateRange, start: e.target.value },
						})
					}
				/>
				<ValidationTextField
					type='date'
					size='small'
					label={t('appointment.field.end_date')}
					required={false}
					value={filters?.dateRange?.end}
					onChange={(e) =>
						setFilters({ ...filters, dateRange: { ...filters?.dateRange, end: e.target.value } })
					}
				/>
				{showSpecialtiesAndDoctorsFilter && (
					<ValidationTextField
						label={t('appointment.field.specialty')}
						value={filters?.specialty}
						size='small'
						required={false}
						onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
						type='select'
					>
						<MenuItem value=''>{t('text.all')}</MenuItem>
						{specialties?.map((s) => (
							<MenuItem key={s.id} value={s.id}>
								{s.name}
							</MenuItem>
						))}
					</ValidationTextField>
				)}

				{showSpecialtiesAndDoctorsFilter && (
					<ValidationTextField
						label={t('appointment.field.doctor')}
						value={filters?.doctor}
						size='small'
						required={false}
						onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
						type='select'
					>
						<MenuItem value=''>{t('text.all')}</MenuItem>
						{doctors?.map((d) => (
							<MenuItem key={d.id} value={d.id}>
								{d.name}
							</MenuItem>
						))}
					</ValidationTextField>
				)}
			</Stack>
			<Stack direction={'row'} spacing={2}>
				<SearchBar
					placeholder={t('appointment.field.search_doctor')}
					value={filters?.search}
					setValue={(searchTerm) => setFilters({ ...filters, search: searchTerm })}
					widthPercent={80}
				/>
				<FilterButton onFilterClick={onFilterClick} loading={loading} sx={{ flexGrow: 1 }} />
			</Stack>
		</Stack>
	)
}

export default AppointmentFilterBar
