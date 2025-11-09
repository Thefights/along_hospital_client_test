import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import ConfirmationButton from '@/components/generals/ConfirmationButton'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { isEmail, isPhone, isRequired, maxLen } from '@/utils/validateUtil'
import { DeleteRounded, EditRounded } from '@mui/icons-material'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

const ManagerSupplierPage = () => {
	const { t } = useTranslation()
	const confirm = useConfirm()

	const [sort, setSort] = useState({ key: 'id', direction: 'asc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [selectedIds, setSelectedIds] = useState([])
	const [selectedRow, setSelectedRow] = useState({})
	const [openCreate, setOpenCreate] = useState(false)
	const [openUpdate, setOpenUpdate] = useState(false)

	const sortParam = useMemo(() => `${sort.key ?? 'id'} ${sort.direction ?? 'asc'}`, [sort])

	const { loading, data } = useFetch(
		ApiUrls.SUPPLIER.MANAGEMENT.INDEX,
		{ page, pageSize, sort: sortParam },
		[page, pageSize, sortParam]
	)

	const postSupplier = useAxiosSubmit({
		url: ApiUrls.SUPPLIER.MANAGEMENT.INDEX,
		method: 'POST',
	})
	const putSupplier = useAxiosSubmit({
		url: ApiUrls.SUPPLIER.MANAGEMENT.INDEX,
		method: 'PUT',
	})
	const deleteSupplier = useAxiosSubmit({
		url: ApiUrls.SUPPLIER.MANAGEMENT.INDEX,
		method: 'DELETE',
	})

	const formFields = useMemo(
		() => [
			{ key: 'name', title: t('supplier.field.name'), validate: [isRequired(), maxLen(255)] },
			{ key: 'phone', title: t('supplier.field.phone'), validate: [isPhone(), maxLen(20)] },
			{ key: 'email', title: t('supplier.field.email'), validate: [isEmail(), maxLen(255)] },
			{
				key: 'address',
				title: t('supplier.field.address'),
				validate: [maxLen(255)],
				multiline: true,
				rows: 2,
			},
			{
				key: 'note',
				title: t('supplier.field.note'),
				validate: [maxLen(500)],
				multiline: true,
				rows: 3,
			},
		],
		[t]
	)

	const tableFields = useMemo(
		() => [
			{ key: 'id', title: t('supplier.field.id'), width: 10, sortable: true, fixedColumn: true },
			{ key: 'name', title: t('supplier.field.name'), width: 20, sortable: false },
			{ key: 'phone', title: t('supplier.field.phone'), width: 15, sortable: false },
			{ key: 'email', title: t('supplier.field.email'), width: 20, sortable: false },
			{ key: 'address', title: t('supplier.field.address'), width: 20, sortable: false },
			{ key: 'note', title: t('supplier.field.note'), width: 20, sortable: false },
			{
				key: '',
				title: '',
				width: 5,
				render: (value, row) => (
					<ActionMenu
						actions={[
							{
								title: t('button.update'),
								icon: <EditRounded fontSize='small' />,
								onClick: () => {
									setSelectedRow(row)
									setOpenUpdate(true)
								},
							},
							{
								title: t('button.delete'),
								icon: <DeleteRounded fontSize='small' />,
								onClick: async () => {
									const isConfirmed = await confirm({
										confirmText: t('button.delete'),
										confirmColor: 'error',
										title: t('supplier.dialog.confirm_delete_title'),
										description: t('supplier.dialog.confirm_delete_description', {
											name: row?.name ?? '',
										}),
									})

									if (isConfirmed) {
										await deleteSupplier.submit(null, {
											overrideUrl: ApiUrls.SUPPLIER.MANAGEMENT.DETAIL(row.id),
										})
									}
								},
							},
						]}
					/>
				),
			},
		],
		[confirm, deleteSupplier, t]
	)

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('supplier.title.supplier_management')}</Typography>
				<Stack direction='row' justifyContent='flex-end' alignItems='center'>
					<Stack spacing={2} direction='row' alignItems='center'>
						<Button variant='contained' color='primary' onClick={() => setOpenCreate(true)}>
							{t('button.create')}
						</Button>
						<ConfirmationButton
							confirmButtonColor='error'
							confirmButtonText={t('button.delete')}
							confirmationTitle={t('supplier.dialog.confirm_delete_title')}
							confirmationDescription={t('text.confirm_delete')}
							onConfirm={() => alert('Delete confirmed')}
							color='error'
							variant='outlined'
						>
							{t('button.delete_selected')}
						</ConfirmationButton>
					</Stack>
				</Stack>
				<GenericTable
					data={data?.collection || data?.items || data || []}
					fields={tableFields}
					sort={sort}
					setSort={setSort}
					rowKey='id'
					canSelectRows={true}
					selectedRows={selectedIds}
					setSelectedRows={setSelectedIds}
					loading={loading}
				/>
				<GenericTablePagination
					totalItems={data?.length || data?.totalCount || data?.totalItems || data?.total || 0}
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
				/>
			</Stack>
			<GenericFormDialog
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				fields={formFields}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				title={t('supplier.dialog.create_title')}
				onSubmit={async ({ values, closeDialog }) => {
					if (await postSupplier.submit(values)) closeDialog()
				}}
			/>
			<GenericFormDialog
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				fields={formFields}
				initialValues={selectedRow}
				submitLabel={t('button.update')}
				submitButtonColor='success'
				title={t('supplier.dialog.update_title')}
				onSubmit={async ({ values, closeDialog }) => {
					if (!selectedRow?.id) return
					await putSupplier.submit(values, {
						overrideUrl: ApiUrls.SUPPLIER.MANAGEMENT.DETAIL(selectedRow.id),
					})
					closeDialog()
				}}
			/>
		</Paper>
	)
}

export default ManagerSupplierPage
