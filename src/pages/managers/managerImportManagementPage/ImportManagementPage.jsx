/* eslint-disable react-hooks/exhaustive-deps */
import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import ConfirmationButton from '@/components/generals/ConfirmationButton'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setMedicinesStore } from '@/redux/reducers/managementReducer'
import { formatDateToDDMMYYYY, formatDateToSqlDate } from '@/utils/formatDateUtil'
import { maxLen, numberHigherThan } from '@/utils/validateUtil'
import { Button, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

const ImportManagementPage = () => {
	const [sort, setSort] = useState({ key: 'id', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [selectedIds, setSelectedIds] = useState([])
	const [selectedRow, setSelectedRow] = useState({})
	const [openCreate, setOpenCreate] = useState(false)
	const [openUpdate, setOpenUpdate] = useState(false)

	const confirm = useConfirm()
	const { t } = useTranslation()

	const getImports = useFetch(
		ApiUrls.IMPORT.MANAGEMENT.INDEX,
		{ sort: `${sort.key} ${sort.direction}`, page, pageSize },
		[sort, page, pageSize]
	)

	const imports = useMemo(
		() => (Array.isArray(getImports.data?.collection) ? getImports.data.collection : []),
		[getImports.data]
	)

	// Fetch medicines for select options
	const medicineStore = useReduxStore({
		selector: (state) => state.management.medicines,
		setStore: setMedicinesStore,
	})

	const importPost = useAxiosSubmit({
		url: ApiUrls.IMPORT.MANAGEMENT.INDEX,
		method: 'POST',
	})

	const importPut = useAxiosSubmit({
		method: 'PUT',
	})

	const importDelete = useAxiosSubmit({
		method: 'DELETE',
	})

	const createInitialValues = useMemo(
		() => ({
			importDate: new Date().toISOString().split('T')[0],
			note: '',
			supplierName: '',
			importDetails: [],
		}),
		[]
	)

	const handleUpdateSubmit = async ({ values, closeDialog }) => {
		const respond = await importPut.submit(values, {
			overrideUrl: ApiUrls.IMPORT.MANAGEMENT.DETAIL(selectedRow.id),
		})

		if (respond) {
			closeDialog()
			await getImports.fetch()
		}
	}

	const handleCreateSubmit = async ({ values, closeDialog }) => {
		const respond = await importPost.submit(values)

		if (respond) {
			closeDialog()
			await getImports.fetch()
		}
	}

	const handleDeleteClick = async (row) => {
		const isConfirmed = await confirm({
			confirmText: t('button.delete'),
			confirmColor: 'error',
			title: t('import.title.delete'),
			description: `${t('import.title.delete_confirm')} #${row.id}?`,
		})

		if (isConfirmed) {
			await importDelete.submit(undefined, {
				overrideUrl: ApiUrls.IMPORT.MANAGEMENT.DETAIL(row.id),
			})
			await getImports.fetch()
		}
	}

	const handleDeleteMany = async () => {
		if (!selectedIds.length) return
		const isConfirmed = await confirm({
			title: t('import.title.delete_many'),
			description: t('import.title.delete_many_confirm', { number: selectedIds.length }),
			confirmColor: 'error',
			confirmText: t('button.delete'),
		})
		if (isConfirmed) {
			for (const id of selectedIds) {
				await importDelete.submit(undefined, { overrideUrl: ApiUrls.IMPORT.MANAGEMENT.DETAIL(id) })
			}
			setSelectedIds([])
			await getImports.fetch()
		}
	}

	const fields = useMemo(
		() => [
			{ key: 'id', title: 'ID', width: 8, sortable: true, fixedColumn: true },
			{
				key: 'importDate',
				title: 'Date',
				width: 12,
				sortable: true,
				render: (value) => (value ? formatDateToDDMMYYYY(value) : '-'),
			},
			{
				key: 'supplierName',
				title: 'Supplier',
				width: 20,
				sortable: false,
			},
			{
				key: 'note',
				title: 'Note',
				width: 35,
				sortable: false,
				render: (value) => {
					const text = value ?? ''
					return (
						<Tooltip title={text} arrow placement='top' disableInteractive>
							<Typography
								variant='body2'
								noWrap
								sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
							>
								{text || '-'}
							</Typography>
						</Tooltip>
					)
				},
			},
			{
				key: 'importDetails',
				title: 'Items',
				width: 10,
				sortable: false,
				render: (value) => (Array.isArray(value) ? value.length : 0),
			},
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
								onClick: () => handleDeleteClick(row),
							},
						]}
					/>
				),
			},
		],
		[]
	)

	const medicineOptions = useMemo(() => {
		if (!medicineStore.data || !Array.isArray(medicineStore.data)) return []
		return medicineStore.data.map((medicine) => ({
			value: medicine.id,
			label: medicine.name,
		}))
	}, [medicineStore.data])

	const upsertField = useMemo(
		() => [
			{
				key: 'importDate',
				title: t('import.field.import_date'),
				type: 'date',
			},
			{
				key: 'supplierName',
				title: t('import.field.supplier_name'),
				type: 'text',
				validate: [maxLen(255)],
			},
			{
				key: 'note',
				title: t('import.field.note'),
				type: 'text',
				required: false,
				multiple: 3,
				validate: [maxLen(1000)],
			},
			{
				key: 'importDetails',
				title: t('import.field.import_details'),
				type: 'array',
				of: [
					{
						key: 'medicineId',
						title: t('import.field.import_detail.medicine'),
						type: 'select',
						options: medicineOptions,
					},
					{
						key: 'quantity',
						title: t('import.field.import_detail.quantity'),
						type: 'number',
						validate: [numberHigherThan(0)],
					},
					{
						key: 'unitPrice',
						title: t('import.field.import_detail.unit_price'),
						type: 'number',
						validate: [numberHigherThan(0)],
					},
				],
			},
		],
		[t, medicineOptions]
	)

	return (
		<Paper sx={{ py: 1, px: 2, mt: 2 }}>
			<Stack direction='row' justifyContent='space-between' alignItems='center' my={2}>
				<Stack spacing={2} direction='row' alignItems='center'>
					<Button variant='contained' color='primary' onClick={() => setOpenCreate(true)}>
						{t('button.create')}
					</Button>
					<ConfirmationButton
						confirmButtonColor='error'
						confirmButtonText={t('button.delete')}
						confirmationTitle={t('import.title.delete_many')}
						confirmationDescription={t('import.title.delete_many_confirm', {
							number: selectedIds.length,
						})}
						onConfirm={handleDeleteMany}
						color='error'
						variant='outlined'
						disabled={!selectedIds.length}
					>
						{t('button.delete_selected')}
					</ConfirmationButton>
				</Stack>
			</Stack>
			<GenericTable
				data={imports}
				fields={fields}
				sort={sort}
				setSort={setSort}
				rowKey='id'
				canSelectRows={true}
				selectedRows={selectedIds}
				setSelectedRows={setSelectedIds}
				loading={getImports.loading}
			/>
			<GenericTablePagination
				totalPage={getImports.data?.totalPage}
				page={page}
				setPage={setPage}
				pageSize={pageSize}
				setPageSize={setPageSize}
				loading={getImports.loading}
			/>
			<GenericFormDialog
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				initialValues={createInitialValues}
				fields={upsertField}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				title={t('import.title.create')}
				onSubmit={handleCreateSubmit}
			/>
			<GenericFormDialog
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				fields={upsertField}
				initialValues={
					selectedRow && Object.keys(selectedRow).length > 0
						? {
								...selectedRow,
								importDate: selectedRow.importDate ? formatDateToSqlDate(selectedRow.importDate) : '',
								importDetails: selectedRow.importDetails || [],
						  }
						: {}
				}
				submitLabel={t('button.update')}
				submitButtonColor='success'
				title={t('import.title.update')}
				onSubmit={handleUpdateSubmit}
			/>
		</Paper>
	)
}

export default ImportManagementPage
