import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import GenericTable from '@/components/tables/GenericTable'
import { useConfirm } from '@/hooks/useConfirm'
import useTranslation from '@/hooks/useTranslation'
import { maxLen } from '@/utils/validateUtil'
import { Button, Stack } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

const DoctorManagementTableSection = ({ doctors, loading, sort, setSort, refetch = () => {} }) => {
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

	const handleCreateSubmit = async ({ closeDialog }) => {
		// UI only: close dialog and refetch placeholder
		closeDialog()
		refetch()
	}

	const handleUpdateSubmit = async ({ closeDialog }) => {
		// UI only: close dialog and refetch placeholder
		closeDialog()
		refetch()
	}

	const handleDeleteClick = useCallback(
		async (row) => {
			const isConfirmed = await confirm({
				confirmText: t('button.delete'),
				confirmColor: 'error',
				title: t('doctor.title.doctor_management'),
				description: `${t('specialty.title.delete_confirm')} ${row.name}?`,
			})
			if (isConfirmed) {
				// UI only: call refetch after delete placeholder
				refetch()
			}
		},
		[confirm, t, refetch]
	)

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
							{
								title: t('button.delete'),
								onClick: () => handleDeleteClick(row),
							},
						]}
					/>
				),
			},
		],
		[t, handleDeleteClick]
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
					{ label: t('enum.gender.male'), value: 'Male' },
					{ label: t('enum.gender.female'), value: 'Female' },
					{ label: t('enum.gender.other'), value: 'Other' },
				],
				required: true,
			},
			{ key: 'dateOfBirth', title: t('doctor.field.date_of_birth'), type: 'date', required: true },
			{
				key: 'specialtyId',
				title: t('doctor.field.specialty'),
				type: 'select',
				options: [],
				required: true,
			},
			{
				key: 'departmentId',
				title: t('doctor.field.department'),
				type: 'select',
				options: [],
				required: true,
			},
			{
				key: 'qualification',
				title: t('doctor.field.qualification'),
				type: 'text',
				validate: [maxLen(500)],
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
		[t]
	)

	return (
		<>
			<Stack spacing={2} direction='row' alignItems='center' justifyContent='flex-end' ml={2} mb={1.5}>
				<Button variant='contained' color='primary' onClick={() => setOpenCreate(true)}>
					{t('button.create')}
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
