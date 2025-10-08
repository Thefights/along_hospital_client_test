import ManageAppointmentBasePage from '@/components/basePages/ManageAppointmentBasePage'
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import { Button, Stack, Typography } from '@mui/material'
import { useCallback, useState } from 'react'

const PatientAppointmentHistoryPage = () => {
	const [selectedAppointment, setSelectedAppointment] = useState(null)
	const [openCancelDialog, setOpenCancelDialog] = useState(false)
	const [cancelReason, setCancelReason] = useState('')
	const [filters, setFilters] = useState({
		dateRange: { start: '', end: '' },
		status: '',
		specialty: '',
		doctor: '',
		search: '',
		page: 1,
	})

	const { search, ...rest } = filters
	const getAppointments = useFetch(
		ApiUrls.APPOINTMENT.BASE,
		{
			...rest,
			doctorName: search || undefined,
		},
		[filters]
	)
	const cancelAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.CANCEL(selectedAppointment?.id),
		method: 'POST',
		data: { reason: cancelReason },
	})

	const handleCancelAppointment = useCallback(async () => {
		try {
			await cancelAppointment.submit()
		} finally {
			setCancelReason('')
			setOpenCancelDialog(false)
		}
	}, [cancelAppointment, setOpenCancelDialog, setCancelReason])

	return (
		<>
			<ManageAppointmentBasePage
				filters={filters}
				setFilters={setFilters}
				selectedAppointment={selectedAppointment}
				setSelectedAppointment={setSelectedAppointment}
				drawerButtons={
					(selectedAppointment?.status === 'scheduled' ||
						selectedAppointment?.status === 'confirmed') && (
						<Button onClick={() => setOpenCancelDialog(true)} color='error' variant='contained'>
							Cancel Appointment
						</Button>
					)
				}
				totalAppointments={getAppointments.data?.totalCount || 0}
				appointments={getAppointments.data?.collection || [{ status: 'scheduled' }]}
				appointmentSpecialties={getAppointments.data?.specialties || []}
				appointmentDoctors={getAppointments.data?.doctors || []}
			/>
			<ConfirmationDialog
				key={selectedAppointment?.id}
				open={openCancelDialog}
				onClose={() => {
					setOpenCancelDialog(false)
					setCancelReason('')
				}}
				onConfirm={handleCancelAppointment}
				title={'Cancel Appointment?'}
				description={
					<Stack spacing={1}>
						<Typography variant='subtitle2'>Please provide a reason for cancellation:</Typography>
						<ValidationTextField
							value={cancelReason}
							onChange={(e) => setCancelReason(e.target.value)}
							multiline
							required={false}
							variant='standard'
						/>
					</Stack>
				}
				confirmButtonText={'Cancel Appointment'}
				confirmButtonColor='error'
				confirmButtonLoading={cancelAppointment.loading}
			/>
		</>
	)
}

export default PatientAppointmentHistoryPage
