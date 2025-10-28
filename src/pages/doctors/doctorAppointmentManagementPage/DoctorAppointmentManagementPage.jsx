import ManageAppointmentBasePage from '@/components/basePages/manageAppointmentBasePage/ManageAppointmentBasePage'
import ConfirmationButton from '@/components/generals/ConfirmationButton'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setSpecialtiesStore } from '@/redux/reducers/managementReducer'
import { Stack } from '@mui/material'
import { useState } from 'react'

const DoctorAppointmentManagementPage = () => {
	const [selectedAppointment, setSelectedAppointment] = useState(null)
	const [filters, setFilters] = useState({
		page: 1,
		pageSize: 5,
	})

	const { t } = useTranslation()

	const getAppointments = useFetch(
		ApiUrls.APPOINTMENT.MANAGEMENT.GET_ALL_BY_CURRENT_DOCTOR,
		filters,
		[filters]
	)
	const specialtiesStore = useReduxStore({
		url: ApiUrls.SPECIALTY.GET_ALL,
		selector: (state) => state.management.specialties,
		setStore: setSpecialtiesStore,
	})

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

	return (
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
							color='error'
							loading={denyAssignment.loading}
						>
							{t('appointment.button.deny_assignment')}
						</ConfirmationButton>
					</Stack>
				) : selectedAppointment?.appointmentStatus === EnumConfig.AppointmentStatus.Confirmed ? (
					<ConfirmationButton
						confirmationTitle={t('appointment.dialog.confirm_complete_title')}
						confirmationDescription={t('appointment.dialog.confirm_complete_description')}
						confirmButtonColor='primary'
						confirmButtonText={t('appointment.button.complete_appointment')}
						color='success'
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
