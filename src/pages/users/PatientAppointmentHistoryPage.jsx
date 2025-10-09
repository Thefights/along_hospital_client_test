import ManageAppointmentBasePage from '@/components/basePages/ManageAppointmentBasePage'
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog'
import SkeletonBox from '@/components/skeletons/SkeletonBox'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
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

	const { t } = useTranslation()

	const { search, ...rest } = filters
	const getAppointments = useFetch(
		ApiUrls.APPOINTMENT.INDEX,
		{
			...rest,
			doctorName: search || undefined,
		},
		[filters]
	)
	const cancelAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.CANCEL(selectedAppointment?.id),
		method: 'PUT',
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
		<Box my={3}>
			{getAppointments.loading ? (
				<Paper sx={{ p: 2 }}>
					<SkeletonBox numberOfBoxes={4} heights={[50, 100, 300, 50]} />
				</Paper>
			) : (
				<ManageAppointmentBasePage
					headerTitle={t('appointment.title.appointment_history')}
					filters={filters}
					setFilters={setFilters}
					selectedAppointment={selectedAppointment}
					setSelectedAppointment={setSelectedAppointment}
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
				/>
			)}
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
