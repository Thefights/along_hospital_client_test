import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import MedicalServiceFilterBarSection from '@/pages/managers/managerMedicalServiceManagementPage/section/ManagerMedicalServiceManagementFilterBarSection'
import { maxLen } from '@/utils/validateUtil'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const ManagerMedicalServiceManagementPage = () => {
	const { t } = useTranslation()
	const confirm = useConfirm()

	const [filters, setFilters] = useState({ name: '', specialtyId: '' })

	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [medicalServices, setMedicalServices] = useState([])
	const [totalPage, setTotalPage] = useState(1)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedMedicalService, setSelectedMedicalService] = useState(null)
	const [openCreateDialog, setOpenCreateDialog] = useState(false)
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
	const [specialties, setSpecialties] = useState([])

	const getAllMedicalServices = useFetch(
		ApiUrls.MEDICAL_SERVICE.MANAGEMENT.INDEX,
		{ ...filters, page, pageSize },
		[filters, page, pageSize]
	)

	const getAllSpecialties = useFetch(ApiUrls.SPECIALTY.MANAGEMENT.GET_ALL)

	useEffect(() => {
		if (getAllSpecialties.data) {
			setSpecialties(
				getAllSpecialties.data.map((s) => ({
					label: s.name,
					value: s.id,
				})) || []
			)
		}
	}, [getAllSpecialties.data])

	useEffect(() => {
		if (getAllMedicalServices.data) {
			const data = getAllMedicalServices.data
			setMedicalServices(data.collection || [])
			setTotalPage(data.totalPage)
		}
	}, [getAllMedicalServices.data, pageSize])

	const createMedicalService = useAxiosSubmit({
		url: ApiUrls.MEDICAL_SERVICE.MANAGEMENT.INDEX,
		method: 'POST',
		onSuccess: async () => {
			setOpenCreateDialog(false)
			await getAllMedicalServices.fetch()
		},
	})

	const updateMedicalService = useAxiosSubmit({
		url: ApiUrls.MEDICAL_SERVICE.MANAGEMENT.DETAIL(selectedMedicalService?.id),
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
		{ key: 'name', title: t('medical_service.field.name'), width: 15 },
		{ key: 'description', title: t('medical_service.field.description'), width: 30 },
		{ key: 'price', title: t('medical_service.field.price'), width: 15 },
		{ key: 'specialtyName', title: t('medical_service.field.specialty'), width: 20 },
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
										overrideUrl: ApiUrls.MEDICAL_SERVICE.MANAGEMENT.DETAIL(row.id),
									})
								}
							},
						},
					]}
				/>
			),
		},
	]

	const formFields = [
		{ key: 'name', title: t('medical_service.field.name'), validate: [maxLen(255)] },
		{ key: 'description', title: t('medical_service.field.description'), validate: [maxLen(1000)] },
		{ key: 'price', title: t('medical_service.field.price'), type: 'number' },
		{
			key: 'specialtyId',
			title: t('medical_service.field.specialty'),
			type: 'select',
			options: specialties,
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
					specialties={specialties || []}
					onFilterClick={(newFilters) => {
						setFilters(newFilters)
						setPage(1)
					}}
					onResetFilterClick={() => {
						setFilters({ name: '', specialtyId: '' })
						setPage(1)
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
					setPageSize={setPageSize}
					pageSizeOptions={[5, 10, 20]}
					loading={getAllMedicalServices.loading}
				/>
			</Stack>

			<GenericFormDialog
				title={t('medical_service.dialog.create_title')}
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
				fields={formFields}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				onSubmit={async ({ values, closeDialog }) => {
					var response = await createMedicalService.submit(values)
					if (response) closeDialog()
				}}
			/>

			<GenericFormDialog
				title={t('medical_service.dialog.update_title')}
				open={openUpdateDialog}
				onClose={() => setOpenUpdateDialog(false)}
				fields={formFields}
				initialValues={selectedMedicalService || {}}
				submitLabel={t('button.update')}
				submitButtonColor='info'
				onSubmit={async ({ values, closeDialog }) => {
					var response = await updateMedicalService.submit(values)
					if (response) closeDialog()
				}}
			/>
		</Paper>
	)
}

export default ManagerMedicalServiceManagementPage
