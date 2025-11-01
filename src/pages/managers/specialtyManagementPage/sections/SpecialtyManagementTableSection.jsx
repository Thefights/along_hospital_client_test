/* eslint-disable react-hooks/exhaustive-deps */
import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useTranslation from '@/hooks/useTranslation'
import { maxLen } from '@/utils/validateUtil'
import { Button, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

const SpecialtyManagementTableSection = ({ specialties, loading, sort, setSort, refetch }) => {
	const [selectedIds, setSelectedIds] = useState([])
	const [selectedRow, setSelectedRow] = useState({})
	const [openCreate, setOpenCreate] = useState(false)
	const [openUpdate, setOpenUpdate] = useState(false)

	const confirm = useConfirm()
	const { t } = useTranslation()

	const specialtyPost = useAxiosSubmit({
		url: ApiUrls.SPECIALTY.MANAGEMENT.INDEX,
		method: 'POST',
	})

	const specialtyPut = useAxiosSubmit({
		url: ApiUrls.SPECIALTY.MANAGEMENT.DETAIL(selectedRow.id),
		method: 'PUT',
	})

	const specialtyDelete = useAxiosSubmit({
		method: 'DELETE',
	})

	const createInitialValues = useMemo(
		() => ({
			name: '',
			description: '',
		}),
		[]
	)

	const handleUpdateSubmit = async ({ values, closeDialog }) => {
		const respond = await specialtyPut.submit(values)

		if (respond) {
			closeDialog()
			refetch()
		}
	}

	const handleCreateSubmit = async ({ values, closeDialog }) => {
		const respond = await specialtyPost.submit(values)

		if (respond) {
			closeDialog()
			refetch()
		}
	}

	const handleDeleteClick = async (row) => {
		const isConfirmed = await confirm({
			confirmText: t('button.delete'),
			confirmColor: 'error',
			title: t('specialty.title.delete'),
			description: `${t('specialty.title.delete_confirm')} ${row.name}?`,
		})

		if (isConfirmed) {
			await specialtyDelete.submit(undefined, {
				overrideUrl: ApiUrls.SPECIALTY.MANAGEMENT.DETAIL(row.id),
			})
			refetch()
		}
	}

	const fields = useMemo(
		() => [
			{ key: 'id', title: t('specialty.field.id'), width: 20, sortable: true, fixedColumn: true },
			{ key: 'name', title: t('specialty.field.name'), width: 20, sortable: true },
			{
				key: 'description',
				title: t('specialty.field.description'),
				width: 40,
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
				key: '',
				title: '',
				width: 5,
				render: (value, row) => (
					<ActionMenu
						actions={[
							{
								title: t('button.edit'),
								onClick: () => {
									setSelectedRow(row)
									setOpenUpdate(true)
								},
							},
							{
								title: t('button.delete'),
								onClick: () => handleDeleteClick(row),
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
				title: t('specialty.field.name'),
				type: 'text',
				validate: [maxLen(255)],
				required: true,
			},
			{
				key: 'description',
				title: t('specialty.field.description'),
				type: 'text',
				required: false,
				validate: [maxLen(1000)],
			},
		],
		[]
	)

	return (
		<Paper sx={{ py: 1, px: 2, mt: 2 }}>
			<Stack spacing={2} direction='row' alignItems='center' justifyContent='flex-end' ml={2} mb={1.5}>
				<Button variant='contained' color='primary' onClick={() => setOpenCreate(true)}>
					{t('button.create')}
				</Button>
			</Stack>
			<GenericTable
				data={specialties}
				fields={fields}
				sort={sort}
				setSort={setSort}
				rowKey='id'
				canSelectRows={true}
				selectedRows={selectedIds}
				setSelectedRows={setSelectedIds}
				loading={loading}
			/>
			<GenericFormDialog
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				initialValues={createInitialValues}
				fields={upsertField}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				title={t('specialty.title.create')}
				onSubmit={handleCreateSubmit}
			/>
			<GenericFormDialog
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				fields={upsertField}
				initialValues={selectedRow}
				submitLabel={t('button.update')}
				submitButtonColor='success'
				title={t('specialty.title.update')}
				onSubmit={handleUpdateSubmit}
			/>
		</Paper>
	)
}

export default SpecialtyManagementTableSection
