import useEnum from '@/hooks/useEnum'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { isEmail, maxLen, numberRange } from '@/utils/validateUtil'
import { Bloodtype, Close } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
	Avatar,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	IconButton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import { useState } from 'react'

const PatientInfoDialog = ({ open, onClose, onSave, patientInfo = {}, isEditable }) => {
	const defaultValues = {
		id: patientInfo.id || '',
		name: patientInfo.name || '',
		image: patientInfo.image || '',
		dateOfBirth: patientInfo.dateOfBirth || '',
		gender: patientInfo.gender || '',
		address: patientInfo.address || '',
		phone: patientInfo.phone || '',
		email: patientInfo.email || '',
		height: patientInfo.height || '',
		weight: patientInfo.weight || '',
		bloodType: patientInfo.bloodType || '',
		allergies: patientInfo.allergies || [],
	}

	const [submitted, setSubmitted] = useState(false)
	const { t } = useTranslation()
	const _enum = useEnum()

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
		{ key: 'dateOfBirth', title: t('profile.field.date_of_birth'), type: 'date' },
		{
			key: 'gender',
			title: t('profile.field.gender'),
			type: 'select',
			options: _enum.genderOptions,
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
	const healthInfoFields = [
		{
			key: 'height',
			title: t('profile.field.height'),
			type: 'number',
			validate: [numberRange(30, 300)],
		},
		{
			key: 'weight',
			title: t('profile.field.weight'),
			type: 'number',
			validate: [numberRange(1, 500)],
		},
		{
			key: 'bloodType',
			title: t('profile.field.blood_type'),
			type: 'select',
			options: _enum.bloodTypeOptions,
		},
	]
	const allergyFields = [
		{ key: 'name', title: t('profile.field.allergy.name'), validate: [maxLen(100)] },
		{
			key: 'severityLevel',
			title: t('profile.field.allergy.severity'),
			type: 'select',
			options: _enum.severityLevelOptions,
		},
		{
			key: 'reaction',
			title: t('profile.field.allergy.reaction'),
			multiple: 1,
			validate: [maxLen(500)],
			required: false,
		},
	]
	const fields = [...basicInfoFields, ...healthInfoFields, ...allergyFields]

	const height = parseFloat(values.height)
	const weight = parseFloat(values.weight)
	const bmi = height && weight ? (weight / (height / 100) ** 2).toFixed(1) : null

	const handleAddAllergy = () => {
		setField('allergies', [
			...values.allergies,
			{ id: Date.now(), name: '', severityLevel: '', reaction: '' },
		])
	}

	const handleDeleteAllergy = (id) => {
		setField(
			'allergies',
			values.allergies.filter((a) => a.id !== id)
		)
	}

	const handleSave = () => {
		setSubmitted(true)
		const ok = validateAll()
		const isMissing = hasRequiredMissing(fields)

		if (!ok || isMissing) {
			return
		}

		onSave(values)
	}

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
							{t('dialog.patient_info.basic_info')}
						</Typography>
						<Stack spacing={2}>
							{basicInfoFields.map((f) =>
								renderField({ ...f, props: { ...f.props, disabled: !isEditable } })
							)}
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<Typography variant='subtitle1' sx={{ mb: 1 }}>
							{t('dialog.patient_info.health_info')}
						</Typography>
						<Stack spacing={2}>
							{healthInfoFields.map((f) =>
								renderField({ ...f, props: { ...f.props, disabled: !isEditable } })
							)}
							{bmi && (
								<Box sx={{ mt: 1 }}>
									<Typography variant='body2'>BMI: {bmi}</Typography>
								</Box>
							)}
						</Stack>
					</Grid>
				</Grid>
				<Divider sx={{ my: 3 }} />
				<Typography variant='subtitle1' sx={{ mb: 1 }}>
					{t('dialog.patient_info.allergies')}
				</Typography>
				<Box sx={{ border: 1, borderColor: 'divider' }}>
					<Table size='small'>
						<TableHead>
							<TableRow>
								<TableCell>{t('dialog.patient_info.allergy_table.name')}</TableCell>
								<TableCell>{t('dialog.patient_info.allergy_table.severity')}</TableCell>
								<TableCell>{t('dialog.patient_info.allergy_table.reaction')}</TableCell>
								{isEditable && <TableCell />}
							</TableRow>
						</TableHead>
						<TableBody>
							{values.allergies.map((a, i) => {
								return (
									<TableRow key={a.id || i}>
										{allergyFields.map((f) => (
											<TableCell key={f.key} sx={{ py: 2 }}>
												{renderField({
													...f,
													key: `allergies.${i}.${f.key}`,
													props: { disabled: !isEditable },
												})}
											</TableCell>
										))}
										{isEditable && (
											<TableCell>
												<IconButton onClick={() => handleDeleteAllergy(a.id)}>
													<DeleteIcon color='error' fontSize='small' />
												</IconButton>
											</TableCell>
										)}
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
					{isEditable && (
						<Button startIcon={<AddIcon />} sx={{ m: 1 }} onClick={handleAddAllergy}>
							{t('dialog.patient_info.allergy_table.add_allergy')}
						</Button>
					)}
				</Box>
			</DialogContent>
			<DialogActions
				sx={{
					bottom: 0,
					bgcolor: 'background.paper',
					borderTop: '1px solid',
					borderColor: 'divider',
					p: 2,
				}}
			>
				{isEditable ? (
					<>
						<Button onClick={onClose} variant='outlined'>
							{t('button.cancel')}
						</Button>
						<Button onClick={handleSave} variant='contained'>
							{t('button.save')}
						</Button>
					</>
				) : (
					<Button onClick={onClose} variant='contained'>
						{t('button.close')}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	)
}

export default PatientInfoDialog
