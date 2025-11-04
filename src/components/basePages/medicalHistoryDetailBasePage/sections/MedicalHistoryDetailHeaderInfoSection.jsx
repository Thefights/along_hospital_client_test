import SkeletonBox from '@/components/skeletons/SkeletonBox'
import { defaultMedicalHistoryStatusStyle } from '@/configs/defaultStylesConfig'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import {
	formatDateBasedOnCurrentLanguage,
	formatDatetimeStringBasedOnCurrentLanguage,
} from '@/utils/formatDateUtil'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { Avatar, Button, Chip, Grid, Paper, Stack, Typography, useTheme } from '@mui/material'

const MedicalHistoryDetailHeaderInfoSection = ({
	medicalHistory,
	onClickPatientInfo,
	onClickDoctorInfo,
	loading = false,
}) => {
	const theme = useTheme()
	const { t } = useTranslation()
	const _enum = useEnum()

	const userInfoMappingFields = [
		{ key: 'phone', title: t('profile.field.phone') },
		{ key: 'email', title: t('profile.field.email') },
		{ key: 'gender', title: t('profile.field.gender') },
		{ key: 'dateOfBirth', title: t('profile.field.date_of_birth') },
	]

	const medicalHistoryMappingFields = [
		{ key: 'id', title: t('medical_history.field.id') },
		{ key: 'medicalHistoryStatus', title: t('medical_history.field.status') },
		{ key: 'diagnosis', title: t('medical_history.field.diagnosis') },
		{ key: 'completedDate', title: t('medical_history.field.completed_date') },
		{ key: 'followUpAppointmentDate', title: t('medical_history.field.follow_up_appointment_date') },
	]

	if (loading) {
		return (
			<Paper sx={{ p: 3, borderRadius: 2 }}>
				<Typography variant='h6' gutterBottom>
					{t('medical_history.title.medical_history_information')}
				</Typography>
				<Grid container alignItems='stretch' spacing={2}>
					{[1, 2, 3].map(() => (
						<Grid size={{ xs: 12, md: 4 }} key={Math.random()}>
							<SkeletonBox numberOfBoxes={1} heights={[200]} rounded />
						</Grid>
					))}
				</Grid>
			</Paper>
		)
	}

	return (
		<Paper sx={{ p: 3, borderRadius: 2 }}>
			<Typography variant='h6' gutterBottom>
				{t('medical_history.title.medical_history_information')}
			</Typography>
			<Grid container alignItems='stretch' spacing={2}>
				<Grid size={{ xs: 12, md: 4 }}>
					<Paper
						sx={{
							display: 'flex',
							gap: 1,
							flexDirection: 'column',
							p: 2,
							bgcolor: theme.palette.background.default,
						}}
					>
						<Stack direction='row' spacing={1} alignItems='center'>
							<Avatar src={getImageFromCloud(medicalHistory?.patient?.avatar)} />
							<Button variant='text' onClick={onClickPatientInfo}>
								{medicalHistory?.patient?.name}
							</Button>
						</Stack>
						{userInfoMappingFields.map((field) => (
							<Stack direction={'row'} width='100%' justifyContent={'space-between'} key={field.key}>
								<Typography variant='body2' color='text.secondary'>
									{field.title}:
								</Typography>
								<Typography variant='body2' color='text.secondary' textAlign={'right'}>
									{medicalHistory?.patient?.[field.key] || '-'}
								</Typography>
							</Stack>
						))}
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Paper
						sx={{
							display: 'flex',
							gap: 1,
							flexDirection: 'column',
							p: 2,
							bgcolor: theme.palette.background.default,
						}}
					>
						<Stack direction='row' spacing={1} alignItems='center'>
							<Avatar src={getImageFromCloud(medicalHistory?.doctor?.avatar)} />
							<Button variant='text' onClick={onClickDoctorInfo}>
								{medicalHistory?.doctor?.name}
							</Button>
						</Stack>
						{userInfoMappingFields.map((field) => (
							<Stack direction={'row'} width='100%' justifyContent={'space-between'} key={field.key}>
								<Typography variant='body2' color='text.secondary'>
									{field.title}:
								</Typography>
								<Typography variant='body2' color='text.secondary' textAlign={'right'}>
									{medicalHistory?.doctor?.[field.key] || '-'}
								</Typography>
							</Stack>
						))}
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Paper
						sx={{
							p: 2,
							bgcolor: theme.palette.background.default,
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Stack spacing={1} width='100%' alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
							{medicalHistoryMappingFields.map((field) => {
								const rawValue = medicalHistory?.[field.key]

								let value
								switch (field.key) {
									case 'medicalHistoryStatus':
										value = getEnumLabelByValue(_enum.medicalHistoryStatusOptions, rawValue) || '-'
										break
									case 'completedDate':
										value = formatDatetimeStringBasedOnCurrentLanguage(rawValue)
										break
									case 'followUpAppointmentDate':
										value = formatDateBasedOnCurrentLanguage(rawValue)
										break
									default:
										value = rawValue
								}

								value = value || '-'

								return (
									<Stack direction={'row'} width='100%' justifyContent={'space-between'} key={field.key}>
										<Typography variant='body2' color='text.secondary'>
											{field.title}:
										</Typography>
										{field.key === 'medicalHistoryStatus' ? (
											<Chip
												label={value}
												size='small'
												color={defaultMedicalHistoryStatusStyle(medicalHistory?.[field.key])}
												sx={{ px: 1.25, borderRadius: 2 }}
											/>
										) : (
											<Typography variant='body2' color='text.secondary' textAlign={'right'}>
												{value}
											</Typography>
										)}
									</Stack>
								)
							})}
						</Stack>
					</Paper>
				</Grid>
			</Grid>
		</Paper>
	)
}

export default MedicalHistoryDetailHeaderInfoSection
