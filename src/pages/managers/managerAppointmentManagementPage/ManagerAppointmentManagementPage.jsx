import ManageAppointmentBasePage from '@/components/basePages/ManageAppointmentBasePage'
import ConfirmationDialog from '@/components/dialogs/commons/ConfirmationDialog'
import DoctorPickerDialog from '@/components/dialogs/DoctorPickerDialog'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setSpecialtiesStore } from '@/redux/reducers/managementReducer'
import { Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'

const ManagerAppointmentManagementPage = () => {
	const [selectedAppointment, setSelectedAppointment] = useState(null)
	const [selectedDoctor, setSelectedDoctor] = useState(null)
	const [openDoctorPickerDialog, setOpenDoctorPickerDialog] = useState(false)
	const [openRefuseDialog, setOpenRefuseDialog] = useState(false)
	const [refuseReason, setRefuseReason] = useState('')
	const [filters, setFilters] = useState({
		startDate: '',
		endDate: '',
		status: '',
		specialtyId: '',
		search: '',
		page: 1,
		pageSize: 5,
	})

	const { t } = useTranslation()

	const getAppointments = useFetch(ApiUrls.APPOINTMENT.MANAGEMENT.INDEX, filters, [
		filters.status,
		filters.page,
		filters.pageSize,
	])
	const specialtiesStore = useReduxStore({
		url: ApiUrls.SPECIALTY.GET_ALL,
		selector: (state) => state.management.specialties,
		setStore: setSpecialtiesStore,
	})

	const assignDoctorToAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.MANAGEMENT.ASSIGN_DOCTOR(selectedAppointment?.id, selectedDoctor?.id),
		method: 'PUT',
		onSuccess: async () => {
			await getAppointments.fetch()
			setSelectedAppointment(null)
			setSelectedDoctor(null)
		},
	})
	const refuseAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.MANAGEMENT.REFUSE(selectedAppointment?.id),
		method: 'PUT',
		data: { reason: refuseReason },
		onSuccess: async () => {
			await getAppointments.fetch()
			setSelectedAppointment(null)
		},
	})

	const handleRefuseAppointment = async () => {
		try {
			await refuseAppointment.submit()
		} finally {
			setRefuseReason('')
			setOpenRefuseDialog(false)
		}
	}

	const onFilterClick = async () => {
		setFilters((prev) => ({ ...prev, page: 1 }))
		await getAppointments.fetch()
	}

	return (
		<>
			<ManageAppointmentBasePage
				headerTitle={t('appointment.title.appointment_management')}
				filters={filters}
				setFilters={setFilters}
				selectedAppointment={selectedAppointment}
				setSelectedAppointment={setSelectedAppointment}
				onFilterClick={onFilterClick}
				totalAppointments={getAppointments.data?.totalCount || 0}
				appointments={getAppointments.data?.collection || []}
				specialties={specialtiesStore.data || []}
				loading={getAppointments.loading}
				drawerButtons={
					selectedAppointment?.status === 'scheduled' ? (
						<Stack direction='row' spacing={2}>
							<Button onClick={() => setOpenDoctorPickerDialog(true)} variant='contained' color='info'>
								{t('appointment.button.assign_doctor')}
							</Button>
							<Button onClick={() => setOpenRefuseDialog(true)} variant='contained' color='error'>
								{t('appointment.button.refuse_appointment')}
							</Button>
						</Stack>
					) : null
				}
			/>
			<DoctorPickerDialog
				open={openDoctorPickerDialog}
				onClose={() => setOpenDoctorPickerDialog(false)}
				onDoctorSelected={setSelectedDoctor}
				onSubmit={async ({ values, closeDialog }) => {
					await assignDoctorToAppointment.submit({ doctorId: values.doctorId })
					closeDialog()
				}}
			/>
			<ConfirmationDialog
				open={openRefuseDialog}
				onClose={() => {
					setOpenRefuseDialog(false)
					setRefuseReason('')
				}}
				title={t('appointment.dialog.confirm_refuse_title')}
				description={
					<Stack spacing={1}>
						<Typography variant='subtitle2'>
							{t('appointment.dialog.confirm_refuse_description')}
						</Typography>
						<ValidationTextField
							value={refuseReason}
							onChange={(e) => setRefuseReason(e.target.value)}
							multiline
							required={false}
							variant='standard'
						/>
					</Stack>
				}
				confirmButtonText={t('appointment.button.refuse_appointment')}
				confirmButtonColor='error'
				onConfirm={handleRefuseAppointment}
			/>
		</>
	)
}

export default ManagerAppointmentManagementPage
