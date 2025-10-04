import GenericFormDialog from '@/components/dialogs/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import ConfirmationButton from '@/components/generals/ConfirmationButton'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTabs from '@/components/generals/GenericTabs'
import SearchBar from '@/components/generals/SearchBar'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { maxLen, numberRange } from '@/utils/validateUtil'
import { DisabledVisible, ListAlt, Settings } from '@mui/icons-material'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

const testData = [
	{
		id: 1,
		name: 'John Doe',
		age: 28,
		images: ['/image1.jpg', '/image2.jpg'],
		signature: '/signature.jpg',
		address: { city: 'New York', country: 'USA' },
	},
	{
		id: 2,
		name: 'Jane Smith',
		age: 34,
		images: ['/image3.jpg'],
		signature: '/signature2.jpg',
		address: { city: 'London', country: 'UK' },
	},
	{
		id: 3,
		name: 'Sam Brown',
		age: 22,
		images: ['/image4.jpg', '/image5.jpg', '/image6.jpg'],
		signature: '/signature3.jpg',
		address: { city: 'Sydney', country: 'Australia' },
	},
]

const TestTable = () => {
	const [sort, setSort] = useState({ key: 'name', direction: 'asc' })
	const [page, setPage] = useState(1)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [currentStatusTab, setCurrentStatusTab] = useState()
	const [selectedIds, setSelectedIds] = useState([])
	const [selectedRow, setSelectedRow] = useState({})
	const [openCreate, setOpenCreate] = useState(false)
	const [openUpdate, setOpenUpdate] = useState(false)

	const confirm = useConfirm()
	const { t } = useTranslation()
	const { loading, error, data } = useFetch(ApiUrls.USER.BASE, { sort, page, rowsPerPage }, [
		sort,
		page,
		rowsPerPage,
	])

	const statusTabs = useMemo(
		() => [
			{ key: 'all', title: 'All', icon: <ListAlt /> },
			{ key: 'active', title: 'Active', icon: <Settings /> },
			{ key: 'inactive', title: 'Inactive', icon: <DisabledVisible /> },
		],
		[]
	)

	const fields = useMemo(
		() => [
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
				title: '',
				width: 5,
				render: (value, row) => (
					<ActionMenu
						actions={[
							{
								title: 'Edit',
								onClick: () => {
									setSelectedRow(row)
									setOpenUpdate(true)
								},
							},
							{
								title: 'Delete',
								onClick: async () => {
									const isConfirmed = await confirm({
										confirmText: 'Delete',
										confirmColor: 'error',
										title: 'Delete user?',
										description: `Are you sure you want to delete ${row.name}?`,
									})

									if (isConfirmed) {
										alert(`Deleted id ${row.id}`)
									}
								},
							},
						]}
					/>
				),
			},
		],
		[]
	)

	const upsertField = useMemo(
		() => [
			{
				key: 'name',
				title: 'Name',
				validate: [maxLen(255)],
				required: false,
				props: { variant: 'outlined', slotProps: { input: { readOnly: true } } },
			},
			{ key: 'age', title: 'Age', type: 'number', validate: [numberRange(0, 100)] },
			{ key: 'images', title: 'Images', type: 'image', multiple: 5 },
			{ key: 'signature', title: 'Signature', required: false, type: 'image' },
			{
				key: 'address',
				title: 'Address',
				type: 'object',
				of: [
					{ key: 'city', title: 'City', validate: [maxLen(255)] },
					{ key: 'country', title: 'Country', validate: [maxLen(255)] },
				],
			},
			{
				key: 'tags',
				title: 'Tags',
				type: 'array',
				of: [
					{ key: 'name', title: 'Name', validate: [maxLen(255)] },
					{ key: 'value', title: 'Value', validate: [maxLen(255)] },
				],
			},
		],
		[]
	)

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
				<Stack spacing={2} direction='row' alignItems='center'>
					<Button variant='contained' color='primary' onClick={() => setOpenCreate(true)}>
						{t('button.create')}
					</Button>
					<ConfirmationButton
						confirmButtonColor='error'
						confirmButtonText={t('button.delete')}
						confirmationTitle={t('done_care_about_this.delete_title')}
						confirmationDescription={t('done_care_about_this.delete_description', {
							number: selectedIds.length,
						})}
						onConfirm={() => alert('Delete confirmed')}
						color='error'
						variant='outlined'
					>
						{t('done_care_about_this.delete_selected', { number: selectedIds.length })}
					</ConfirmationButton>
				</Stack>
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
				count={data?.length}
				page={page}
				setPage={setPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
			/>
			<GenericFormDialog
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				fields={upsertField}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				method='POST'
				submitUrl='/users'
				title={t('button.create') + ' User'}
			/>
			<GenericFormDialog
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				fields={upsertField}
				initialValues={selectedRow}
				submitLabel={t('button.update')}
				submitButtonColor='success'
				method='PUT'
				submitUrl={`/users`}
				params={selectedRow.id}
				title={t('button.update') + ' User'}
			/>
		</Paper>
	)
}

export default TestTable
