import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setDepartmentsStore, setSpecialtiesStore } from '@/redux/reducers/managementReducer'
import { maxLen } from '@/utils/validateUtil'
import { Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import DoctorManagementFilterSection from './sections/DoctorManagementFilterSection'
import DoctorManagementTableSection from './sections/DoctorManagementTableSection'

const DoctorManagementPage = () => {
	const { t } = useTranslation()

	const [filters, setFilters] = useState({ doctorName: '', specialtyId: '' })
	const [sort, setSort] = useState({ key: 'id', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [openCreate, setOpenCreate] = useState(false)
	const [openUpdate, setOpenUpdate] = useState(false)
	const [selectedRow, setSelectedRow] = useState({})

	const getDoctors = useFetch(
		ApiUrls.DOCTOR.MANAGEMENT.INDEX,
		{ sort: `${sort.key} ${sort.direction}`, ...filters, page, pageSize },
		[sort, filters, page, pageSize]
	)

	const specialtyStore = useReduxStore({
		selector: (state) => state.management.specialties,
		setStore: setSpecialtiesStore,
	})

	const departmentStore = useReduxStore({
		selector: (state) => state.management.departments,
		setStore: setDepartmentsStore,
	})

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
				options: (specialtyStore.data || [])
					.map((s) => ({ value: s?.id, label: s?.name }))
					.filter((o) => o.value != null),
				required: true,
			},
			{
				key: 'departmentId',
				title: t('doctor.field.department'),
				type: 'select',
				options: (departmentStore.data || [])
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
		[t, specialtyStore.data, departmentStore.data]
	)

	const handleCreateSubmit = async ({ values, closeDialog }) => {
		const respond = await createDoctor.submit(values)
		if (respond) {
			closeDialog()
			getDoctors.fetch()
		}
	}

	const handleUpdateSubmit = async ({ values, closeDialog }) => {
		if (!selectedRow?.id) return
		const res = await updateDoctor.submit(values)
		if (res) {
			closeDialog()
			getDoctors.fetch()
		}
	}

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('doctor.title.doctor_management')}</Typography>
				<DoctorManagementFilterSection
					filters={filters}
					setFilters={setFilters}
					loading={getDoctors.loading}
					specialties={specialtyStore.data}
				/>
				<DoctorManagementTableSection
					doctors={getDoctors.data?.collection}
					loading={getDoctors.loading}
					sort={sort}
					setSort={setSort}
					refetch={getDoctors.fetch}
					onCreate={() => setOpenCreate(true)}
					onEdit={(row) => {
						setSelectedRow(row)
						setOpenUpdate(true)
					}}
				/>
				<GenericTablePagination
					totalPage={getDoctors.data?.totalPage}
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					loading={getDoctors.loading}
				/>
			</Stack>
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
		</Paper>
	)
}

export default DoctorManagementPage
