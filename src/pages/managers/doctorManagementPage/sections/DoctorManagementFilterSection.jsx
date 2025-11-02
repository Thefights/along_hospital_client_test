import FilterButton from '@/components/buttons/FilterButton'
import SearchBar from '@/components/generals/SearchBar'
import useTranslation from '@/hooks/useTranslation'
import { Grid, Paper, Stack } from '@mui/material'
import { useEffect, useState } from 'react'

const DoctorManagementFilterSection = ({ filters = {}, setFilters, loading = false }) => {
	const { t } = useTranslation()
	const [doctorName, setDoctorName] = useState(filters?.name || '')

	useEffect(() => {
		setDoctorName(filters?.name || '')
	}, [filters])

	const applyFilters = () => {
		setFilters({ ...filters, name: doctorName })
	}

	return (
		<Paper
			sx={{
				bgcolor: 'background.default',
				p: 2,
			}}
		>
			<Stack spacing={2}>
				<Grid container spacing={2}>
					<Grid size={10}>
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
