import FilterButton from '@/components/buttons/FilterButton'
import SearchBar from '@/components/generals/SearchBar'
import useTranslation from '@/hooks/useTranslation'
import { Grid, Paper, Stack } from '@mui/material'
import { useEffect, useState } from 'react'

const SpecialtyManagementFilterSection = ({ filters = {}, setFilters, loading = false }) => {
	const { t } = useTranslation()
	const [specialtyName, setSpecialtyName] = useState(filters?.name || '')

	useEffect(() => {
		setSpecialtyName(filters?.name || '')
	}, [filters])

	const applyFilters = () => {
		setFilters({ ...filters, name: specialtyName })
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
							value={specialtyName}
							setValue={setSpecialtyName}
							placeholder={t('specialty.placeholder.search-specialty')}
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

export default SpecialtyManagementFilterSection
