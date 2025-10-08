import SearchBar from '@/components/generals/SearchBar'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { MenuItem, Stack, Typography } from '@mui/material'

const AppointmentFilterBar = ({
	filters,
	setFilters,
	searchTerm,
	setSearchTerm,
	specialties,
	doctors,
	showSpecialtiesAndDoctorsFilter = true,
}) => {
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
			<Typography variant='caption'>Filters</Typography>

			<Stack direction='row' spacing={2} alignItems='center'>
				<ValidationTextField
					type='date'
					size='small'
					label='Start'
					required={false}
					value={filters?.dateRange?.start}
					onChange={(e) =>
						setFilters({
							...filters,
							dateRange: { ...filters?.dateRange, start: e.target.value },
							page: 1,
						})
					}
				/>
				<ValidationTextField
					type='date'
					size='small'
					label='End'
					required={false}
					value={filters?.dateRange?.end}
					onChange={(e) =>
						setFilters({ ...filters, dateRange: { ...filters?.dateRange, end: e.target.value }, page: 1 })
					}
				/>
				{showSpecialtiesAndDoctorsFilter && (
					<ValidationTextField
						label='Specialty'
						value={filters?.specialty}
						size='small'
						required={false}
						onChange={(e) => setFilters({ ...filters, specialty: e.target.value, page: 1 })}
						type='select'
					>
						<MenuItem value=''>All</MenuItem>
						{specialties?.map((s) => (
							<MenuItem key={s.id} value={s.id}>
								{s.name}
							</MenuItem>
						))}
					</ValidationTextField>
				)}

				{showSpecialtiesAndDoctorsFilter && (
					<ValidationTextField
						label='Doctor'
						value={filters?.doctor}
						size='small'
						required={false}
						onChange={(e) => setFilters({ ...filters, doctor: e.target.value, page: 1 })}
						type='select'
					>
						<MenuItem value=''>All</MenuItem>
						{doctors?.map((d) => (
							<MenuItem key={d.id} value={d.id}>
								{d.name}
							</MenuItem>
						))}
					</ValidationTextField>
				)}
			</Stack>
			<SearchBar placeholder='Search by doctor name...' value={searchTerm} setValue={setSearchTerm} />
		</Stack>
	)
}

export default AppointmentFilterBar
