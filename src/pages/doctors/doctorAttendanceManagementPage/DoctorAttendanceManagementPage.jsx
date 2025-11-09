import ManageAttendanceBasePage from '@/components/basePages/manageAttendanceBasePage/ManageAttendanceBasePage'
import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
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
		/>
	)
}

export default DoctorAttendanceManagementPage
