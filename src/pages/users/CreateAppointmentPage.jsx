import LeftCreateAppointmentSection from '@/components/sections/createAppointmentSections/LeftCreateAppointmentSection'
import RightCreateAppointmentSection from '@/components/sections/createAppointmentSections/RightCreateAppointmentSection'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { maxLen } from '@/utils/validateUtil'
import { Grid, Paper } from '@mui/material'
import { useState } from 'react'

const initialValues = {
	fullName: 'Jane Doe',
	email: 'jane.doe@example.com',
	phone: '+84 912 345 678',
	address: '12 Nguyen Trai, District 1, HCMC',
	dateOfBirth: '1995-05-20',
	gender: 'Female',
	date: '',
	time: '',
	purpose: '',
	specialtyId: '',
}

const CreateAppointmentPage = () => {
	const [submitted, setSubmitted] = useState(false)

	const { t } = useTranslation()
	const { values, handleChange, setField, registerRef, validateAll } = useForm(initialValues)
	const { renderField, hasRequiredMissing } = useFieldRenderer(
		values,
		setField,
		handleChange,
		registerRef,
		submitted,
		'outlined',
		'medium'
	)

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
			options: [{ label: t('appointment.select_specialty'), value: '' }],
		},
	]

	const fields = [...patientFields, ...appointmentFields]

	const handleSubmit = () => {
		setSubmitted(true)
		const ok = validateAll()
		const isMissing = hasRequiredMissing(fields)
		if (!ok || isMissing) {
			alert('Please fill all required fields')
		} else {
			alert('Form submitted: ' + JSON.stringify(values, null, 2))
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
