import ManageAppointmentBasePage from '@/components/basePages/ManageAppointmentBasePage'
import ConfirmationButton from '@/components/generals/ConfirmationButton'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { useState } from 'react'

const DoctorAppointmentManagementPage = () => {
	const [selectedAppointment, setSelectedAppointment] = useState(null)
	const [filters, setFilters] = useState({
		dateRange: { start: '', end: '' },
		status: '',
		search: '',
		page: 1,
		pageSize: 5,
	})
	const { t } = useTranslation()

	const getAppointments = useFetch(
		ApiUrls.APPOINTMENT.MANAGEMENT.GET_ALL_BY_CURRENT_DOCTOR,
		filters,
		[filters.status, filters.page, filters.pageSize]
	)
	const confirmAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.MANAGEMENT.CONFIRM(selectedAppointment?.id),
		method: 'PUT',
	})
	const completeAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.MANAGEMENT.COMPLETE(selectedAppointment?.id),
		method: 'PUT',
	})
	const denyAssignment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.MANAGEMENT.DENY_ASSIGNMENT(selectedAppointment?.id),
		method: 'PUT',
	})

	const onFilterClick = async () => {
		setFilters((prev) => ({ ...prev, page: 1 }))
		await getAppointments.fetch()
	}

	return (
		<ManageAppointmentBasePage
			headerTitle={t('appointment.title.appointment_history')}
			filters={filters}
			setFilters={setFilters}
			selectedAppointment={selectedAppointment}
			setSelectedAppointment={setSelectedAppointment}
			totalAppointments={getAppointments.data?.totalCount || 0}
			appointments={getAppointments.data?.collection || []}
			onFilterClick={onFilterClick}
			showSpecialtiesAndDoctorsFilter={false}
			loading={getAppointments.loading}
			drawerButtons={
				selectedAppointment?.status === 'scheduled' ? (
					<>
						<ConfirmationButton
							confirmationTitle={t('appointment.dialog.confirm_accept_title')}
							confirmationDescription={t('appointment.dialog.confirm_accept_description')}
							confirmButtonColor='primary'
							confirmButtonText={t('appointment.button.accept_assignment')}
							loading={confirmAppointment.loading}
						>
							{t('appointment.button.accept_assignment')}
						</ConfirmationButton>
						<ConfirmationButton
							confirmationTitle={t('appointment.dialog.confirm_deny_title')}
							confirmationDescription={t('appointment.dialog.confirm_deny_description')}
							confirmButtonColor='error'
							confirmButtonText={t('appointment.button.deny_assignment')}
							loading={denyAssignment.loading}
						>
							{t('appointment.button.deny_assignment')}
						</ConfirmationButton>
					</>
				) : selectedAppointment?.status === 'confirmed' ? (
					<ConfirmationButton
						confirmationTitle={t('appointment.dialog.confirm_complete_title')}
						confirmationDescription={t('appointment.dialog.confirm_complete_description')}
						confirmButtonColor='primary'
						confirmButtonText={t('appointment.button.complete_appointment')}
						loading={completeAppointment.loading}
					>
						{t('appointment.button.complete_appointment')}
					</ConfirmationButton>
				) : null
			}
		/>
	)
}

export default DoctorAppointmentManagementPage
