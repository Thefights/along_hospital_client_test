import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTabs from '@/components/generals/GenericTabs'
import GenericTable from '@/components/tables/GenericTable'
import useFetch from '@/hooks/useFetch'
import { DisabledVisible, ListAlt, Settings } from '@mui/icons-material'
import { Button, Stack } from '@mui/material'
import { useState } from 'react'

const statusTabs = [
	{ key: 'all', title: 'All', icon: <ListAlt /> },
	{ key: 'active', title: 'Active', icon: <Settings /> },
	{ key: 'inactive', title: 'Inactive', icon: <DisabledVisible /> },
]

const fields = [
	{ key: 'id', title: 'ID', width: 10, sortable: true, fixedColumn: true },
	{ key: 'name', title: 'Name', width: 30, sortable: true },
	{
		key: 'age',
		title: 'Age',
		width: 10,
		isNumeric: true,
		sortable: true,
		render: (value) => (value ? `${value} VND` : 'N/A'),
	},
	{ key: 'address.city', title: 'City', width: 20, sortable: false },
	{ key: 'address.country', title: 'Country', width: 20, sortable: false },
	{
		key: '',
		title: 'Actions',
		width: 10,
		render: (value, row) => <Button onClick={() => handleEdit(row.id)}>Edit</Button>,
	},
]

const TestTable = () => {
	const [sort, setSort] = useState({ key: 'name', direction: 'asc' })
	const [page, setPage] = useState(1)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [currentStatusTab, setCurrentStatusTab] = useState(
		statusTabs.find((tab) => tab.key === 'all')
	)

	const { loading, error, responseData } = useFetch('/users', { sort, page, rowsPerPage }, [
		sort,
		page,
		rowsPerPage,
	])

	return (
		<>
			<Stack direction='row' spacing={2} my={2}>
				<GenericTabs
					tabs={statusTabs}
					currentTab={currentStatusTab}
					setCurrentTab={setCurrentStatusTab}
				/>
			</Stack>
			<GenericTable
				data={responseData}
				fields={fields}
				sort={sort}
				onSortChange={setSort}
				rowKey='id'
				loading={loading}
				stickyHeader={true}
			/>
			<GenericTablePagination
				count={responseData?.length}
				page={page}
				setPage={setPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
			/>
		</>
	)
}

export default TestTable
