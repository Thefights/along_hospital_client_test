import ManageAppointmentBasePage from '@/components/basePages/manageAppointmentBasePage/ManageAppointmentBasePage'
import ConfirmationDialog from '@/components/dialogs/commons/ConfirmationDialog'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setSpecialtiesStore } from '@/redux/reducers/managementReducer'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'

const PatientAppointmentHistoryPage = () => {
	const [selectedAppointment, setSelectedAppointment] = useState(null)
	const [openCancelDialog, setOpenCancelDialog] = useState(false)
	const [cancelReason, setCancelReason] = useState('')
	const [filters, setFilters] = useState({
		page: 1,
		pageSize: 5,
	})

	const { t } = useTranslation()

	const getAppointments = useFetch(ApiUrls.APPOINTMENT.INDEX, filters, [filters])
	const specialtiesStore = useReduxStore({
		url: ApiUrls.SPECIALTY.GET_ALL,
		selector: (state) => state.management.specialties,
		setStore: setSpecialtiesStore,
	})

	const cancelAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.CANCEL(selectedAppointment?.id),
		method: 'PUT',
		data: { reason: cancelReason },
		onSuccess: async () => {
			setSelectedAppointment(null)
			await getAppointments.fetch()
		},
	})

	const handleCancelAppointment = async () => {
		var response = await cancelAppointment.submit()
		if (response) {
			setCancelReason('')
			setOpenCancelDialog(false)
		}
	}

	return (
		<Box my={3}>
			<ManageAppointmentBasePage
				headerTitle={t('appointment.title.appointment_history')}
				filters={filters}
				setFilters={setFilters}
				selectedAppointment={selectedAppointment}
				setSelectedAppointment={setSelectedAppointment}
				totalPage={getAppointments.data?.totalPage || 1}
				appointments={getAppointments.data?.collection || []}
				specialties={specialtiesStore.data || []}
				loading={getAppointments.loading}
				drawerButtons={
					(selectedAppointment?.appointmentStatus === EnumConfig.AppointmentStatus.Scheduled ||
						selectedAppointment?.appointmentStatus === EnumConfig.AppointmentStatus.Confirmed) && (
						<Button onClick={() => setOpenCancelDialog(true)} color='error' variant='contained'>
							{t('appointment.button.cancel_appointment')}
						</Button>
					)
				}
			/>
			<ConfirmationDialog
				key={selectedAppointment?.id}
				open={openCancelDialog}
				onClose={() => {
					setOpenCancelDialog(false)
					setCancelReason('')
				}}
				onConfirm={handleCancelAppointment}
				title={t('appointment.dialog.confirm_cancel_title')}
				description={
					<Stack spacing={1}>
						<Typography variant='subtitle2'>
							{t('appointment.dialog.confirm_cancel_description')}
						</Typography>
						<ValidationTextField
							value={cancelReason}
							onChange={(e) => setCancelReason(e.target.value)}
							multiline
							required={false}
							variant='standard'
						/>
					</Stack>
				}
				confirmButtonText={t('appointment.button.cancel_appointment')}
				confirmButtonColor='error'
				confirmButtonLoading={cancelAppointment.loading}
			/>
		</Box>
	)
}

export default PatientAppointmentHistoryPage
