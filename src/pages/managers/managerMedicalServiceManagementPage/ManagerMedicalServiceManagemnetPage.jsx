import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import MedicalServiceFilterBarSection from '@/components/basePages/manageMedicalServiceBasePage/section/MedicalServiceFilterBarSection'

const ManageMedicalServiceManagementPage = () => {
	const { t } = useTranslation()
	const confirm = useConfirm()

	const [filters, setFilters] = useState({ name: '' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const [medicalServices, setMedicalServices] = useState([])
	const [totalPage, setTotalPage] = useState(1)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedMedicalService, setSelectedMedicalService] = useState(null)

	const [openCreateDialog, setOpenCreateDialog] = useState(false)
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false)

	const getAllMedicalServices = useFetch(
		ApiUrls.MEDICAL_SERVICE.MANAGEMENT.GET_ALL,
		{ ...filters, page, pageSize },
		[filters, page, pageSize]
	)

	useEffect(() => {
		if (getAllMedicalServices.data) {
			const data = getAllMedicalServices.data
			setMedicalServices(data.collection || [])
			setTotalPage(Math.max(1, Math.ceil((data.totalCount || 0) / pageSize)))
		}
	}, [getAllMedicalServices.data, pageSize])

	const createMedicalService = useAxiosSubmit({
		url: ApiUrls.MEDICAL_SERVICE.MANAGEMENT.CREATE,
		method: 'POST',
		onSuccess: async () => {
			setOpenCreateDialog(false)
			await getAllMedicalServices.fetch()
		},
	})

	const updateMedicalService = useAxiosSubmit({
		url: selectedMedicalService
			? ApiUrls.MEDICAL_SERVICE.MANAGEMENT.UPDATE(selectedMedicalService.id)
			: ApiUrls.MEDICAL_SERVICE.MANAGEMENT.CREATE,
		method: 'PUT',
		onSuccess: async () => {
			setOpenUpdateDialog(false)
			setSelectedMedicalService(null)
			await getAllMedicalServices.fetch()
		},
	})

	const deleteMedicalService = useAxiosSubmit({
		method: 'DELETE',
		onSuccess: async () => {
			setSelectedMedicalService(null)
			setSelectedRows([])
			await getAllMedicalServices.fetch()
		},
	})

	const tableFields = [
		{ key: 'id', title: 'ID', width: 10 },
		{ key: 'name', title: t('medical_service.field.name'), width: 25 },
		{ key: 'description', title: t('medical_service.field.description'), width: 40 },
		{ key: 'price', title: t('medical_service.field.price'), width: 15 },
		{
			key: 'actions',
			title: t('medical_service.field.actions'),
			width: 15,
			render: (_, row) => (
				<ActionMenu
					actions={[
						{
							title: t('button.update'),
							onClick: () => {
								setSelectedMedicalService(row)
								setOpenUpdateDialog(true)
							},
						},
						{
							title: t('button.delete'),
							onClick: async () => {
								const isConfirmed = await confirm({
									confirmText: t('button.delete'),
									confirmColor: 'error',
									title: t('medical_service.dialog.confirm_delete_title'),
									description: t('medical_service.dialog.confirm_delete_description', { name: row.name }),
								})
								if (isConfirmed) {
									await deleteMedicalService.submit(null, {
										overrideUrl: ApiUrls.MEDICAL_SERVICE.MANAGEMENT.DELETE(row.id),
									})
								}
							},
						},
					]}
				/>
			),
		},
	]

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Stack direction='row' justifyContent='space-between' alignItems='center'>
					<Typography variant='h5'>{t('medical_service.title.management')}</Typography>
					<Button variant='contained' color='success' onClick={() => setOpenCreateDialog(true)}>
						{t('button.create')}
					</Button>
				</Stack>

				<MedicalServiceFilterBarSection
					filters={filters}
					loading={getAllMedicalServices.loading}
					onFilterClick={(newFilters) => {
						setFilters(newFilters)
						setPage(1)
						getAllMedicalServices.fetch({ params: { ...newFilters, page: 1, pageSize } })
					}}
					onResetFilterClick={() => {
						const reset = { name: '' }
						setFilters(reset)
						setPage(1)
						getAllMedicalServices.fetch({ params: { ...reset, page: 1, pageSize } })
					}}
				/>

				<GenericTable
					data={medicalServices}
					fields={tableFields}
					rowKey='id'
					selectedRows={selectedRows}
					setSelectedRows={setSelectedRows}
				/>

				<GenericTablePagination
					totalPage={totalPage}
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={(size) => {
						setPageSize(size)
						setPage(1)
					}}
					loading={getAllMedicalServices.loading}
				/>
			</Stack>

			<GenericFormDialog
				title={t('medical_service.dialog.create_title')}
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
				fields={[
					{ key: 'name', title: t('medical_service.field.name'), required: true },
					{
						key: 'description',
						title: t('medical_service.field.description'),
						required: true,
						multiline: true,
						rows: 3,
					},
					{ key: 'price', title: t('medical_service.field.price'), required: true, type: 'number' },
				]}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				onSubmit={async ({ values, closeDialog }) => {
					await createMedicalService.submit(values)
					closeDialog()
				}}
			/>

			<GenericFormDialog
				title={t('medical_service.dialog.update_title')}
				open={openUpdateDialog}
				onClose={() => setOpenUpdateDialog(false)}
				fields={[
					{ key: 'name', title: t('medical_service.field.name'), required: true },
					{
						key: 'description',
						title: t('medical_service.field.description'),
						required: true,
						multiline: true,
						rows: 3,
					},
					{ key: 'price', title: t('medical_service.field.price'), required: true, type: 'number' },
				]}
				initialValues={selectedMedicalService || {}}
				submitLabel={t('button.update')}
				submitButtonColor='info'
				onSubmit={async ({ values, closeDialog }) => {
					await updateMedicalService.submit(values)
					closeDialog()
				}}
			/>
		</Paper>
	)
}

export default ManageMedicalServiceManagementPage
