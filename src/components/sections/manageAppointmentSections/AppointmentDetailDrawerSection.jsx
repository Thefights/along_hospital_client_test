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
					<Typography variant='h6'>{t('appointment.title.appointment_detail')}</Typography>
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
									<Typography variant='subtitle1'>{t('appointment.title.appointment_info')}</Typography>
									<Chip
										label={appointment?.appointmentStatus}
										size='small'
										sx={{ bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
									/>
								</Stack>
								<Divider sx={{ my: 1.5 }} />
								<Stack spacing={1}>
									<InfoRow
										label={`${t('text.date')} & ${t('text.time')}`}
										value={formatDatetime(datetimeString)}
									/>
									<InfoRow label={t('appointment.field.purpose')} value={appointment?.purpose} />
									<InfoRow label={t('appointment.field.specialty')} value={appointment?.specialty?.name} />
									<InfoRow label={t('appointment.field.doctor')} value={appointment?.doctor?.name} />
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
								<Typography variant='subtitle1'>{t('appointment.title.patient_info')}</Typography>
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
									<InfoRow label={t('profile.field.phone')} value={appointment?.patient?.phone} />
									<InfoRow
										label={t('profile.field.date_of_birth')}
										value={formatDate(appointment?.patient?.dateOfBirth)}
									/>
									<InfoRow label={t('profile.field.gender')} value={appointment?.patient?.gender} />
									<InfoRow label={t('profile.field.address')} value={appointment?.patient?.address} />
									<InfoRow
										label={t('profile.field.height_weight')}
										value={`${appointment?.patient?.height || '-'} cm / ${
											appointment?.patient?.weight || '-'
										} kg`}
									/>
									<InfoRow label={t('profile.field.blood_type')} value={appointment?.patient?.bloodType} />
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
								<Typography variant='subtitle1'>{t('appointment.title.doctor_info')}</Typography>
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
									<InfoRow label={t('profile.field.phone')} value={appointment?.doctor?.phone} />
									<InfoRow label={t('profile.field.specialty')} value={appointment?.specialty?.name} />
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
								<Typography variant='subtitle1'>{t('appointment.title.timelines')}</Typography>
								<Divider sx={{ my: 1.5 }} />
								<Stack spacing={1}>
									<InfoRow
										label={t('appointment.status.confirmed')}
										value={appointment?.confirmedDate ? formatDatetime(appointment?.confirmedDate) : '-'}
									/>
									<InfoRow
										label={t('appointment.status.completed')}
										value={appointment?.completedDate ? formatDatetime(appointment?.completedDate) : '-'}
									/>
									<InfoRow
										label={t('appointment.status.cancelled')}
										value={appointment?.cancelledDate ? formatDatetime(appointment?.cancelledDate) : '-'}
									/>
									<InfoRow
										label={t('appointment.status.refused')}
										value={appointment?.refusedDate ? formatDatetime(appointment?.refusedDate) : '-'}
									/>
									{appointment?.cancelledReason && (
										<InfoRow
											label={t('appointment.field.cancel_reason')}
											value={appointment?.cancelledReason}
										/>
									)}
									{appointment?.refusedReason && (
										<InfoRow
											label={t('appointment.field.refuse_reason')}
											value={appointment?.refusedReason}
										/>
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
