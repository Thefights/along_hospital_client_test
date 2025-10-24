import { defaultAppointmentStatusStyle, defaultLineClampStyle } from '@/configs/defaultStylesConfig'
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
							</Typography>
						</Box>
						<Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={{ xs: 0.2, md: 1 }}
								flexWrap={'wrap'}
								divider={
									<Divider orientation='vertical' variant='middle' flexItem sx={{ borderRightWidth: 2 }} />
								}
							>
								{[
									{
										text: `${t('appointment.field.type')}: ${getEnumLabelByValue(
											_enum.appointmentTypeOptions,
											appointment?.appointmentType
										)}`,
									},
									{
										text: `${t('appointment.field.meeting_type')}: ${getEnumLabelByValue(
											_enum.appointmentMeetingTypeOptions,
											appointment?.appointmentMeetingType
										)}`,
									},
									{
										text: `${t('appointment.field.specialty')}: ${appointment?.specialty?.name}`,
									},
									{
										text: `${t('appointment.field.patient')}: ${appointment?.patient?.name}`,
									},
									{
										text: `${t('appointment.field.doctor')}: ${appointment?.doctor?.name}`,
									},
								].map((item, index) => (
									<Typography variant='body2' key={appointment?.id + index}>
										{item.text}
									</Typography>
								))}
							</Stack>
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
