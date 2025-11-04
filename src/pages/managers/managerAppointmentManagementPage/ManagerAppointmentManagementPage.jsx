import ManageAppointmentBasePage from '@/components/basePages/manageAppointmentBasePage/ManageAppointmentBasePage'
import ConfirmationDialog from '@/components/dialogs/commons/ConfirmationDialog'
import DoctorPickerDialog from '@/components/dialogs/DoctorPickerDialog'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
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
		page: 1,
		pageSize: 5,
	})

	const { t } = useTranslation()

	const getAppointments = useFetch(ApiUrls.APPOINTMENT.MANAGEMENT.INDEX, filters, [filters])
	const specialtiesStore = useReduxStore({
		selector: (state) => state.management.specialties,
		setStore: setSpecialtiesStore,
	})

	const assignDoctorToAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.MANAGEMENT.ASSIGN_DOCTOR(selectedAppointment?.id, selectedDoctor?.id),
		method: 'PUT',
		onSuccess: async () => {
			handleCloseDoctorPickerDialog()
			setSelectedAppointment(null)
			await getAppointments.fetch()
		},
	})
	const refuseAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.MANAGEMENT.REFUSE(selectedAppointment?.id),
		method: 'PUT',
		data: { reason: refuseReason },
		onSuccess: async () => {
			handleCloseRefuseDialog()
			setSelectedAppointment(null)
			await getAppointments.fetch()
		},
	})

	const handleCloseDoctorPickerDialog = () => {
		setOpenDoctorPickerDialog(false)
		setSelectedDoctor(null)
	}

	const handleCloseRefuseDialog = () => {
		setOpenRefuseDialog(false)
		setRefuseReason('')
	}

	return (
		<>
			<ManageAppointmentBasePage
				headerTitle={t('appointment.title.appointment_management')}
				filters={filters}
				setFilters={setFilters}
				selectedAppointment={selectedAppointment}
				setSelectedAppointment={setSelectedAppointment}
				totalPage={getAppointments.data?.totalPage || 1}
				appointments={getAppointments.data?.collection || []}
				specialties={specialtiesStore.data || []}
				loading={getAppointments.loading}
				drawerButtons={
					selectedAppointment?.appointmentStatus === EnumConfig.AppointmentStatus.Scheduled ? (
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
				onClose={handleCloseDoctorPickerDialog}
				onDoctorSelected={setSelectedDoctor}
				onSubmit={async ({ values }) =>
					await assignDoctorToAppointment.submit({ doctorId: values.doctorId })
				}
			/>
			<ConfirmationDialog
				open={openRefuseDialog}
				onClose={handleCloseRefuseDialog}
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
				onConfirm={async () => await refuseAppointment.submit()}
			/>
		</>
	)
}

export default ManagerAppointmentManagementPage
