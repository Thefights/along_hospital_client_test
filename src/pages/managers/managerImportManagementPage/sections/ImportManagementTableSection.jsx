/* eslint-disable react-hooks/exhaustive-deps */
import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import ConfirmationButton from '@/components/generals/ConfirmationButton'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setMedicinesStore, setSuppliersStore } from '@/redux/reducers/managementReducer'
import { formatDateToDDMMYYYY, formatDateToSqlDate } from '@/utils/formatDateUtil'
import { maxLen, numberHigherThan } from '@/utils/validateUtil'
import { Delete, Edit } from '@mui/icons-material'
import { Button, Stack, Tooltip, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

const toArray = (payload) => {
	if (Array.isArray(payload)) return payload
	if (Array.isArray(payload?.collection)) return payload.collection
	if (Array.isArray(payload?.data)) return payload.data
	return []
}

const supplierName = (supplier, t) =>
	supplier?.name ||
	supplier?.supplierName ||
	t('import_management.labels.supplier_number', { id: supplier?.id ?? '' })

const ImportManagementTableSection = ({
	imports,
	sort,
	setSort,
	loading,
	refetch,
	page,
	setPage,
	pageSize,
	setPageSize,
	totalPage,
}) => {
	const [selectedIds, setSelectedIds] = useState([])
	const [selectedRow, setSelectedRow] = useState(null)
	const [openCreate, setOpenCreate] = useState(false)
	const [openUpdate, setOpenUpdate] = useState(false)

	const confirm = useConfirm()
	const { t } = useTranslation()

	const medicineStore = useReduxStore({
		selector: (state) => state.management.medicines,
		setStore: setMedicinesStore,
	})

	const supplierStore = useReduxStore({
		selector: (state) => state.management.suppliers,
		setStore: setSuppliersStore,
		dataToStore: toArray,
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

	const { submit: createImport } = importPost
	const { submit: updateImport } = importPut
	const { submit: deleteImport } = importDelete

	const suppliersFromStore = useMemo(() => toArray(supplierStore.data), [supplierStore.data])

	const supplierLookup = useMemo(() => {
		const map = new Map()
		const addSupplier = (item, idKey = 'id', nameKey = 'name') => {
			const id = item?.[idKey]
			if (id == null || map.has(String(id))) return
			map.set(String(id), {
				id,
				name: supplierName({ id, name: item?.[nameKey], supplierName: item?.supplierName }, t),
				raw: item,
			})
		}

		suppliersFromStore.forEach((supplier) => addSupplier(supplier))
		imports.forEach((importItem) => addSupplier(importItem, 'supplierId', 'supplierName'))

		return map
	}, [suppliersFromStore, imports, t])

	const supplierOptions = useMemo(
		() =>
			Array.from(supplierLookup.values()).map((supplier) => ({
				value: String(supplier.id ?? ''),
				label: supplier.name,
			})),
		[supplierLookup]
	)

	const withSupplierPayload = useCallback(
		(values) => {
			const payload = { ...values }
			delete payload.importDetailsSummary
			const supplierMeta = supplierLookup.get(String(payload?.supplierId ?? ''))
			if (!supplierMeta) return payload
			return {
				...payload,
				supplierId: supplierMeta.id ?? payload.supplierId,
				supplierName: supplierMeta.name,
			}
		},
		[supplierLookup]
	)

	const submitImport = useCallback(
		async ({ values, closeDialog }, submit, options) => {
			const response = await submit(withSupplierPayload(values), options)
			if (response) {
				closeDialog?.()
				await refetch()
			}
		},
		[withSupplierPayload, refetch]
	)

	const handleCreateSubmit = useCallback(
		(params) => submitImport(params, createImport),
		[submitImport, createImport]
	)

	const handleUpdateSubmit = useCallback(
		(params) =>
			submitImport(params, updateImport, {
				overrideUrl: ApiUrls.IMPORT.MANAGEMENT.DETAIL(selectedRow?.id),
			}),
		[submitImport, updateImport, selectedRow?.id]
	)

	const handleDeleteMany = async () => {
		if (!selectedIds.length) return
		const isConfirmed = await confirm({
			title: t('import_management.confirm.delete_many.title'),
			description: t('import_management.confirm.delete_many.description', {
				count: selectedIds.length,
			}),
			confirmColor: 'error',
			confirmText: t('button.delete'),
		})
		if (!isConfirmed) return
		await deleteImport(undefined, {
			overrideUrl: ApiUrls.IMPORT.MANAGEMENT.DELETE_SELECTED,
			overrideParam: { ids: selectedIds },
		})
		setSelectedIds([])
		await refetch()
	}

	const fields = useMemo(
		() => [
			{
				key: 'id',
				title: t('import_management.table.id'),
				width: 8,
				sortable: true,
				fixedColumn: true,
			},
			{
				key: 'importDate',
				title: t('import_management.table.date'),
				width: 12,
				sortable: true,
				render: (value) => (value ? formatDateToDDMMYYYY(value) : '-'),
			},
			{
				key: 'supplierName',
				title: t('import_management.table.supplier'),
				width: 20,
				sortable: true,
				render: (value) => value || '-',
			},
			{
				key: 'note',
				title: t('import_management.table.note'),
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
				title: t('import_management.table.items'),
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
								title: t('button.update'),
								icon: <Edit fontSize='small' />,
								onClick: () => {
									setSelectedRow(row)
									setOpenUpdate(true)
								},
							},
							{
								title: t('button.delete'),
								icon: <Delete color='error' fontSize='small' />,
								onClick: async () => {
									const isConfirmed = await confirm({
										confirmText: t('button.delete'),
										confirmColor: 'error',
										title: t('import_management.confirm.delete_one.title'),
										description: t('import_management.confirm.delete_one.description', {
											id: row.id,
										}),
									})

									if (isConfirmed) {
										await deleteImport(undefined, {
											overrideUrl: ApiUrls.IMPORT.MANAGEMENT.DETAIL(row.id),
										})
										await refetch()
									}
								},
							},
						]}
					/>
				),
			},
		],
		[confirm, deleteImport, refetch, t]
	)

	const medicines = useMemo(
		() => (Array.isArray(medicineStore.data) ? medicineStore.data : []),
		[medicineStore.data]
	)

	const medicineOptions = useMemo(
		() => medicines.map((medicine) => ({ value: medicine.id, label: medicine.name })),
		[medicines]
	)

	const upsertField = useMemo(
		() => [
			{
				key: 'importDate',
				title: t('import_management.form.import_date'),
				type: 'date',
			},
			{
				key: 'supplierId',
				title: t('import_management.form.supplier'),
				type: 'select',
				options: supplierOptions,
			},
			{
				key: 'note',
				title: t('import_management.form.note'),
				type: 'text',
				required: false,
				multiple: 3,
				validate: [maxLen(1000)],
				props: {
					variant: 'outlined',
				},
			},
			{
				key: 'importDetails',
				title: t('import_management.form.import_details'),
				type: 'array',
				of: [
					{
						key: 'medicineId',
						title: t('import_management.form.medicine'),
						type: 'select',
						options: medicineOptions,
					},
					{
						key: 'quantity',
						title: t('import_management.form.quantity'),
						type: 'number',
						validate: [numberHigherThan(0)],
					},
					{
						key: 'unitPrice',
						title: t('import_management.form.unit_price'),
						type: 'number',
						validate: [numberHigherThan(0)],
					},
				],
			},
		],
		[medicineOptions, supplierOptions, t]
	)

	const toReadOnlyField = (field) => ({
		...field,
		required: false,
		props: {
			...(field.props || {}),
			InputProps: {
				...(field.props?.InputProps || {}),
				readOnly: true,
			},
			disabled: true,
		},
	})

	const updateFields = useMemo(
		() =>
			upsertField.map((field) => {
				if (field.key === 'importDetails') {
					return {
						key: 'importDetailsSummary',
						title: field.title,
						type: 'text',
						required: false,
						multiple: Math.max(field.multiple || 3, 3),
						props: {
							...(field.props || {}),
							InputProps: {
								...(field.props?.InputProps || {}),
								readOnly: true,
							},
							disabled: true,
						},
					}
				}
				if (field.key === 'note') return field
				return toReadOnlyField(field)
			}),
		[upsertField]
	)

	const createInitialValues = useMemo(
		() => ({
			importDate: formatDateToSqlDate(new Date()),
			note: '',
			supplierId: '',
			importDetails: [],
		}),
		[]
	)

	const updateInitialValues = useMemo(() => {
		if (!selectedRow || !Object.keys(selectedRow).length) return {}
		const details = Array.isArray(selectedRow.importDetails) ? selectedRow.importDetails : []
		return {
			...selectedRow,
			importDate: selectedRow.importDate ? formatDateToSqlDate(selectedRow.importDate) : '',
			supplierId: selectedRow?.supplierId != null ? String(selectedRow.supplierId) : '',
			importDetails: details,
			importDetailsSummary: details
				.map((detail, index) => {
					const medicineName =
						detail?.medicineName ||
						detail?.medicine?.name ||
						t('import_management.labels.medicine_number', {
							id: detail?.medicineId ?? '',
						})
					const quantity = detail?.quantity ?? 0
					const unitPrice = detail?.unitPrice ?? 0
					return t('import_management.summary.import_detail_line', {
						index: index + 1,
						name: medicineName,
						quantity,
						unitPrice,
					})
				})
				.join('\n'),
		}
	}, [selectedRow, t])

	return (
		<>
			<Stack direction='row' justifyContent='space-between' alignItems='center' my={2}>
				<Stack spacing={2} direction='row' alignItems='center'>
					<Button variant='contained' color='primary' onClick={() => setOpenCreate(true)}>
						{t('button.create')}
					</Button>
					<ConfirmationButton
						confirmButtonColor='error'
						confirmButtonText={t('button.delete')}
						confirmationTitle={t('import_management.confirm.delete_many.title')}
						confirmationDescription={t('import_management.confirm.delete_many.description', {
							count: selectedIds.length,
						})}
						onConfirm={handleDeleteMany}
						color='error'
						variant='outlined'
						disabled={!selectedIds.length}
					>
						{t('import_management.actions.delete_selected', { count: selectedIds.length })}
					</ConfirmationButton>
				</Stack>
			</Stack>
			<GenericTable
				data={imports}
				fields={fields}
				rowKey='id'
				sort={sort}
				setSort={setSort}
				canSelectRows={true}
				selectedRows={selectedIds}
				setSelectedRows={setSelectedIds}
				loading={loading}
			/>
			<GenericTablePagination
				totalPage={totalPage}
				page={page}
				setPage={setPage}
				pageSize={pageSize}
				setPageSize={setPageSize}
				loading={loading}
			/>
			<GenericFormDialog
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				initialValues={createInitialValues}
				fields={upsertField}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				title={t('import_management.dialog.create.title')}
				onSubmit={handleCreateSubmit}
			/>
			<GenericFormDialog
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				fields={updateFields}
				initialValues={updateInitialValues}
				submitLabel={t('button.update')}
				submitButtonColor='success'
				title={t('import_management.dialog.update.title')}
				onSubmit={handleUpdateSubmit}
			/>
		</>
	)
}

export default ImportManagementTableSection
