import LeftCreateAppointmentSection from '@/components/sections/createAppointmentSections/LeftCreateAppointmentSection'
import RightCreateAppointmentSection from '@/components/sections/createAppointmentSections/RightCreateAppointmentSection'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setProfileStore } from '@/redux/reducers/userReducer'
import { maxLen } from '@/utils/validateUtil'
import { Grid, Paper } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'

const CreateAppointmentPage = () => {
	const { t } = useTranslation()

	const [submitted, setSubmitted] = useState(false)
	const getSpecialty = useFetch(ApiUrls.SPECIALTY.BASE)

	const userProfile = useReduxStore({
		url: ApiUrls.USER.PROFILE,
		selector: (state) => state.user.profile,
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
	const postAppointment = useAxiosSubmit(ApiUrls.APPOINTMENT.BASE, 'POST', values)

	const patientFields = [
		{
			key: 'fullName',
			title: t('profile.full_name'),
			required: false,
			props: { slotProps: { input: { readOnly: true } } },
		},
		{
			key: 'email',
			title: t('profile.email'),
			type: 'email',
			required: false,
			props: { slotProps: { input: { readOnly: true } } },
		},
		{
			key: 'phone',
			title: t('profile.phone'),
			required: false,
			props: { slotProps: { input: { readOnly: true } } },
		},
		{
			key: 'address',
			title: t('profile.address'),
			multiple: 3,
			required: false,
			props: { slotProps: { input: { readOnly: true } } },
		},
		{
			key: 'dateOfBirth',
			title: t('profile.date_of_birth'),
			type: 'date',
			props: { slotProps: { input: { readOnly: true } } },
			required: false,
		},
		{
			key: 'gender',
			title: t('profile.gender'),
			props: { slotProps: { input: { readOnly: true } } },
			required: false,
		},
	]

	const appointmentFields = [
		{ key: 'date', title: t('text.date'), type: 'date' },
		{ key: 'time', title: t('text.time'), type: 'time' },
		{
			key: 'purpose',
			title: t('appointment.purpose'),
			multiple: 4,
			validate: [maxLen(1000)],
			required: false,
		},
		{
			key: 'specialtyId',
			title: t('appointment.specialty'),
			type: 'select',
			options: [
				{ label: t('appointment.select_specialty'), value: '' },
				...(getSpecialty.data?.map((s) => ({ label: s.name, value: s.id })) || []),
			],
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
			await postAppointment.submit()
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
