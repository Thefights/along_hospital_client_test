import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import DepartmentFilterBarSection from '@/pages/managers/managerDepartmentManagementPage/section/DepartmentFilterBarSection'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const ManagerDepartmentManagementPage = () => {
	const { t } = useTranslation()
	const confirm = useConfirm()

	const [filters, setFilters] = useState({ name: '' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [departments, setDepartments] = useState([])
	const [totalPage, setTotalPage] = useState(0)
	const [selectedDepartment, setSelectedDepartment] = useState(null)
	const [openCreateDialog, setOpenCreateDialog] = useState(false)
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false)

	const getAllDepartments = useFetch(
		ApiUrls.DEPARTMENT.MANAGEMENT.INDEX,
		{ ...filters, page, pageSize },
		[filters, page, pageSize]
	)

	useEffect(() => {
		if (getAllDepartments.data) {
			const data = getAllDepartments.data
			setDepartments(data.collection || [])
			setTotalPage(data.totalPage || 1)
		}
	}, [getAllDepartments.data])

	const createDepartment = useAxiosSubmit({
		url: ApiUrls.DEPARTMENT.MANAGEMENT.CREATE,
		method: 'POST',
		onSuccess: async () => {
			setOpenCreateDialog(false)
			await getAllDepartments.fetch()
		},
	})

	const updateDepartment = useAxiosSubmit({
		url: ApiUrls.DEPARTMENT.MANAGEMENT.UPDATE(selectedDepartment?.id),
		method: 'PUT',
		onSuccess: async () => {
			setOpenUpdateDialog(false)
			setSelectedDepartment(null)
			await getAllDepartments.fetch()
		},
	})

	const deleteDepartment = useAxiosSubmit({
		method: 'DELETE',
		onSuccess: async () => {
			setSelectedDepartment(null)
			await getAllDepartments.fetch()
		},
	})

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
									description: t('department.dialog.confirm_delete_description', { name: row.name }),
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

	const formFields = [
		{ key: 'name', title: t('department.field.name') },
		{ key: 'location', title: t('department.field.location') },
	]

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Stack direction='row' alignItems='center' justifyContent='space-between'>
					<Typography variant='h5'>{t('department.title.department_management')}</Typography>
					<Button
						variant='contained'
						color='success'
						onClick={() => setOpenCreateDialog(true)}
						sx={{ minWidth: 120 }}
					>
						{t('button.create')}
					</Button>
				</Stack>

				<DepartmentFilterBarSection
					filters={filters}
					loading={getAllDepartments.loading}
					onFilterClick={(newFilters) => {
						setFilters(newFilters)
						setPage(1)
					}}
					onResetFilterClick={() => {
						const reset = { name: '' }
						setFilters(reset)
						setPage(1)
					}}
				/>

				<Stack spacing={2}>
					<GenericTable data={departments} fields={tableFields} rowKey='id' />
					<Stack justifyContent='center' px={2}>
						<GenericTablePagination
							totalPage={totalPage}
							page={page}
							setPage={setPage}
							pageSize={pageSize}
							setPageSize={setPageSize}
							pageSizeOptions={[5, 10, 20]}
							loading={getAllDepartments.loading}
						/>
					</Stack>
				</Stack>
			</Stack>

			<GenericFormDialog
				title={t('department.dialog.create_title')}
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
				fields={formFields}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				onSubmit={async ({ values, closeDialog }) => {
					var response = await createDepartment.submit(values)
					if (response) closeDialog()
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
					var response = await updateDepartment.submit(values)
					if (response) closeDialog()
				}}
			/>
		</Paper>
	)
}

export default ManagerDepartmentManagementPage
