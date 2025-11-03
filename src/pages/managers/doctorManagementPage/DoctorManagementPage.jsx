import { GenericTablePagination } from '@/components/generals/GenericPagination'
import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import DoctorManagementFilterSection from './sections/DoctorManagementFilterSection'
import DoctorManagementTableSection from './sections/DoctorManagementTableSection'

const DoctorManagementPage = () => {
	const [filters, setFilters] = useState({ name: '' })
	const [sort, setSort] = useState({ key: 'id', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const { t } = useTranslation()

	const getDoctors = useFetch(
		ApiUrls.DOCTOR.MANAGEMENT.INDEX,
		{ sort: `${sort.key} ${sort.direction}`, ...filters, page, pageSize },
		[sort, filters, page, pageSize]
	)

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('doctor.title.doctor_management')}</Typography>
				<DoctorManagementFilterSection
					filters={filters}
					setFilters={setFilters}
					loading={getDoctors.loading}
				/>
				<DoctorManagementTableSection
					doctors={getDoctors.data?.collection}
					loading={getDoctors.loading}
					sort={sort}
					setSort={setSort}
					refetch={getDoctors.fetch}
				/>
				<GenericTablePagination
					totalPage={getDoctors.data?.totalPages}
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					loading={getDoctors.loading}
				/>
			</Stack>
		</Paper>
	)
}

export default DoctorManagementPage
