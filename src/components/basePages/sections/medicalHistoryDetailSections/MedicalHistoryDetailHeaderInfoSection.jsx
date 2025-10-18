import { defaultMedicalHistoryStatusStyle } from '@/configs/defaultStylesConfig'
import { getImageFromCloud } from '@/utils/commons'
import { Avatar, Button, Chip, Grid, Paper, Stack, Typography, useTheme } from '@mui/material'

const MedicalHistoryDetailHeaderInfoSection = ({
	medicalHistory,
	onClickPatientInfo,
	onClickDoctorInfo,
}) => {
	const theme = useTheme()

	const userInfoMappingFields = [
		{ key: 'phone', title: 'Phone' },
		{ key: 'email', title: 'Email' },
		{ key: 'gender', title: 'Gender' },
		{ key: 'age', title: 'Age' },
	]

	const medicalHistoryMappingFields = [
		{ key: 'medicalHistoryId', title: 'Medical History ID' },
		{ key: 'medicalHistoryStatus', title: 'Medical History Status' },
		{ key: 'diagnosis', title: 'Diagnosis' },
		{ key: 'completedDate', title: 'Completed' },
		{ key: 'followUpAppointmentDate', title: 'Follow-up' },
	]

	return (
		<Paper sx={{ p: 3, borderRadius: 2 }}>
			<Typography variant='h6' gutterBottom>
				Medical History Information
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
								{medicalHistory?.doctor?.name ?? 'Test'}
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
								<Stack
									direction={'row'}
									width='100%'
									justifyContent={'space-between'}
									alignItems={'center'}
									key={field.key}
								>
									<Typography variant='body2' color='text.secondary'>
										{field.title}:
									</Typography>
									{field.key === 'medicalHistoryStatus' ? (
										<Chip
											label={medicalHistory?.[field.key] || '-'}
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
