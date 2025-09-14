import GenericTablePagination from '@/components/generals/GenericTablePagination'
import GenericTable from '@/components/tables/GenericTable'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Button } from '@mui/material'
import { useState } from 'react'

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
	// {
	// 	id: 1,
	// 	name:
	// 		'John Doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe doe',
	// 	age: 28,
	// 	address: { city: 'New York', country: 'USA' },
	// },
	// { id: 2, name: 'Jane Smith', age: 34, address: { city: 'London', country: 'UK' } },
]

const TestTable = () => {
	const [sort, setSort] = useState({ key: 'name', direction: 'asc' })
	const [page, setPage] = useState(1)
	const [rowsPerPage, setRowsPerPage] = useState(5)

	const { t, language, setLanguage } = useTranslation()
	const { loading, error, responseData } = useFetch('/users', { sort, page, rowsPerPage }, [
		sort,
		page,
		rowsPerPage,
	])

	return (
		<>
			<Button
				onClick={() => {
					setLanguage(language === 'en' ? 'vi' : 'en')
					window.location.reload()
				}}
			>
				{language === 'en' ? 'Switch to Vietnamese' : 'Switch to English'}
			</Button>
			<GenericTable
				data={testData}
				fields={fields}
				sort={sort}
				onSortChange={setSort}
				rowKey='id'
				loading={loading}
				stickyHeader={true}
			/>
			<GenericTablePagination
				count={testData.length / rowsPerPage}
				page={page}
				setPage={setPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
			/>
		</>
	)
}

export default TestTable
