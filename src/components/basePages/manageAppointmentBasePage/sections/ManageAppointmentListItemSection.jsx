import {
	defaultAppointmentPaymentStatusStyle,
	defaultAppointmentStatusStyle,
	defaultLineClampStyle,
} from '@/configs/defaultStylesConfig'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { formatDateAndTimeBasedOnCurrentLanguage } from '@/utils/formatDateUtil'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	Chip,
	Divider,
	Stack,
	Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Fragment } from 'react'

const ManageAppointmentListItemSection = ({ appointment, onClick }) => {
	const theme = useTheme()
	const { t } = useTranslation()
	const _enum = useEnum()
	const s = defaultAppointmentStatusStyle(theme, appointment?.appointmentStatus)

	return (
		<Card
			variant='outlined'
			sx={{
				bgcolor: 'background.paper',
				borderColor: 'divider',
				'&:hover': { borderColor: 'primary.light' },
			}}
		>
			<CardActionArea onClick={onClick}>
				<CardContent>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Box sx={{ minWidth: 90 }}>
							<Typography variant='subtitle2'>
								{formatDateAndTimeBasedOnCurrentLanguage(appointment?.date, appointment?.time)
									.split(' ')
									.map((x, i) => (
										<Fragment key={i}>
											{x}
											<br />
										</Fragment>
									))}
								{t('appointment.field.time_slot')}:{' '}
								{getEnumLabelByValue(_enum.appointmentTimeSlotOptions, appointment?.timeSlot)}
							</Typography>
						</Box>
						<Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								gap={{ xs: 0.2, md: 1 }}
								flexWrap={'wrap'}
								divider={
									<Divider orientation='vertical' variant='middle' flexItem sx={{ borderRightWidth: 2 }} />
								}
							>
								{[
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
										label: t('appointment.field.specialty'),
										value: appointment?.specialty?.name,
									},
									{
										label: t('appointment.field.patient'),
										value: appointment?.patient?.name,
									},
									{
										label: t('appointment.field.doctor'),
										value: appointment?.doctor?.name ?? '-',
									},
								].map((item, index) => (
									<Typography variant='body2' key={appointment?.id + index}>
										{item.label}: {item.value}
									</Typography>
								))}
							</Stack>
							<Typography variant='body2' sx={{ color: 'text.secondary', ...defaultLineClampStyle(2) }}>
								{appointment?.purpose}
							</Typography>
						</Stack>
						<Stack spacing={1} alignItems='end'>
							<Stack direction={'row'}>
								<Typography variant='subtitle2' sx={{ mr: 1 }}>
									{t('appointment.field.payment_status')}:
								</Typography>
								<Chip
									label={getEnumLabelByValue(
										_enum.appointmentPaymentStatusOptions,
										appointment?.appointmentPaymentStatus
									)}
									size='small'
									color={defaultAppointmentPaymentStatusStyle(appointment?.appointmentPaymentStatus)}
								/>
							</Stack>
							<Stack direction={'row'}>
								<Typography variant='subtitle2' sx={{ mr: 1 }}>
									{t('appointment.field.status')}:
								</Typography>
								<Chip
									label={getEnumLabelByValue(_enum.appointmentStatusOptions, appointment?.appointmentStatus)}
									size='small'
									sx={{ bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
								/>
							</Stack>
						</Stack>
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

export default ManageAppointmentListItemSection
