import { defaultAppointmentStatusStyle, defaultLineClampStyle } from '@/configs/defaultStylesConfig'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { formatDateAndTimeBasedOnCurrentLanguage } from '@/utils/formatDateUtil'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'
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
							</Typography>
						</Box>
						<Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
							<Typography variant='body2' sx={{ fontWeight: 600 }}>
								{`${t('appointment.field.type')}: ${getEnumLabelByValue(
									_enum.appointmentTypeOptions,
									appointment?.appointmentType
								)}`}{' '}
								|{' '}
								{`${t('appointment.field.meeting_type')}: ${getEnumLabelByValue(
									_enum.appointmentMeetingTypeOptions,
									appointment?.appointmentMeetingType
								)}`}{' '}
								| {appointment?.specialty?.name} | {appointment?.patient?.name} |{' '}
								{appointment?.doctor?.name}{' '}
							</Typography>
							<Typography variant='body2' sx={{ color: 'text.secondary', ...defaultLineClampStyle(2) }}>
								{appointment?.purpose}
							</Typography>
						</Stack>
						<Chip
							label={getEnumLabelByValue(_enum.appointmentStatusOptions, appointment?.appointmentStatus)}
							size='small'
							sx={{ bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
						/>
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

export default ManageAppointmentListItemSection
