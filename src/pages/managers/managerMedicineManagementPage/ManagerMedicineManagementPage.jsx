import MedicineFilterBar from '@/components/basePages/manageMedicineBasePage/sections/MedicineFilterBarSection'
import MedicineImagesPreview from '@/components/basePages/manageMedicineBasePage/sections/MedicineImagesPreviewSection'
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

const ManagerMedicineManagementPage = () => {
	const { t } = useTranslation()
	const confirm = useConfirm()

	const [filters, setFilters] = useState({ name: '', medicineCategoryId: '', medicineUnit: '' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [medicines, setMedicines] = useState([])
	const [categories, setCategories] = useState([])
	const [selectedMedicine, setSelectedMedicine] = useState(null)
	const [totalPage, setTotalPage] = useState([])
	const [openCreateDialog, setOpenCreateDialog] = useState(false)
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false)

	const getAllMedicines = useFetch(
		ApiUrls.MEDICINE.MANAGEMENT.INDEX,
		{ ...filters, page, pageSize },
		[filters, page, pageSize]
	)
	const getAllCategories = useFetch(ApiUrls.MEDICINE_CATEGORY.GET_ALL)

	useEffect(() => {
		if (getAllMedicines.data) {
			const data = getAllMedicines.data
			setMedicines(
				data.collection?.map((m) => ({
					...m,
					categoryName: m.medicineCategory?.name ?? '',
				})) || []
			)
			setTotalPage(data.totalPage)
		}
	}, [getAllMedicines.data])

	useEffect(() => {
		if (getAllCategories.data) {
			setCategories(getAllCategories.data.map((c) => ({ label: c.name, value: c.id })) || [])
		}
	}, [getAllCategories.data])

	const createMedicine = useAxiosSubmit({
		url: ApiUrls.MEDICINE.MANAGEMENT.CREATE,
		method: 'POST',
		onSuccess: async () => {
			setOpenCreateDialog(false)
			await getAllMedicines.fetch({ params: { ...filters, page, pageSize } })
		},
	})

	const updateMedicine = useAxiosSubmit({
		url: selectedMedicine
			? ApiUrls.MEDICINE.MANAGEMENT.UPDATE(selectedMedicine.id)
			: ApiUrls.MEDICINE.MANAGEMENT.INDEX,
		method: 'PUT',
		onSuccess: async () => {
			setOpenUpdateDialog(false)
			setSelectedMedicine(null)
			await getAllMedicines.fetch({ params: { ...filters, page, pageSize } })
		},
	})

	const deleteMedicine = useAxiosSubmit({
		method: 'DELETE',
		onSuccess: async () => {
			setSelectedMedicine(null)
			await getAllMedicines.fetch({ params: { ...filters, page, pageSize } })
		},
	})

	const formFields = [
		{ key: 'name', title: t('medicine.field.name') },
		{ key: 'brand', title: t('medicine.field.brand') },
		{ key: 'medicineUnit', title: t('medicine.field.unit'), type: 'select' },
		{ key: 'price', title: t('medicine.field.price'), type: 'number' },
		{
			key: 'medicineCategoryId',
			title: t('medicine.field.medicine_category.name'),
			type: 'select',
			options: categories,
		},
		{ key: 'images', title: t('medicine.field.images'), type: 'image', multiple: 5 },
		{ key: 'minQuantity', title: t('medicine.field.min_quantity'), type: 'number' },
		{ key: 'maxQuantity', title: t('medicine.field.max_quantity'), type: 'number' },
	]

	const tableFields = [
		{ key: 'id', title: 'ID', width: 8 },
		{ key: 'name', title: t('medicine.field.name'), width: 15 },
		{ key: 'brand', title: t('medicine.field.brand'), width: 15 },
		{ key: 'medicineUnit', title: t('medicine.field.unit'), width: 10 },
		{ key: 'categoryName', title: t('medicine.field.medicine_category.name'), width: 15 },
		{ key: 'price', title: t('medicine.field.price'), width: 10 },
		{
			key: 'images',
			title: t('medicine.field.images'),
			render: (_, row) => <MedicineImagesPreview images={row.images || []} rowId={row.id} />,
		},
		{
			key: 'actions',
			title: t('medicine.field.action'),
			width: 12,
			render: (_, row) => (
				<ActionMenu
					actions={[
						{
							title: t('button.update'),
							onClick: () => {
								setSelectedMedicine(row)
								setOpenUpdateDialog(true)
							},
						},
						{
							title: t('button.delete'),
							onClick: async () => {
								const isConfirmed = await confirm({
									confirmText: t('button.delete'),
									confirmColor: 'error',
									title: t('medicine.dialog.confirm_delete_title'),
									description: t('medicine.dialog.confirm_delete_description', { name: row.name }),
								})
								if (isConfirmed) {
									await deleteMedicine.submit(null, {
										overrideUrl: ApiUrls.MEDICINE.MANAGEMENT.DELETE(row.id),
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
				<Stack direction='row' alignItems='center' justifyContent='space-between'>
					<Typography variant='h5'>{t('medicine.title.medicine_management')}</Typography>
					<Button
						variant='contained'
						color='success'
						onClick={() => setOpenCreateDialog(true)}
						sx={{ minWidth: 120 }}
					>
						{t('button.create')}
					</Button>
				</Stack>

				<MedicineFilterBar
					filters={filters}
					categories={categories}
					loading={getAllMedicines.loading}
					onFilterClick={(newValues) => {
						setFilters(newValues)
						setPage(1)
						getAllMedicines.fetch({ params: { ...newValues, page: 1, pageSize } })
					}}
					onResetFilterClick={() => {
						const resetFilters = { name: '', medicineCategoryId: '', medicineUnit: '' }
						setFilters(resetFilters)
						setPage(1)
						getAllMedicines.fetch({ params: { ...resetFilters, page: 1, pageSize } })
					}}
				/>

				<Stack spacing={2}>
					<GenericTable data={medicines} fields={tableFields} rowKey='id' />
					<Stack justifyContent='center' px={2}>
						<GenericTablePagination
							totalPage={totalPage}
							page={page}
							setPage={setPage}
							pageSize={pageSize}
							setPageSize={setPageSize}
							pageSizeOptions={[5, 10, 20]}
							loading={getAllMedicines.loading}
						/>
					</Stack>
				</Stack>
			</Stack>

			<GenericFormDialog
				title={t('medicine.dialog.create_title')}
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
				fields={formFields}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				onSubmit={async ({ values, closeDialog }) => {
					const response = await createMedicine.submit(values)
					if (response) closeDialog()
				}}
			/>

			<GenericFormDialog
				title={t('medicine.dialog.update_title')}
				open={openUpdateDialog}
				onClose={() => setOpenUpdateDialog(false)}
				fields={formFields}
				initialValues={
					selectedMedicine
						? {
								...selectedMedicine,
								medicineCategoryId: selectedMedicine.medicineCategory?.id,
								quantity: selectedMedicine.inventory?.quantity || 0,
								minQuantity: selectedMedicine.inventory?.minQuantity || 0,
								maxQuantity: selectedMedicine.inventory?.maxQuantity || 0,
						  }
						: {}
				}
				submitLabel={t('button.update')}
				submitButtonColor='info'
				onSubmit={async ({ values, closeDialog }) => {
					const response = await updateMedicine.submit(values)
					if (response) closeDialog()
				}}
			/>
		</Paper>
	)
}

export default ManagerMedicineManagementPage
