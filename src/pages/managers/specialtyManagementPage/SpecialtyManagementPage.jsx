import { GenericTablePagination } from '@/components/generals/GenericPagination'
import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import SpecialtyManagementFilterSection from './sections/SpecialtyManagementFilterSection'
import SpecialtyManagementTableSection from './sections/SpecialtyManagementTableSection'

const SpecialtyManagementPage = () => {
	const [filters, setFilters] = useState({
		name: '',
	})
	const [sort, setSort] = useState({ key: 'id', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const { t } = useTranslation()

	const getSpecialties = useFetch(
		ApiUrls.SPECIALTY.MANAGEMENT.INDEX,
		{ sort: `${sort.key} ${sort.direction}`, ...filters, page, pageSize },
		[sort, filters, page, pageSize]
	)

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('specialty.title.specialty_management')}</Typography>
				<SpecialtyManagementFilterSection
					filters={filters}
					setFilters={setFilters}
					loading={getSpecialties.loading}
				/>
				<SpecialtyManagementTableSection
					specialties={getSpecialties.data?.collection}
					loading={getSpecialties.loading}
					sort={sort}
					setSort={setSort}
					refetch={getSpecialties.fetch}
				/>
				<GenericTablePagination
					totalPage={getSpecialties.data?.totalPage}
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					loading={getSpecialties.loading}
				/>
			</Stack>
		</Paper>
	)
}

export default SpecialtyManagementPage
