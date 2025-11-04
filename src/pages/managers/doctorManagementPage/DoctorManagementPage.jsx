import { GenericTablePagination } from '@/components/generals/GenericPagination'
import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import DoctorManagementFilterSection from './sections/DoctorManagementFilterSection'
import DoctorManagementTableSection from './sections/DoctorManagementTableSection'

const DoctorManagementPage = () => {
	const { t } = useTranslation()

	const [filters, setFilters] = useState({ doctorName: '', specialtyId: '' })
	const [sort, setSort] = useState({ key: 'id', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const getDoctors = useFetch(
		ApiUrls.DOCTOR.MANAGEMENT.INDEX,
		{ sort: `${sort.key} ${sort.direction}`, ...filters, page, pageSize },
		[sort, filters, page, pageSize]
	)
	const getSpecialties = useFetch(ApiUrls.SPECIALTY.GET_ALL)
	const getDepartments = useFetch(ApiUrls.DEPARTMENT.GET_ALL)

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('doctor.title.doctor_management')}</Typography>
				<DoctorManagementFilterSection
					filters={filters}
					setFilters={setFilters}
					loading={getDoctors.loading}
					specialties={getSpecialties.data}
				/>
				<DoctorManagementTableSection
					doctors={getDoctors.data?.collection}
					specialties={getSpecialties.data}
					departments={getDepartments.data}
					loading={getDoctors.loading}
					sort={sort}
					setSort={setSort}
					refetch={getDoctors.fetch}
				/>
				<GenericTablePagination
					totalPage={getDoctors.data?.totalPage}
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
