import ManageAttendanceBasePage from '@/components/basePages/manageAttendanceBasePage/ManageAttendanceBasePage'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import { Button, Stack } from '@mui/material'
import { useState } from 'react'

const DoctorAttendanceManagementPage = () => {
	const [filters, setFilters] = useState({})
	const [sort, setSort] = useState({ key: 'id', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const getMyAttendances = useFetch(
		ApiUrls.ATTENDANCE.STAFF_ATTENDANCE.INDEX,
		{ sort: `${sort.key} ${sort.direction}`, ...filters, page, pageSize },
		[sort, filters, page, pageSize]
	)

	const checkinAttendance = useAxiosSubmit({
		url: ApiUrls.ATTENDANCE.STAFF_ATTENDANCE.CHECK_IN,
		method: 'POST',
		onSuccess: async () => {
			await getMyAttendances.fetch()
		},
	})

	const checkoutAttendance = useAxiosSubmit({
		url: ApiUrls.ATTENDANCE.STAFF_ATTENDANCE.CHECK_OUT,
		method: 'POST',
		onSuccess: async () => {
			await getMyAttendances.fetch()
		},
	})

	return (
		<ManageAttendanceBasePage
			filters={filters}
			setFilters={setFilters}
			sort={sort}
			setSort={setSort}
			page={page}
			setPage={setPage}
			pageSize={pageSize}
			setPageSize={setPageSize}
			attendances={getMyAttendances.data?.collection ?? []}
			loading={getMyAttendances.loading}
			totalPage={getMyAttendances.data?.totalPage}
			buttons={
				<Stack direction='row' spacing={2}>
					<Button
						color='success'
						onClick={async () => await checkinAttendance.submit()}
						loading={checkinAttendance.loading || checkoutAttendance.loading || getMyAttendances.loading}
						loadingPosition='start'
						variant='contained'
					>
						Check In
					</Button>
					<Button
						color='error'
						onClick={async () => await checkoutAttendance.submit()}
						loading={checkinAttendance.loading || checkoutAttendance.loading || getMyAttendances.loading}
						loadingPosition='start'
						variant='contained'
					>
						Check Out
					</Button>
				</Stack>
			}
		/>
	)
}

export default DoctorAttendanceManagementPage
