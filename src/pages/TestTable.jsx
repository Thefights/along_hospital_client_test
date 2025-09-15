import ConfirmationButton from '@/components/generals/ConfirmationButton'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTabs from '@/components/generals/GenericTabs'
import SearchBar from '@/components/generals/SearchBar'
import GenericTable from '@/components/tables/GenericTable'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { DisabledVisible, ListAlt, Settings } from '@mui/icons-material'
import { Button, Paper, Stack, Typography } from '@mui/material'
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

const testData = [
	{ id: 1, name: 'John Doe', age: 28, address: { city: 'New York', country: 'USA' } },
	{ id: 2, name: 'Jane Smith', age: 34, address: { city: 'London', country: 'UK' } },
	{ id: 3, name: 'Sam Brown', age: 22, address: { city: 'Sydney', country: 'Australia' } },
]

const TestTable = () => {
	const [sort, setSort] = useState({ key: 'name', direction: 'asc' })
	const [page, setPage] = useState(1)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [currentStatusTab, setCurrentStatusTab] = useState(
		statusTabs.find((tab) => tab.key === 'all')
	)
	const [selectedIds, setSelectedIds] = useState([])

	const { t } = useTranslation()
	const { loading, error, responseData } = useFetch('/users', { sort, page, rowsPerPage }, [
		sort,
		page,
		rowsPerPage,
	])

	return (
		<Paper sx={{ py: 1, px: 2, mt: 2 }}>
			<Stack direction='column' spacing={1} my={2}>
				<Typography fontWeight={'bold'} flexGrow={1}>
					Status:
				</Typography>

				<GenericTabs
					tabs={statusTabs}
					currentTab={currentStatusTab}
					setCurrentTab={setCurrentStatusTab}
				/>
			</Stack>
			<Stack direction='row' justifyContent='space-between' alignItems='center' my={2}>
				<SearchBar widthPercent={30} />
				<ConfirmationButton
					confirmButtonColor='error'
					confirmButtonText={t('button.delete')}
					confirmationTitle='Delete selected users?'
					confirmationDescription='Are you sure you want to delete the selected users? This action cannot be undone.'
					onConfirm={() => alert('Delete confirmed')}
					color='error'
					variant='outlined'
				>
					Delete selected users
				</ConfirmationButton>
			</Stack>
			<GenericTable
				data={testData}
				fields={fields}
				sort={sort}
				setSort={setSort}
				rowKey='id'
				canSelectRows={true}
				selectedRows={selectedIds}
				setSelectedRows={setSelectedIds}
				loading={loading}
			/>
			<GenericTablePagination
				count={responseData?.length}
				page={page}
				setPage={setPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
			/>
		</Paper>
	)
}

export default TestTable
