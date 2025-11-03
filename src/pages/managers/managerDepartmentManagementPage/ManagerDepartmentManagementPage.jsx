import ManageDepartmentBasePage from '@/components/basePages/managerDepartmentBasePage/ManagerDepartmentBasePage'
import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useTranslation from '@/hooks/useTranslation'
import { useEffect, useState } from 'react'

const ManagerDepartmentManagementPage = () => {
	const { t } = useTranslation()
	const confirm = useConfirm()

	const [filters, setFilters] = useState({ search: '', page: 1, pageSize: 10 })
	const [departments, setDepartments] = useState([])
	const [totalDepartments, setTotalDepartments] = useState(0)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedDepartment, setSelectedDepartment] = useState(null)
	const [openCreateDialog, setOpenCreateDialog] = useState(false)
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false)

	const getAllDepartments = useAxiosSubmit({
		url: ApiUrls.DEPARTMENT.MANAGEMENT.GET_ALL,
		method: 'GET',
		params: filters,
		onSuccess: (res) => {
			const data = res?.data
			setDepartments(data?.collection || [])
			setTotalDepartments(data?.totalCount || 0)
		},
	})

	useEffect(() => {
		getAllDepartments.submit()
	}, [filters])

	const createDepartment = useAxiosSubmit({
		url: ApiUrls.DEPARTMENT.MANAGEMENT.CREATE,
		method: 'POST',
		onSuccess: async () => {
			setOpenCreateDialog(false)
			await getAllDepartments.submit()
		},
	})

	const updateDepartment = useAxiosSubmit({
		url: selectedDepartment
			? ApiUrls.DEPARTMENT.MANAGEMENT.UPDATE(selectedDepartment.id)
			: ApiUrls.DEPARTMENT.MANAGEMENT.CREATE,
		method: 'PUT',
		onSuccess: async () => {
			setOpenUpdateDialog(false)
			setSelectedDepartment(null)
			await getAllDepartments.submit()
		},
	})

	const deleteDepartment = useAxiosSubmit({
		method: 'DELETE',
		onSuccess: async () => {
			setSelectedDepartment(null)
			setSelectedRows([])
			await getAllDepartments.submit()
		},
	})

	const handleFilterClick = () => setFilters((prev) => ({ ...prev, page: 1 }))

	const formFields = [
		{ key: 'name', title: t('department.field.name'), required: true },
		{ key: 'location', title: t('department.field.location'), required: true },
	]

	const tableFields = [
		{ key: 'id', title: 'ID', width: 10 },
		{ key: 'name', title: t('department.field.name'), width: 25 },
		{ key: 'location', title: t('department.field.location'), width: 25 },
		{
			key: 'actions',
			title: t('department.field.actions'),
			width: 15,
			render: (_, row) => (
				<ActionMenu
					actions={[
						{
							title: t('button.update'),
							onClick: () => {
								setSelectedDepartment(row)
								setOpenUpdateDialog(true)
							},
						},
						{
							title: t('button.delete'),
							onClick: async () => {
								const isConfirmed = await confirm({
									confirmText: t('button.delete'),
									confirmColor: 'error',
									title: t('department.dialog.confirm_delete_title'),
									description: t('department.dialog.confirm_delete_description', {
										name: row.name,
									}),
								})
								if (isConfirmed) {
									await deleteDepartment.submit(null, {
										overrideUrl: ApiUrls.DEPARTMENT.MANAGEMENT.DELETE(row.id),
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
		<>
			<ManageDepartmentBasePage
				headerTitleKey='department.title.department_management'
				departments={departments}
				totalDepartments={totalDepartments}
				totalPage={Math.ceil(totalDepartments / filters.pageSize)}
				filters={filters}
				setFilters={setFilters}
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				onFilterClick={handleFilterClick}
				fields={tableFields}
				onCreateClick={() => setOpenCreateDialog(true)}
				loading={
					getAllDepartments.loading ||
					createDepartment.loading ||
					updateDepartment.loading ||
					deleteDepartment.loading
				}
			/>

			<GenericFormDialog
				title={t('department.dialog.create_title')}
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
				fields={formFields}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				onSubmit={async ({ values, closeDialog }) => {
					await createDepartment.submit(values)
					closeDialog()
				}}
			/>

			<GenericFormDialog
				title={t('department.dialog.update_title')}
				open={openUpdateDialog}
				onClose={() => setOpenUpdateDialog(false)}
				fields={formFields}
				initialValues={selectedDepartment || {}}
				submitLabel={t('button.update')}
				submitButtonColor='info'
				onSubmit={async ({ values, closeDialog }) => {
					await updateDepartment.submit(values)
					closeDialog()
				}}
			/>
		</>
	)
}

export default ManagerDepartmentManagementPage
