/* eslint-disable no-unused-vars */
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import ComplaintManagementFilterSection from './sections/ComplaintManagementFilterSection'
import ComplaintManagementTableSection from './sections/ComplaintManagementTableSection'

const ComplaintManagementPage = () => {
	const [filters, setFilters] = useState({
		complaintTopic: '',
		complaintType: '',
		complaintResolveStatus: '',
		content: '',
	})
	const [sort, setSort] = useState({ key: 'id', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [selectedComplaint, setSelectedComplaint] = useState(null)

	const { t } = useTranslation()

	const getComplaints = useFetch(
		ApiUrls.COMPLAINT.MANAGEMENT.INDEX,
		{ sort: `${sort.key} ${sort.direction}`, ...filters },
		[sort, filters]
	)

	const classifyComplaint = useAxiosSubmit({
		url: ApiUrls.COMPLAINT.MANAGEMENT.CLASSIFY(selectedComplaint?.id),
		method: 'PUT',
	})

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('complaint.title.complaint_management')}</Typography>
				<ComplaintManagementFilterSection
					filters={filters}
					setFilters={setFilters}
					loading={getComplaints.loading}
				/>
				<ComplaintManagementTableSection
					complaints={getComplaints.data?.collection}
					loading={getComplaints.loading}
					sort={sort}
					setSort={setSort}
					setSelectedComplaint={setSelectedComplaint}
					onClassifyComplaint={async (type) => await classifyComplaint.submit({ type })}
				/>
				<GenericTablePagination
					totalPage={getComplaints.data?.totalPage}
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					loading={getComplaints.loading}
				/>
			</Stack>
		</Paper>
	)
}

export default ComplaintManagementPage
