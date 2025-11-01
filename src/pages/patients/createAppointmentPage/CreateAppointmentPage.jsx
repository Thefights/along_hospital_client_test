import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useEnum from '@/hooks/useEnum'
import useFetch from '@/hooks/useFetch'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import LeftCreateAppointmentSection from '@/pages/patients/createAppointmentPage/sections/LeftCreateAppointmentSection'
import RightCreateAppointmentSection from '@/pages/patients/createAppointmentPage/sections/RightCreateAppointmentSection'
import { setProfileStore } from '@/redux/reducers/patientReducer'
import { maxLen } from '@/utils/validateUtil'
import { Grid, Paper } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const CreateAppointmentPage = () => {
	const { t } = useTranslation()
	const _enum = useEnum()
	const navigate = useNavigate()

	const [submitted, setSubmitted] = useState(false)

	const getSpecialty = useFetch(ApiUrls.SPECIALTY.INDEX)
	const userProfile = useReduxStore({
		url: ApiUrls.USER.PROFILE,
		selector: (state) => state.patient.profile,
		setStore: setProfileStore,
	})

	const { values, handleChange, setField, registerRef, validateAll } = useForm({
		date: '',
		time: '',
		purpose: '',
		specialtyId: '',
	})
	const { renderField, hasRequiredMissing } = useFieldRenderer(
		{ ...userProfile, ...values },
		setField,
		handleChange,
		registerRef,
		submitted,
		'outlined',
		'medium'
	)
	const postAppointment = useAxiosSubmit({
		url: ApiUrls.APPOINTMENT.INDEX,
		method: 'POST',
		data: values,
	})

	const specialtiesList = Array.isArray(getSpecialty.data?.collection)
		? getSpecialty.data.collection
		: []

	const patientFields = [
		{
			key: 'fullName',
			title: t('profile.field.name'),
			required: false,
		},
		{
			key: 'email',
			title: t('profile.field.email'),
			type: 'email',
			required: false,
		},
		{
			key: 'phone',
			title: t('profile.field.phone'),
			required: false,
		},
		{
			key: 'address',
			title: t('profile.field.address'),
			multiple: 3,
			required: false,
		},
		{
			key: 'dateOfBirth',
			title: t('profile.field.date_of_birth'),
			type: 'date',
			required: false,
		},
		{
			key: 'gender',
			title: t('profile.field.gender'),
			required: false,
		},
	]

	const appointmentFields = [
		{
			key: 'appointmentType',
			title: t('appointment.field.type'),
			type: 'select',
			options: _enum.appointmentTypeOptions,
		},
		{
			key: 'appointmentMeetingType',
			title: t('appointment.field.meeting_type'),
			type: 'select',
			options: _enum.appointmentMeetingTypeOptions,
		},
		{ key: 'date', title: t('text.date'), type: 'date' },
		{ key: 'time', title: t('text.time'), type: 'time' },
		{
			key: 'timeSlot',
			title: t('appointment.field.time_slot'),
			type: 'select',
			options: _enum.appointmentTimeSlotOptions,
		},
		{
			key: 'purpose',
			title: t('appointment.field.purpose'),
			multiple: 4,
			validate: [maxLen(1000)],
			required: false,
		},
		{
			key: 'specialtyId',
			title: t('appointment.field.specialty'),
			type: 'select',
			options: specialtiesList.map((s) => ({ label: s.name, value: s.id })),
		},
	]

	const fields = [...patientFields, ...appointmentFields]

	const handleSubmit = async () => {
		setSubmitted(true)
		const ok = validateAll()
		const isMissing = hasRequiredMissing(fields)
		if (!ok || isMissing) {
			toast.warn(t('error.fill_all_required'))
		} else {
			const response = await postAppointment.submit()
			if (response) {
				navigate(routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.APPOINTMENT.INDEX))
			}
		}
	}

	return (
		<Paper
			sx={{
				bgcolor: (t) => t.palette.background.paper,
				borderRadius: 3,
				my: 3,
				overflow: 'hidden',
			}}
		>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, md: 6, lg: 7 }} my={2} px={4} py={2}>
					<LeftCreateAppointmentSection
						patientFields={patientFields}
						appointmentFields={appointmentFields}
						renderField={renderField}
						handleSubmit={handleSubmit}
						loadingGet={userProfile.loading || getSpecialty.loading}
						loadingSubmit={postAppointment.loading}
					/>
				</Grid>
				<Grid size={{ xs: 0, md: 6, lg: 5 }}>
					<RightCreateAppointmentSection />
				</Grid>
			</Grid>
		</Paper>
	)
}

export default CreateAppointmentPage
