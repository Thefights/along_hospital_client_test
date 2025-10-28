import GenericDrawer from '@/components/generals/GenericDrawer'
import {
	defaultAppointmentPaymentStatusStyle,
	defaultAppointmentStatusStyle,
} from '@/configs/defaultStylesConfig'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import {
	formatDateAndTimeBasedOnCurrentLanguage,
	formatDatetimeStringBasedOnCurrentLanguage,
} from '@/utils/formatDateUtil'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const ManageAppointmentDetailDrawerSection = ({ appointment, open, onClose, buttons }) => {
	const { t } = useTranslation()
	const _enum = useEnum()
	const theme = useTheme()

	const styleForStatus = appointment
		? defaultAppointmentStatusStyle(theme, appointment?.appointmentStatus)
		: {}

	const fields = !appointment
		? []
		: [
				{
					title: (
						<Stack direction='row' alignItems='center' justifyContent='space-between' spacing={1}>
							<Typography variant='subtitle1'>{t('appointment.title.appointment_info')}</Typography>
							<Chip
								label={getEnumLabelByValue(_enum.appointmentStatusOptions, appointment?.appointmentStatus)}
								size='small'
								sx={{
									bgcolor: styleForStatus.bg,
									color: styleForStatus.color,
									border: `1px solid ${styleForStatus.border}`,
								}}
							/>
						</Stack>
					),
					of: [
						{
							label: t('appointment.field.payment_status'),
							value: (
								<Chip
									label={getEnumLabelByValue(
										_enum.appointmentPaymentStatusOptions,
										appointment?.appointmentPaymentStatus
									)}
									size='small'
									color={defaultAppointmentPaymentStatusStyle(appointment?.appointmentPaymentStatus)}
								/>
							),
						},
						{
							label: t('appointment.field.type'),
							value: getEnumLabelByValue(_enum.appointmentTypeOptions, appointment?.appointmentType),
						},
						{
							label: t('appointment.field.meeting_type'),
							value: getEnumLabelByValue(
								_enum.appointmentMeetingTypeOptions,
								appointment?.appointmentMeetingType
							),
						},
						{
							label: `${t('text.date')} & ${t('text.time')}`,
							value: formatDateAndTimeBasedOnCurrentLanguage(appointment?.date, appointment?.time),
						},
						{ label: t('appointment.field.purpose'), value: appointment?.purpose },
						{ label: t('appointment.field.specialty'), value: appointment?.specialty?.name },
						{ label: t('appointment.field.doctor'), value: appointment?.doctor?.name },
					],
				},

				// Patient Info with avatar/name/email placed in the title block
				{
					title: (
						<Box>
							<Typography variant='subtitle1' sx={{ mb: 1.25 }}>
								{t('appointment.title.patient_info')}
							</Typography>
							<Stack direction='row' spacing={2} alignItems='center'>
								<Avatar src={getImageFromCloud(appointment?.patient?.image)} />
								<Stack>
									<Typography variant='body1' sx={{ fontWeight: 600 }}>
										{appointment?.patient?.name}
									</Typography>
									<Typography variant='body2' sx={{ color: 'text.secondary' }}>
										{appointment?.patient?.email}
									</Typography>
								</Stack>
							</Stack>
						</Box>
					),
					of: [
						{ label: t('profile.field.phone'), value: appointment?.patient?.phone },
						{
							label: t('profile.field.date_of_birth'),
							value: formatDateAndTimeBasedOnCurrentLanguage(appointment?.patient?.dateOfBirth),
						},
						{ label: t('profile.field.gender'), value: appointment?.patient?.gender },
						{ label: t('profile.field.address'), value: appointment?.patient?.address },
						{
							label: t('profile.field.height_weight'),
							value: `${appointment?.patient?.height || '-'} cm / ${
								appointment?.patient?.weight || '-'
							} kg`,
						},
						{ label: t('profile.field.blood_type'), value: appointment?.patient?.bloodType },
					],
				},

				// Doctor Info with avatar/name/email placed in the title block
				{
					title: (
						<Box>
							<Typography variant='subtitle1' sx={{ mb: 1.25 }}>
								{t('appointment.title.doctor_info')}
							</Typography>
							<Stack direction='row' spacing={2} alignItems='center'>
								<Avatar src={getImageFromCloud(appointment?.doctor?.image)} />
								<Stack>
									<Typography variant='body1' sx={{ fontWeight: 600 }}>
										{appointment?.doctor?.name}
									</Typography>
									<Typography variant='body2' sx={{ color: 'text.secondary' }}>
										{appointment?.doctor?.email}
									</Typography>
								</Stack>
							</Stack>
						</Box>
					),
					of: [
						{ label: t('profile.field.phone'), value: appointment?.doctor?.phone },
						{ label: t('profile.field.specialty'), value: appointment?.doctor?.specialtyName },
					],
				},

				// Timelines
				{
					title: t('appointment.title.timelines'),
					of: [
						{
							label: t('enum.appointment_status.confirmed'),
							value: appointment?.confirmedDate
								? formatDatetimeStringBasedOnCurrentLanguage(appointment?.confirmedDate)
								: '-',
						},
						{
							label: t('enum.appointment_status.completed'),
							value: appointment?.completedDate
								? formatDatetimeStringBasedOnCurrentLanguage(appointment?.completedDate)
								: '-',
						},
						{
							label: t('enum.appointment_status.cancelled'),
							value: appointment?.cancelledDate
								? formatDatetimeStringBasedOnCurrentLanguage(appointment?.cancelledDate)
								: '-',
						},
						{
							label: t('enum.appointment_status.refused'),
							value: appointment?.refusedDate
								? formatDatetimeStringBasedOnCurrentLanguage(appointment?.refusedDate)
								: '-',
						},
						{ label: t('appointment.field.cancel_reason'), value: appointment?.cancelledReason },
						{ label: t('appointment.field.refuse_reason'), value: appointment?.refusedReason },
					],
				},
		  ]

	return (
		<GenericDrawer
			open={open}
			onClose={onClose}
			title={t('appointment.title.appointment_detail')}
			fields={fields}
			buttons={buttons}
		/>
	)
}

export default ManageAppointmentDetailDrawerSection
