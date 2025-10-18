import { defaultAppointmentStatusStyle } from '@/configs/defaultStylesConfig'
import useTranslation from '@/hooks/useTranslation'
import { formatDatetimeToDDMMYYYY, formatDatetimeToMMDDYYYY } from '@/utils/formatDateUtil'
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const AppointmentListItem = ({ appointment, onClick }) => {
	const { language } = useTranslation()
	const theme = useTheme()
	const s = defaultAppointmentStatusStyle(theme, appointment?.appointmentStatus)
	const dateString = appointment ? `${appointment?.date}T${appointment?.time}` : null
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
								{language === 'en'
									? formatDatetimeToMMDDYYYY(dateString)
									: formatDatetimeToDDMMYYYY(dateString)}
							</Typography>
						</Box>
						<Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
							<Typography variant='body2' sx={{ fontWeight: 600 }}>
								{appointment?.specialty?.name} • {appointment?.doctor?.name}
							</Typography>
							<Typography variant='body2' noWrap sx={{ color: 'text.secondary' }}>
								{appointment?.purpose}
							</Typography>
						</Stack>
						<Chip
							label={appointment?.appointmentStatus}
							size='small'
							sx={{ bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
						/>
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

export default AppointmentListItem
