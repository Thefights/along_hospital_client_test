import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useTranslation from '@/hooks/useTranslation'
import { maxLen } from '@/utils/validateUtil'
import { Button, Stack } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

const DoctorManagementTableSection = ({
	doctors,
	specialties,
	departments,
	loading,
	sort,
	setSort,
	refetch = () => {},
}) => {
	const [selectedIds, setSelectedIds] = useState([])
	const [selectedRow, setSelectedRow] = useState({})
	const [openCreate, setOpenCreate] = useState(false)
	const [openUpdate, setOpenUpdate] = useState(false)

	const confirm = useConfirm()
	const { t } = useTranslation()

	const createInitialValues = useMemo(
		() => ({
			name: '',
			phone: '',
			gender: '',
			dateOfBirth: '',
			specialtyId: '',
			departmentId: '',
			qualification: '',
			image: null,
			signatureImage: null,
		}),
		[]
	)

	const createDoctor = useAxiosSubmit({ url: ApiUrls.DOCTOR.MANAGEMENT.INDEX, method: 'POST' })
	const updateDoctor = useAxiosSubmit({
		url: ApiUrls.DOCTOR.MANAGEMENT.DETAIL(selectedRow.id),
		method: 'PUT',
	})
	const deleteSelectedDoctors = useAxiosSubmit({
		url: ApiUrls.DOCTOR.MANAGEMENT.DELETE_SELECTED,
		method: 'DELETE',
	})

	const handleCreateSubmit = async ({ values, closeDialog }) => {
		const respond = await createDoctor.submit(values)
		if (respond) {
			closeDialog()
			refetch()
		}
	}

	const handleUpdateSubmit = async ({ values, closeDialog }) => {
		if (!selectedRow?.id) return

		const res = await updateDoctor.submit(values)
		if (res) {
			closeDialog()
			refetch()
		}
	}

	const handleDeleteSelectedClick = useCallback(async () => {
		if (selectedIds.length === 0) return

		const isConfirmed = await confirm({
			confirmText: t('button.delete'),
			confirmColor: 'error',
			title: t('doctor.title.doctor_management'),
			description: `${t('specialty.title.delete_confirm')} ${selectedIds.length} ${t(
				'doctor.field.doctor'
			)}?`,
		})

		if (isConfirmed) {
			const query = selectedIds.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
			const url = `${ApiUrls.DOCTOR.MANAGEMENT.DELETE_SELECTED}?${query}`
			const res = await deleteSelectedDoctors.submit(null, { overrideUrl: url })
			if (res) refetch()
		}
	}, [confirm, t, deleteSelectedDoctors, refetch, selectedIds])

	const fields = useMemo(
		() => [
			{ key: 'id', title: t('doctor.field.id'), width: 10, sortable: true, fixedColumn: true },
			{ key: 'name', title: t('doctor.field.name'), width: 20, sortable: false },
			{ key: 'gender', title: t('doctor.field.gender'), width: 20, sortable: false },
			{ key: 'departmentName', title: t('doctor.field.department'), width: 25, sortable: false },
			{ key: 'specialtyName', title: t('doctor.field.specialty'), width: 25, sortable: false },
			{ key: 'qualification', title: t('doctor.field.qualification'), width: 15, sortable: false },
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
						]}
					/>
				),
			},
		],
		[t]
	)

	const upsertFields = useMemo(
		() => [
			{
				key: 'name',
				title: t('doctor.field.name'),
				type: 'text',
				validate: [maxLen(50)],
				required: true,
			},
			{
				key: 'phone',
				title: t('doctor.field.phone'),
				type: 'text',
				validate: [maxLen(15)],
				required: true,
			},
			{
				key: 'gender',
				title: t('doctor.field.gender'),
				type: 'select',
				options: [
					{ label: t('enum.gender.male'), value: EnumConfig.Gender.Male },
					{ label: t('enum.gender.female'), value: EnumConfig.Gender.Female },
					{ label: t('enum.gender.other'), value: EnumConfig.Gender.Other },
				],
				required: true,
			},
			{ key: 'dateOfBirth', title: t('doctor.field.date_of_birth'), type: 'date', required: true },
			{
				key: 'specialtyId',
				title: t('doctor.field.specialty'),
				type: 'select',
				options: (specialties || [])
					.map((s) => ({ value: s?.id, label: s?.name }))
					.filter((o) => o.value != null),
				required: true,
			},
			{
				key: 'departmentId',
				title: t('doctor.field.department'),
				type: 'select',
				options: (departments || [])
					.map((d) => ({ value: d?.id, label: d?.name }))
					.filter((o) => o.value != null),
				required: true,
			},
			{
				key: 'qualification',
				title: t('doctor.field.qualification'),
				type: 'select',
				options: [
					{ label: t('enum.qualification.bachelor'), value: EnumConfig.Qualification.Bachelor },
					{ label: t('enum.qualification.master'), value: EnumConfig.Qualification.Master },
					{ label: t('enum.qualification.phd'), value: EnumConfig.Qualification.PhD },
					{ label: t('enum.qualification.specialist'), value: EnumConfig.Qualification.Specialist },
				],
				required: true,
			},
			{ key: 'image', title: t('doctor.field.image'), type: 'image', required: true },
			{
				key: 'signatureImage',
				title: t('doctor.field.signature_image'),
				type: 'image',
				required: true,
			},
		],
		[t, specialties, departments]
	)

	return (
		<>
			<Stack spacing={2} direction='row' alignItems='center' justifyContent='flex-end' ml={2} mb={1.5}>
				<Button variant='contained' color='primary' onClick={() => setOpenCreate(true)}>
					{t('button.create')}
				</Button>
				<Button
					variant='contained'
					color='error'
					disabled={selectedIds.length === 0}
					onClick={handleDeleteSelectedClick}
				>
					{t('button.delete_selected')}
				</Button>
			</Stack>
			<GenericTable
				data={doctors}
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
				fields={upsertFields}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				title={t('doctor.title.doctor_management')}
				onSubmit={handleCreateSubmit}
			/>
			<GenericFormDialog
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				fields={upsertFields}
				initialValues={selectedRow}
				submitLabel={t('button.update')}
				submitButtonColor='success'
				title={t('doctor.title.doctor_management')}
				onSubmit={handleUpdateSubmit}
			/>
		</>
	)
}

export default DoctorManagementTableSection
