import ManageAppointmentBasePage from '@/components/basePages/ManageAppointmentBasePage'
import ConfirmationDialog from '@/components/dialogs/commons/ConfirmationDialog'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'

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

	const { t } = useTranslation()

	const getAppointments = useFetch(ApiUrls.APPOINTMENT.INDEX, filters, [
		filters.status,
		filters.page,
		filters.pageSize,
	])
	const cancelAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.CANCEL(selectedAppointment?.id),
		method: 'PUT',
		data: { reason: cancelReason },
		onSuccess: async () => {
			await getAppointments.fetch()
			setSelectedAppointment(null)
		},
	})

	const handleCancelAppointment = async () => {
		try {
			await cancelAppointment.submit()
		} finally {
			setCancelReason('')
			setOpenCancelDialog(false)
		}
	}

	const onFilterClick = async () => {
		setFilters((prev) => ({ ...prev, page: 1 }))
		await getAppointments.fetch()
	}

	return (
		<Box my={3}>
			<ManageAppointmentBasePage
				headerTitle={t('appointment.title.appointment_history')}
				filters={filters}
				setFilters={setFilters}
				selectedAppointment={selectedAppointment}
				setSelectedAppointment={setSelectedAppointment}
				onFilterClick={onFilterClick}
				drawerButtons={
					(selectedAppointment?.status === 'scheduled' ||
						selectedAppointment?.status === 'confirmed') && (
						<Button onClick={() => setOpenCancelDialog(true)} color='error' variant='contained'>
							{t('appointment.button.cancel_appointment')}
						</Button>
					)
				}
				totalAppointments={getAppointments.data?.totalCount || 0}
				appointments={getAppointments.data?.collection || []}
				appointmentSpecialties={getAppointments.data?.specialties || []}
				appointmentDoctors={getAppointments.data?.doctors || []}
				loading={getAppointments.loading}
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
