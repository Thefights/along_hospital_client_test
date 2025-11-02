import { GenericTablePagination } from '@/components/generals/GenericPagination'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import DoctorManagementFilterSection from './sections/DoctorManagementFilterSection'
import DoctorManagementTableSection from './sections/DoctorManagementTableSection'

const DoctorManagementPage = () => {
	// UI-only scaffold: local states to wire later
	const [filters, setFilters] = useState({ name: '' })
	const [sort, setSort] = useState({ key: 'id', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const { t } = useTranslation()

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('doctor.title.doctor_management')}</Typography>
				<DoctorManagementFilterSection filters={filters} setFilters={setFilters} loading={false} />
				<DoctorManagementTableSection
					doctors={[]}
					loading={false}
					sort={sort}
					setSort={setSort}
					refetch={() => {}}
				/>
				<GenericTablePagination
					totalPage={0}
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					loading={false}
				/>
			</Stack>
		</Paper>
	)
}

export default DoctorManagementPage
