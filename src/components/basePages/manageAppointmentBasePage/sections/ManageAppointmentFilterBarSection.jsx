import FilterButton from '@/components/buttons/FilterButton'
import SearchBar from '@/components/generals/SearchBar'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { EnumConfig } from '@/configs/enumConfig'
import useAuth from '@/hooks/useAuth'
import useTranslation from '@/hooks/useTranslation'
import { MenuItem, Stack, Typography } from '@mui/material'

const ManageAppointmentFilterBarSection = ({
	filters,
	setFilters,
	specialties,
	onFilterClick = () => {},
	loading = false,
}) => {
	const { t } = useTranslation()
	const { auth } = useAuth()
	const role = auth?.role
	const isDoctor = role === EnumConfig.Role.Doctor

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
					value={filters?.startDate}
					onChange={(e) =>
						setFilters({
							...filters,
							startDate: e.target.value,
						})
					}
				/>
				<ValidationTextField
					type='date'
					size='small'
					label={t('appointment.field.end_date')}
					required={false}
					value={filters?.endDate}
					onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
				/>
				<ValidationTextField
					label={t('appointment.field.specialty')}
					value={filters?.specialtyId}
					size='small'
					required={false}
					onChange={(e) => setFilters({ ...filters, specialtyId: e.target.value })}
					type='select'
				>
					<MenuItem value=''>{t('text.all')}</MenuItem>
					{specialties?.map((s) => (
						<MenuItem key={s.id} value={s.id}>
							{s.name}
						</MenuItem>
					))}
				</ValidationTextField>
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
				<FilterButton onFilterClick={onFilterClick} loading={loading} sx={{ flexGrow: 1 }} />
			</Stack>
		</Stack>
	)
}

export default ManageAppointmentFilterBarSection
