import { defaultStatusStyle } from '@/configs/defaultStylesConfig'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import {
	formatDatetimeToDDMMYYYY,
	formatDatetimeToMMDDYYYY,
	formatDateToDDMMYYYY,
	formatDateToMMDDYYYY,
} from '@/utils/formatDateUtil'
import CloseIcon from '@mui/icons-material/Close'
import { Avatar, Box, Chip, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import InfoRow from './AppointmentInfoRow'

function AppointmentDetailDrawer({ appointment, open, onClose, buttons }) {
	const { t, language } = useTranslation()
	const theme = useTheme()
	const s = appointment ? defaultStatusStyle(theme, appointment?.appointmentStatus) : {}
	const datetimeString = appointment ? `${appointment?.date}T${appointment?.time}` : null

	const formatDatetime = (datetimeString) => {
		return language === 'en'
			? formatDatetimeToMMDDYYYY(datetimeString)
			: formatDatetimeToDDMMYYYY(datetimeString)
	}

	const formatDate = (dateString) => {
		return language === 'en' ? formatDateToMMDDYYYY(dateString) : formatDateToDDMMYYYY(dateString)
	}

	return (
		<Drawer
			anchor='right'
			open={open}
			onClose={onClose}
			slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420, md: 480, lg: 520 } } } }}
		>
			<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
				<Box
					sx={{
						p: 2,
						borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Typography variant='h6'>Appointment Detail</Typography>
					<IconButton onClick={onClose} size='small'>
						<CloseIcon />
					</IconButton>
				</Box>
				<Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
					{appointment && (
						<Stack spacing={2}>
							<Box
								sx={{
									p: 2,
									border: (theme) => `1px solid ${theme.palette.divider}`,
									borderRadius: 1,
									bgcolor: 'background.paper',
								}}
							>
								<Stack direction='row' justifyContent='space-between' alignItems='center'>
									<Typography variant='subtitle1'>Appointment Info</Typography>
									<Chip
										label={appointment?.appointmentStatus}
										size='small'
										sx={{ bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
									/>
								</Stack>
								<Divider sx={{ my: 1.5 }} />
								<Stack spacing={1}>
									<InfoRow label='Date & Time' value={formatDatetime(datetimeString)} />
									<InfoRow label='Purpose' value={appointment?.purpose} />
									<InfoRow label='Specialty' value={appointment?.specialty?.name} />
									<InfoRow label='Doctor' value={appointment?.doctor?.name} />
								</Stack>
							</Box>

							<Box
								sx={{
									p: 2,
									border: (theme) => `1px solid ${theme.palette.divider}`,
									borderRadius: 1,
									bgcolor: 'background.paper',
								}}
							>
								<Typography variant='subtitle1'>Patient Info</Typography>
								<Divider sx={{ my: 1.5 }} />
								<Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 1 }}>
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
								<Stack spacing={1}>
									<InfoRow label='Phone' value={appointment?.patient?.phone} />
									<InfoRow label='DOB' value={formatDate(appointment?.patient?.dateOfBirth)} />
									<InfoRow label='Gender' value={appointment?.patient?.gender} />
									<InfoRow label='Address' value={appointment?.patient?.address} />
									<InfoRow
										label='Height/Weight'
										value={`${appointment?.patient?.height || '-'} cm / ${
											appointment?.patient?.weight || '-'
										} kg`}
									/>
									<InfoRow label='Blood Type' value={appointment?.patient?.bloodType} />
								</Stack>
							</Box>

							<Box
								sx={{
									p: 2,
									border: (theme) => `1px solid ${theme.palette.divider}`,
									borderRadius: 1,
									bgcolor: 'background.paper',
								}}
							>
								<Typography variant='subtitle1'>Doctor Info</Typography>
								<Divider sx={{ my: 1.5 }} />
								<Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 1 }}>
									<Avatar src={appointment?.doctor?.image} />
									<Stack>
										<Typography variant='body1' sx={{ fontWeight: 600 }}>
											{appointment?.doctor?.name}
										</Typography>
										<Typography variant='body2' sx={{ color: 'text.secondary' }}>
											{appointment?.doctor?.email}
										</Typography>
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<InfoRow label='Phone' value={appointment?.doctor?.phone} />
									<InfoRow label='Specialty' value={appointment?.specialty?.name} />
								</Stack>
							</Box>

							<Box
								sx={{
									p: 2,
									border: (theme) => `1px solid ${theme.palette.divider}`,
									borderRadius: 1,
									bgcolor: 'background.paper',
								}}
							>
								<Typography variant='subtitle1'>Timeline</Typography>
								<Divider sx={{ my: 1.5 }} />
								<Stack spacing={1}>
									<InfoRow
										label='Confirmed'
										value={appointment?.confirmedDate ? formatDatetime(appointment?.confirmedDate) : '-'}
									/>
									<InfoRow
										label='Completed'
										value={appointment?.completedDate ? formatDatetime(appointment?.completedDate) : '-'}
									/>
									<InfoRow
										label='Cancelled'
										value={appointment?.cancelledDate ? formatDatetime(appointment?.cancelledDate) : '-'}
									/>
									<InfoRow
										label='Refused'
										value={appointment?.refusedDate ? formatDatetime(appointment?.refusedDate) : '-'}
									/>
									{appointment?.cancelledReason && (
										<InfoRow label='Cancel Reason' value={appointment?.cancelledReason} />
									)}
									{appointment?.refusedReason && (
										<InfoRow label='Refuse Reason' value={appointment?.refusedReason} />
									)}
								</Stack>
							</Box>
						</Stack>
					)}
				</Box>
				<Box
					sx={{
						position: 'sticky',
						bottom: 0,
						bgcolor: 'background.paper',
						borderTop: (theme) => `1px solid ${theme.palette.divider}`,
						p: 2,
					}}
				>
					{buttons}
				</Box>
			</Box>
		</Drawer>
	)
}

export default AppointmentDetailDrawer
