import { GenericTablePagination } from '@/components/generals/GenericPagination'
import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setDepartmentsStore, setSpecialtiesStore } from '@/redux/reducers/managementReducer'
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

	const specialtyStore = useReduxStore({
		selector: (state) => state.management.specialties,
		setStore: setSpecialtiesStore,
	})

	const departmentStore = useReduxStore({
		selector: (state) => state.management.departments,
		setStore: setDepartmentsStore,
	})

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('doctor.title.doctor_management')}</Typography>
				<DoctorManagementFilterSection
					filters={filters}
					setFilters={setFilters}
					loading={getDoctors.loading}
					specialties={specialtyStore.data}
				/>
				<DoctorManagementTableSection
					doctors={getDoctors.data?.collection}
					specialties={specialtyStore.data}
					departments={departmentStore.data}
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
