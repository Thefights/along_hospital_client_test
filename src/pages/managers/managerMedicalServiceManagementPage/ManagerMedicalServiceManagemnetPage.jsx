import ManageMedicalServiceBasePage from '@/components/basePages/manageMedicalServiceBasePage/ManageMedicalServiceBasePage'
import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useTranslation from '@/hooks/useTranslation'
import { useEffect, useState } from 'react'

const ManageMedicalServiceManagementPage = () => {
	const { t } = useTranslation()
	const confirm = useConfirm()

	// Filters
	const [filters, setFilters] = useState({ name: '' })
	const [appliedFilters, setAppliedFilters] = useState({ name: '' })

	// Pagination
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	// Data
	const [medicalServices, setMedicalServices] = useState([])
	const [totalMedicalServices, setTotalMedicalServices] = useState(0)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedMedicalService, setSelectedMedicalService] = useState(null)

	// Dialogs
	const [openCreateDialog, setOpenCreateDialog] = useState(false)
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
	const [sort, setSort] = useState(null)

	// Specialties
	const [specialties, setSpecialties] = useState([])

	// Hooks
	const getAllSpecialties = useAxiosSubmit({
		url: ApiUrls.SPECIALTY.GET_ALL,
		method: 'GET',
		onSuccess: (res) => {
			const data = res?.data || []
			setSpecialties(data.map((x) => ({ label: x.name, value: x.id })))
		},
	})

	const getAllMedicalServices = useAxiosSubmit({
		url: ApiUrls.MEDICAL_SERVICE.MANAGEMENT.GET_ALL,
		method: 'GET',
		params: { ...appliedFilters, page, pageSize },
		onSuccess: (res) => {
			const data = res?.data
			setMedicalServices(data?.collection || [])
			setTotalMedicalServices(data?.totalCount || 0)
		},
	})

	const createMedicalService = useAxiosSubmit({
		url: ApiUrls.MEDICAL_SERVICE.MANAGEMENT.CREATE,
		method: 'POST',
		onSuccess: async () => {
			setOpenCreateDialog(false)
			await getAllMedicalServices.submit()
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
			await getAllMedicalServices.submit()
		},
	})

	const deleteMedicalService = useAxiosSubmit({
		method: 'DELETE',
		onSuccess: async () => {
			setSelectedMedicalService(null)
			setSelectedRows([])
			await getAllMedicalServices.submit()
		},
	})

	// Effects
	useEffect(() => {
		async function fetchSpecialties() {
			await getAllSpecialties.submit()
		}
		fetchSpecialties()
	}, [])

	useEffect(() => {
		async function fetchMedicalServices() {
			await getAllMedicalServices.submit()
		}
		fetchMedicalServices()
	}, [appliedFilters, page, pageSize])

	// Handlers
	const handleFilterClick = () => {
		setPage(1)
		setAppliedFilters(filters)
	}

	const handleResetFilterClick = () => {
		setFilters({ name: '' })
		setAppliedFilters({ name: '' })
		setPage(1)
		setPageSize(10)
	}

	const formFields = [
		{ key: 'name', title: t('medical_service.field.name'), required: true },
		{
			key: 'description',
			title: t('medical_service.field.description'),
			required: true,
			multiline: true,
			rows: 3,
		},
		{ key: 'price', title: t('medical_service.field.price'), required: true, type: 'number' },
		{
			key: 'specialtyId',
			title: t('medical_service.field.specialty'),
			required: true,
			type: 'select',
			options: specialties,
		},
	]

	const tableFields = [
		{ key: 'id', title: 'ID', width: 10 },
		{ key: 'name', title: t('medical_service.field.name'), width: 20 },
		{ key: 'description', title: t('medical_service.field.description'), width: 35 },
		{ key: 'price', title: t('medical_service.field.price'), width: 15 },
		{
			key: 'specialtyId',
			title: t('medical_service.field.specialty'),
			width: 15,
			render: (_, row) => specialties.find((s) => s.value === row.specialtyId)?.label || '-',
		},
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
								if (isConfirmed)
									await deleteMedicalService.submit(null, {
										overrideUrl: ApiUrls.MEDICAL_SERVICE.MANAGEMENT.DELETE(row.id),
									})
							},
						},
					]}
				/>
			),
		},
	]

	return (
		<>
			<ManageMedicalServiceBasePage
				headerTitleKey='medical_service.title.management'
				medicalServices={medicalServices}
				totalMedicalServices={totalMedicalServices}
				totalPage={Math.max(1, Math.ceil(totalMedicalServices / pageSize))}
				filters={filters}
				setFilters={setFilters}
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				onFilterClick={handleFilterClick}
				onResetFilterClick={handleResetFilterClick}
				fields={tableFields}
				onCreateClick={() => setOpenCreateDialog(true)}
				sort={sort}
				setSort={setSort}
				page={page}
				setPage={setPage}
				pageSize={pageSize}
				setPageSize={setPageSize}
				loading={
					getAllMedicalServices.loading ||
					createMedicalService.loading ||
					updateMedicalService.loading ||
					deleteMedicalService.loading
				}
			/>

			<GenericFormDialog
				title={t('medical_service.dialog.create_title')}
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
				fields={formFields}
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
				fields={formFields}
				initialValues={selectedMedicalService || {}}
				submitLabel={t('button.update')}
				submitButtonColor='info'
				onSubmit={async ({ values, closeDialog }) => {
					await updateMedicalService.submit(values)
					closeDialog()
				}}
			/>
		</>
	)
}

export default ManageMedicalServiceManagementPage
