import ManageMedicineBasePage from '@/components/basePages/manageMedicineBasePage/ManageMedicineBasePage'
import MedicineImagesPreview from '@/components/basePages/manageMedicineBasePage/sections/MedicineImagesPreview'
import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { useEffect, useState } from 'react'

const ManagerMedicineManagementPage = () => {
	const { t } = useTranslation()
	const _enum = useEnum()
	const confirm = useConfirm()

	const [filters, setFilters] = useState({ search: '', category: '', page: 1, pageSize: 10 })
	const [medicines, setMedicines] = useState([])
	const [totalMedicines, setTotalMedicines] = useState(0)
	const [categories, setCategories] = useState([])
	const [selectedMedicine, setSelectedMedicine] = useState(null)
	const [selectedRows, setSelectedRows] = useState([])
	const [openCreateDialog, setOpenCreateDialog] = useState(false)
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false)

	const getAllMedicines = useAxiosSubmit({
		url: ApiUrls.MEDICINE.MANAGEMENT.GET_ALL,
		method: 'GET',
		params: filters,
		onSuccess: (res) => {
			const data = res?.data
			setMedicines(
				data?.collection?.map((m) => ({ ...m, categoryName: m.medicineCategory?.name || '' })) || []
			)
			setTotalMedicines(data?.totalCount || 0)
		},
	})

	useEffect(() => {
		getAllMedicines.submit()
	}, [filters])

	const getAllCategories = useAxiosSubmit({
		url: ApiUrls.MEDICINE_CATEGORY.GET_ALL,
		method: 'GET',
		onSuccess: (res) => {
			const data = res?.data?.collection || []
			setCategories(data.map((c) => ({ label: c.name, value: c.id })))
		},
	})

	useEffect(() => {
		getAllCategories.submit()
	})

	const createMedicine = useAxiosSubmit({
		url: ApiUrls.MEDICINE.MANAGEMENT.CREATE,
		method: 'POST',
		onSuccess: async () => {
			setOpenCreateDialog(false)
			await getAllMedicines.submit()
		},
	})

	const updateMedicine = useAxiosSubmit({
		url: selectedMedicine ? ApiUrls.MEDICINE.MANAGEMENT.UPDATE(selectedMedicine.id) : '/medicine',
		method: 'PUT',
		onSuccess: async () => {
			setOpenUpdateDialog(false)
			setSelectedMedicine(null)
			await getAllMedicines.submit()
		},
	})

	const deleteMedicine = useAxiosSubmit({
		method: 'DELETE',
		onSuccess: async () => {
			setSelectedMedicine(null)
			setSelectedRows([])
			await getAllMedicines.submit()
		},
	})

	const handleFilterClick = () => setFilters((prev) => ({ ...prev, page: 1 }))

	const formFields = [
		{ key: 'name', title: t('medicine.field.name'), required: true },
		{ key: 'brand', title: t('medicine.field.brand') },
		{
			key: 'medicineUnit',
			title: t('medicine.field.unit'),
			type: 'select',
			options: _enum.medicineUnitOptions,
			required: true,
		},
		{ key: 'price', title: t('medicine.field.price'), type: 'number', required: true },
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
			type: 'image',
			multiple: 5,
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
		<>
			<ManageMedicineBasePage
				headerTitle={t('medicine.title.medicine_management')}
				medicines={medicines}
				totalMedicines={totalMedicines}
				totalPage={Math.ceil(totalMedicines / filters.pageSize)}
				filters={filters}
				setFilters={setFilters}
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				onFilterClick={handleFilterClick}
				setOpenCreateDialog={setOpenCreateDialog}
				fields={tableFields}
				categories={categories}
				loading={
					getAllMedicines.loading ||
					createMedicine.loading ||
					updateMedicine.loading ||
					deleteMedicine.loading
				}
			/>

			<GenericFormDialog
				title={t('medicine.dialog.create_title')}
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
				fields={formFields}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				onSubmit={async ({ values, closeDialog }) => {
					await createMedicine.submit(values)
					closeDialog()
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
					await updateMedicine.submit(values)
					closeDialog()
				}}
			/>
		</>
	)
}

export default ManagerMedicineManagementPage
