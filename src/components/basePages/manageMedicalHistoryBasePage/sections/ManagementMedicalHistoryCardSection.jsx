import EmptyBox from '@/components/placeholders/EmptyBox'
import SkeletonBox from '@/components/skeletons/SkeletonBox'
import {
	defaultComplaintResolveStatusStyle,
	defaultMedicalHistoryStatusStyle,
} from '@/configs/defaultStylesConfig'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import {
	formatDateBasedOnCurrentLanguage,
	formatDatetimeStringBasedOnCurrentLanguage,
} from '@/utils/formatDateUtil'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { Vaccines } from '@mui/icons-material'
import {
	Avatar,
	Card,
	CardActionArea,
	CardContent,
	Chip,
	Grid,
	Stack,
	Typography,
} from '@mui/material'

const ManagementMedicalHistoryCardSection = ({ items, onOpen, loading }) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	if (loading) {
		return <SkeletonBox numberOfBoxes={3} heights={[150]} />
	}

	if (!items || items.length === 0) {
		return <EmptyBox />
	}

	const fields1st = [
		{
			label: t('medical_history.field.status'),
			value: (item) => (
				<Chip
					size='small'
					label={getEnumLabelByValue(_enum.medicalHistoryStatusOptions, item.medicalHistoryStatus)}
					color={defaultMedicalHistoryStatusStyle(item.medicalHistoryStatus)}
				/>
			),
		},
		{
			label: t('medical_history.field.completed_date'),
			value: (item) => (
				<Typography variant='body2'>
					{formatDatetimeStringBasedOnCurrentLanguage(item.completedDate)}
				</Typography>
			),
		},
		{
			label: t('medical_history.field.follow_up_appointment_date'),
			value: (item) => (
				<Typography variant='body2'>
					{formatDateBasedOnCurrentLanguage(item.followUpAppointmentDate)}
				</Typography>
			),
		},
	]

	const fields2nd = [
		{
			label: t('medical_history.field.number_of_services'),
			value: (item) => (
				<Stack direction='row' spacing={1} alignItems='center'>
					<Stack direction='row' spacing={0.5} alignItems='center'>
						<Vaccines fontSize='small' />
						<Typography variant='body2'>x{item.medicalHistoryDetails?.length || 0}</Typography>
					</Stack>
				</Stack>
			),
		},
		{
			label: t('medical_history.field.prescription.prescription'),
			value: (item) => {
				return (
					<Typography variant='body2'>
						{t('medical_history.field.prescription.medication_days')} (
						{item.prescription?.medicationDays ?? 'N/A'} {t('text.day')})
					</Typography>
				)
			},
		},
		{
			label: t('complaint.field.resolve_status'),
			value: (item) =>
				item.complaint ? (
					<Chip
						size='small'
						label={getEnumLabelByValue(
							_enum.complaintResolveStatusOptions,
							item.complaint.complaintResolveStatus
						)}
						color={defaultComplaintResolveStatusStyle(item.complaint.complaintResolveStatus)}
					/>
				) : (
					<Typography variant='body2'>N/A</Typography>
				),
		},
	]

	return items.map((item, index) => (
		<Card
			key={index}
			sx={{ bgcolor: 'background.lightBlue', borderRadius: 2, '&:hover': { boxShadow: 6 } }}
		>
			<CardActionArea onClick={() => onOpen(item)}>
				<CardContent>
					<Grid container spacing={2} alignItems='center'>
						<Grid size={{ xs: 12, md: 3 }}>
							<Stack spacing={2}>
								<Stack direction='row' spacing={2} alignItems='start'>
									<Avatar src={item.patient?.image} />
									<Stack>
										<Typography variant='subtitle1'>
											{t('medical_history.field.patient')}: {item.patient?.name}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											{item.patient?.gender}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											{item.patient?.dateOfBirth}
										</Typography>
									</Stack>
								</Stack>
								<Stack direction='row' spacing={2} alignItems='start'>
									<Avatar src={item.doctor?.image} />
									<Stack>
										<Typography variant='subtitle1'>
											{t('medical_history.field.doctor')}: {item.doctor?.name}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											{item.doctor?.gender}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											{item.doctor?.specialtyName}
										</Typography>
									</Stack>
								</Stack>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 9 }}>
							<Stack spacing={1}>
								<Stack direction='row' spacing={1} alignItems='center'>
									<Typography variant='subtitle2' fontWeight={600}>
										{t('medical_history.field.diagnosis')}:
									</Typography>
									<Typography variant='body2'>{item.diagnosis}</Typography>
								</Stack>
								<Grid container spacing={2}>
									<Grid size={{ xs: 12, md: 6 }}>
										<Stack spacing={1}>
											{fields1st.map((field, idx) => (
												<Stack key={idx} direction='row' spacing={1} alignItems='center'>
													<Typography variant='subtitle2' fontWeight={600}>
														{field.label}:
													</Typography>
													{typeof field.value === 'function' ? (
														field.value(item)
													) : (
														<Typography variant='body2'>{item[field.value]}</Typography>
													)}
												</Stack>
											))}
										</Stack>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<Stack spacing={1}>
											{fields2nd.map((field, idx) => (
												<Stack key={idx} direction='row' spacing={1} alignItems='center'>
													<Typography variant='subtitle2' fontWeight={600}>
														{field.label}:
													</Typography>
													{typeof field.value === 'function' ? (
														field.value(item)
													) : (
														<Typography variant='body2'>{item[field.value]}</Typography>
													)}
												</Stack>
											))}
										</Stack>
									</Grid>
								</Grid>
							</Stack>
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	))
}

export default ManagementMedicalHistoryCardSection
