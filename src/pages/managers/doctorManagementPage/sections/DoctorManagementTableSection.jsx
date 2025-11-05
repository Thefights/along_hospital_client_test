import ActionMenu from '@/components/generals/ActionMenu'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useTranslation from '@/hooks/useTranslation'
import { Button, Stack } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

const DoctorManagementTableSection = ({
	doctors,
	loading,
	sort,
	setSort,
	refetch = () => {},
	onCreate = () => {},
	onEdit = () => {},
}) => {
	const [selectedIds, setSelectedIds] = useState([])

	const confirm = useConfirm()
	const { t } = useTranslation()

	const deleteSelectedDoctors = useAxiosSubmit({
		url: ApiUrls.DOCTOR.MANAGEMENT.DELETE_SELECTED,
		method: 'DELETE',
	})

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
			const res = await deleteSelectedDoctors.submit(null, {
				overrideParam: { ids: selectedIds },
			})
			if (res) {
				refetch()
				setSelectedIds([])
			}
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
								onClick: () => onEdit(row),
							},
						]}
					/>
				),
			},
		],
		[t, onEdit]
	)

	return (
		<>
			<Stack spacing={2} direction='row' alignItems='center' justifyContent='flex-end' ml={2} mb={1.5}>
				<Button variant='contained' color='primary' onClick={onCreate}>
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
		</>
	)
}

export default DoctorManagementTableSection
