import { defaultMedicalHistoryStatusStyle } from '@/configs/defaultStylesConfig'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { Avatar, Button, Chip, Grid, Paper, Stack, Typography, useTheme } from '@mui/material'

const MedicalHistoryDetailHeaderInfoSection = ({
	medicalHistory,
	onClickPatientInfo,
	onClickDoctorInfo,
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
		{ key: 'medicalHistoryId', title: t('medical_history.field.id') },
		{ key: 'medicalHistoryStatus', title: t('medical_history.field.status') },
		{ key: 'diagnosis', title: t('medical_history.field.diagnosis') },
		{ key: 'completedDate', title: t('medical_history.field.completed_date') },
		{ key: 'followUpAppointmentDate', title: t('medical_history.field.follow_up_appointment_date') },
	]

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
							{medicalHistoryMappingFields.map((field) => (
								<Stack direction={'row'} width='100%' justifyContent={'space-between'} key={field.key}>
									<Typography variant='body2' color='text.secondary'>
										{field.title}:
									</Typography>
									{field.key === 'medicalHistoryStatus' ? (
										<Chip
											label={
												getEnumLabelByValue(_enum.medicalHistoryStatusOptions, medicalHistory?.[field.key]) ||
												'-'
											}
											size='small'
											color={defaultMedicalHistoryStatusStyle(medicalHistory?.[field.key])}
											sx={{ px: 1.25, borderRadius: 2 }}
										/>
									) : (
										<Typography variant='body2' color='text.secondary' textAlign={'right'}>
											{medicalHistory?.[field.key] || '-'}
										</Typography>
									)}
								</Stack>
							))}
						</Stack>
					</Paper>
				</Grid>
			</Grid>
		</Paper>
	)
}

export default MedicalHistoryDetailHeaderInfoSection
