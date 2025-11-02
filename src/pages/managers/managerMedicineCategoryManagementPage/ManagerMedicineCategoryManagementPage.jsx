import React, { useState, useEffect } from 'react'
import ManageMedicineCategoryBasePage from '@/components/basePages/manageMedicineCategoryBasePage/ManageMedicineCategoryBasePage'
import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import useTranslation from '@/hooks/useTranslation'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'

const ManagerMedicineCategoryManagementPage = () => {
	const { t } = useTranslation()

	const [filters, setFilters] = useState({ search: '', page: 1, pageSize: 10 })
	const [categories, setCategories] = useState([])
	const [totalCategories, setTotalCategories] = useState(0)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [selectedRows, setSelectedRows] = useState([])
	const [openCreateDialog, setOpenCreateDialog] = useState(false)
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
	const confirm = useConfirm()

	const getAllCategories = useAxiosSubmit({
		url: ApiUrls.MEDICINE_CATEGORY.GET_ALL,
		method: 'GET',
		params: filters,
		onSuccess: (res) => {
			const data = res?.data
			const list = data?.collection || []
			setCategories(list)
			setTotalCategories(data?.totalCount || list.length)
		},
	})

	useEffect(() => {
		getAllCategories.submit()
	}, [filters])

	const createCategory = useAxiosSubmit({
		url: ApiUrls.MEDICINE_CATEGORY.CREATE,
		method: 'POST',
		onSuccess: async () => {
			setOpenCreateDialog(false)
			await getAllCategories.submit()
		},
	})

	const updateCategory = useAxiosSubmit({
		url: selectedCategory
			? ApiUrls.MEDICINE_CATEGORY.UPDATE(selectedCategory.id)
			: '/medicine-category',
		method: 'PUT',
		onSuccess: async () => {
			setOpenUpdateDialog(false)
			setSelectedCategory(null)
			await getAllCategories.submit()
		},
	})

	const deleteCategory = useAxiosSubmit({
		method: 'DELETE',
		onSuccess: async () => {
			setSelectedCategory(null)
			setSelectedRows([])
			await getAllCategories.submit()
		},
	})

	const handleFilterClick = () => setFilters((prev) => ({ ...prev, page: 1 }))

	const formFields = [
		{ key: 'name', title: t('medicine_category.field.name'), required: true },
		{
			key: 'description',
			title: t('medicine_category.field.description'),
			required: true,
			multiline: true,
			rows: 3,
		},
	]

	const tableFields = [
		{ key: 'id', title: t('medicine_category.field.id'), width: 15 },
		{ key: 'name', title: t('medicine_category.field.name'), width: 35 },
		{
			key: 'description',
			title: t('medicine_category.field.description'),
			width: 40,
			render: (value) => value || '-',
		},
		{
			key: 'actions',
			title: t('medicine_category.field.actions'),
			width: 20,
			render: (_, row) => (
				<ActionMenu
					actions={[
						{
							title: t('button.update'),
							onClick: () => {
								setSelectedCategory(row)
								setOpenUpdateDialog(true)
							},
						},
						{
							title: t('button.delete'),
							onClick: async () => {
								const isConfirmed = await confirm({
									confirmText: t('button.delete'),
									confirmColor: 'error',
									title: t('medicine_category.dialog.confirm_delete_title'),
									description: t('medicine_category.dialog.confirm_delete_description'),
								})

								if (isConfirmed) {
									await deleteCategory.submit(null, {
										overrideUrl: ApiUrls.MEDICINE_CATEGORY.DELETE(row.id),
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
			<ManageMedicineCategoryBasePage
				headerTitleKey='medicine_category.title.medicine_category_management'
				categories={categories}
				totalCategories={totalCategories}
				totalPage={Math.ceil(totalCategories / filters.pageSize)}
				filters={filters}
				setFilters={setFilters}
				setSelectedCategory={setSelectedCategory}
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				onFilterClick={handleFilterClick}
				onCreateClick={() => setOpenCreateDialog(true)}
				fields={tableFields}
				loading={
					getAllCategories.loading ||
					createCategory.loading ||
					updateCategory.loading ||
					deleteCategory.loading
				}
			/>

			<GenericFormDialog
				title={t('medicine_category.dialog.create_title')}
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
				fields={formFields}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				onSubmit={async ({ values, closeDialog }) => {
					await createCategory.submit(values)
					closeDialog()
				}}
			/>

			<GenericFormDialog
				title={t('medicine_category.dialog.update_title')}
				open={openUpdateDialog}
				onClose={() => setOpenUpdateDialog(false)}
				fields={formFields}
				initialValues={selectedCategory ? { ...selectedCategory } : {}}
				submitLabel={t('button.update')}
				submitButtonColor='info'
				onSubmit={async ({ values, closeDialog }) => {
					await updateCategory.submit(values)
					closeDialog()
				}}
			/>
		</>
	)
}

export default ManagerMedicineCategoryManagementPage
