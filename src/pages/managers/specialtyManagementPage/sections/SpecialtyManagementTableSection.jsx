/* eslint-disable react-hooks/exhaustive-deps */
import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useTranslation from '@/hooks/useTranslation'
import { maxLen } from '@/utils/validateUtil'
import { Button, Paper, Stack } from '@mui/material'
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
		url: ApiUrls.SPECIALTY.MANAGEMENT.UPDATE,
		method: 'PUT',
	})

	const specialtyDelete = useAxiosSubmit({
		url: ApiUrls.SPECIALTY.MANAGEMENT.DELETE,
		method: 'DELETE',
	})

	const createInitialValues = useMemo(
		() => ({
			name: '',
			description: '',
		}),
		[]
	)

	const fields = useMemo(
		() => [
			{ key: 'id', title: t('specialty.field.id'), width: 20, sortable: true, fixedColumn: true },
			{ key: 'name', title: t('specialty.field.name'), width: 40, sortable: true },

			{ key: 'description', title: t('specialty.field.description'), width: 40, sortable: false },
			{
				key: '',
				title: '',
				width: 5,
				render: (row) => (
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
								onClick: async () => {
									const isConfirmed = await confirm({
										confirmText: t('button.delete'),
										confirmColor: 'error',
										title: t('done_care_about_this.delete_title'),
										description: `${t('specialty.delete_confirm')} ${row.name}?`,
									})

									if (isConfirmed) {
										await specialtyDelete.submit(undefined, {
											overrideUrl: ApiUrls.SPECIALTY.MANAGEMENT.DELETE(row.id),
										})
										refetch()
									}
								},
							},
						]}
					/>
				),
			},
		],
		[t, confirm, specialtyDelete, refetch]
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
		[t]
	)

	return (
		<Paper sx={{ py: 1, px: 2, mt: 2 }}>
			<Stack spacing={2} direction='row' alignItems='center' justifyContent='flex-end' ml={2} mb={1.5}>
				<Button variant='contained' color='primary' onClick={() => setOpenCreate(true)}>
					{t('button.create')}
				</Button>
				{/* <ConfirmationButton
					confirmButtonColor='error'
					confirmButtonText={t('button.delete')}
					confirmationTitle={t('done_care_about_this.delete_title')}
					confirmationDescription={t('done_care_about_this.delete_description', {
						number: selectedIds.length,
					})}
					onConfirm={async () => {
						// perform delete for selected ids
						if (!selectedIds || selectedIds.length === 0) return
						await Promise.all(
							selectedIds.map((id) => axiosConfig.delete(ApiUrls.SPECIALTY.INDEX + `/${id}`))
						)
						refetch()
						setSelectedIds([])
					}}
					color='error'
					variant='outlined'
				>
					{t('done_care_about_this.delete_selected', { number: selectedIds.length })}
				</ConfirmationButton> */}
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
				title={t('button.create') + ' ' + t('specialty.title')}
				onSubmit={async ({ values, closeDialog }) => {
					if (await specialtyPost.submit(values)) {
						closeDialog()
						refetch()
					}
				}}
			/>
			<GenericFormDialog
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				fields={upsertField}
				initialValues={selectedRow}
				submitLabel={t('button.update')}
				submitButtonColor='success'
				title={t('button.update') + ' ' + t('specialty.title')}
				onSubmit={async ({ values, closeDialog }) => {
					if (
						await specialtyPut.submit(values, {
							overrideUrl: ApiUrls.SPECIALTY.MANAGEMENT.UPDATE(selectedRow.id),
						})
					) {
						closeDialog()
						refetch()
					}
				}}
			/>
		</Paper>
	)
}

export default SpecialtyManagementTableSection
