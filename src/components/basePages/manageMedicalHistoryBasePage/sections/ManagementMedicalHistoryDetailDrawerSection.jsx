import GenericDrawer from '@/components/generals/GenericDrawer'
import {
	defaultComplaintResolveStatusStyle,
	defaultMedicalHistoryStatusStyle,
} from '@/configs/defaultStylesConfig'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import {
	formatDateAndTimeBasedOnCurrentLanguage,
	formatDatetimeStringBasedOnCurrentLanguage,
} from '@/utils/formatDateUtil'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { LocalPharmacy, Print, Vaccines } from '@mui/icons-material'
import { Avatar, Box, Button, Chip, Stack, Typography } from '@mui/material'

const ManagementMedicalHistoryDetailDrawerSection = ({ open, onClose, item }) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const fields = !item
		? []
		: [
				{
					title: (
						<Stack direction='row' justifyContent='space-between' alignItems='center'>
							<Typography variant='subtitle1'>
								{t('medical_history.title.medical_history_information')}
							</Typography>
							<Chip
								size='small'
								label={getEnumLabelByValue(_enum.medicalHistoryStatusOptions, item?.medicalHistoryStatus)}
								color={defaultMedicalHistoryStatusStyle(item?.medicalHistoryStatus)}
							/>
						</Stack>
					),
					of: [
						{ label: t('medical_history.field.diagnosis'), value: item?.diagnosis },
						{
							label: t('medical_history.field.completed_date'),
							value: item?.completedDate
								? formatDatetimeStringBasedOnCurrentLanguage(item?.completedDate)
								: '-',
						},
						{
							label: t('medical_history.field.follow_up_appointment_date'),
							value: item?.followUpAppointmentDate
								? formatDateAndTimeBasedOnCurrentLanguage(item?.followUpAppointmentDate)
								: '-',
						},
						{
							label: t('medical_history.field.number_of_services'),
							value: (
								<Stack direction='row' spacing={1} alignItems='center'>
									<Vaccines fontSize='small' />
									<Typography variant='body2'>x{item?.medicalHistoryDetails?.length || 0}</Typography>
								</Stack>
							),
						},
						{
							label: t('medical_history.field.prescription.prescription'),
							value: item?.prescription ? (
								<Stack direction='row' spacing={1} alignItems='center'>
									<LocalPharmacy fontSize='small' />
									<Typography variant='body2'>
										{t('medical_history.field.prescription.medication_days')} (
										{item?.prescription?.medicationDays ?? 'N/A'} {t('text.day')})
									</Typography>
								</Stack>
							) : (
								'N/A'
							),
						},
						{
							label: t('complaint.field.resolve_status'),
							value: item?.complaint ? (
								<Chip
									size='small'
									label={getEnumLabelByValue(
										_enum.complaintResolveStatusOptions,
										item.complaint.complaintResolveStatus
									)}
									color={defaultComplaintResolveStatusStyle(item.complaint.complaintResolveStatus)}
								/>
							) : (
								'N/A'
							),
						},
					],
				},
				{
					title: (
						<Box>
							<Typography variant='subtitle1' sx={{ mb: 1.25 }}>
								{t('appointment.title.patient_info')}
							</Typography>
							<Stack direction='row' spacing={2} alignItems='center'>
								<Avatar src={getImageFromCloud(item?.patient?.image)} />
								<Stack>
									<Typography variant='body1' sx={{ fontWeight: 600 }}>
										{item?.patient?.name}
									</Typography>
									<Typography variant='body2' sx={{ color: 'text.secondary' }}>
										{item?.patient?.email}
									</Typography>
								</Stack>
							</Stack>
						</Box>
					),
					of: [
						{ label: t('profile.field.phone'), value: item?.patient?.phone },
						{
							label: t('profile.field.date_of_birth'),
							value: formatDateAndTimeBasedOnCurrentLanguage(item?.patient?.dateOfBirth),
						},
						{ label: t('profile.field.gender'), value: item?.patient?.gender },
						{ label: t('profile.field.address'), value: item?.patient?.address },
						{
							label: t('profile.field.height_weight'),
							value: `${item?.patient?.height || '-'} cm / ${item?.patient?.weight || '-'} kg`,
						},
						{ label: t('profile.field.blood_type'), value: item?.patient?.bloodType },
					],
				},
				{
					title: (
						<Box>
							<Typography variant='subtitle1' sx={{ mb: 1.25 }}>
								{t('appointment.title.doctor_info')}
							</Typography>
							<Stack direction='row' spacing={2} alignItems='center'>
								<Avatar src={getImageFromCloud(item?.doctor?.image)} />
								<Stack>
									<Typography variant='body1' sx={{ fontWeight: 600 }}>
										{item?.doctor?.name}
									</Typography>
									<Typography variant='body2' sx={{ color: 'text.secondary' }}>
										{item?.doctor?.email}
									</Typography>
								</Stack>
							</Stack>
						</Box>
					),
					of: [
						{ label: t('profile.field.phone'), value: item?.doctor?.phone },
						{
							label: t('profile.field.specialty'),
							value: item?.doctor?.specialtyName || item?.doctor?.specialty,
						},
					],
				},
		  ]

	const buttons = (
		<Stack direction='row' spacing={2}>
			<Button variant='contained' color='primary' fullWidth>
				{t('medical_history.button.view_full_detail')}
			</Button>
			<Button variant='outlined' startIcon={<Print />} fullWidth>
				{t('medical_history.button.print_invoice')}
			</Button>
		</Stack>
	)

	return (
		<GenericDrawer
			open={open}
			onClose={onClose}
			title={t('medical_history.title.medical_history_detail')}
			fields={fields}
			buttons={buttons}
		/>
	)
}

export default ManagementMedicalHistoryDetailDrawerSection
