import { EnumConfig } from '@/configs/enumConfig'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { isEmail, maxLen } from '@/utils/validateUtil'
import { Bloodtype, Close } from '@mui/icons-material'
import {
	Avatar,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	Stack,
	Typography,
} from '@mui/material'
import { useState } from 'react'

const DoctorInfoDialog = ({ open, onClose, doctorInfo = {} }) => {
	const defaultValues = {
		id: doctorInfo.id || '',
		name: doctorInfo.name || '',
		image: doctorInfo.image || '',
		dateOfBirth: doctorInfo.dateOfBirth || '',
		gender: doctorInfo.gender || '',
		address: doctorInfo.address || '',
		phone: doctorInfo.phone || '',
		email: doctorInfo.email || '',
		hireDate: doctorInfo.hireDate || '',
		department: doctorInfo.department || '',
		qualification: doctorInfo.qualification || '',
		specialty: doctorInfo.specialty || '',
	}

	const [submitted, setSubmitted] = useState(false)
	const { t } = useTranslation()

	const { values, setField, handleChange, registerRef, validateAll } = useForm(defaultValues)
	const { renderField, hasRequiredMissing } = useFieldRenderer(
		values,
		setField,
		handleChange,
		registerRef,
		submitted,
		'outlined',
		'small'
	)
	const basicInfoFields = [
		{ key: 'dateOfBirth', title: 'DOB', type: 'date' },
		{
			key: 'gender',
			title: t('profile.field.gender'),
			type: 'select',
			options: EnumConfig.genderOptions,
		},
		{ key: 'phone', title: t('profile.field.phone'), validate: [maxLen(15)], type: 'tel' },
		{
			key: 'email',
			title: t('profile.field.email'),
			type: 'email',
			validate: [isEmail(), maxLen(255)],
			required: false,
		},
		{
			key: 'address',
			title: t('profile.field.address'),
			multiple: 3,
			validate: [maxLen(255)],
			required: false,
		},
	]

	const professionalInfoFields = [
		{
			key: 'hireDate',
			title: t('profile.field.hire_date'),
			type: 'date',
		},
		{
			key: 'department',
			title: t('profile.field.department'),
			type: 'text',
			validate: [maxLen(100)],
		},
		{
			key: 'qualification',
			title: t('profile.field.qualification'),
			type: 'text',
			validate: [maxLen(100)],
		},
		{
			key: 'specialty',
			title: t('profile.field.specialty'),
			type: 'text',
			validate: [maxLen(100)],
		},
	]

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth scroll='body'>
			<DialogTitle
				sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
			>
				<Stack direction='row' spacing={2} alignItems='center'>
					<Avatar src={getImageFromCloud(values.image)} sx={{ width: 80, height: 80 }} />
					<Typography variant='h6'>{values.name}</Typography>
					{values.bloodType && (
						<Chip
							label={`${t('profile.field.blood_type')}: ${values.bloodType}`}
							icon={<Bloodtype />}
							color='error'
							size='small'
						/>
					)}
				</Stack>
				<IconButton>
					<Close onClick={onClose} />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ p: 3 }}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6 }}>
						<Typography variant='subtitle1' sx={{ mb: 1 }}>
							{t('dialog.doctor_info.basic_info')}
						</Typography>
						<Stack spacing={2}>
							{basicInfoFields.map((f) => renderField({ ...f, props: { ...f.props, disabled: true } }))}
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<Typography variant='subtitle1' sx={{ mb: 1 }}>
							{t('dialog.doctor_info.professional_info')}
						</Typography>
						<Stack spacing={2}>
							{professionalInfoFields.map((f) =>
								renderField({ ...f, props: { ...f.props, disabled: true } })
							)}
						</Stack>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	)
}

export default DoctorInfoDialog
