/* eslint-disable no-unused-vars */
import { defaultAppointmentStatusStyle } from '@/configs/defaultStylesConfig'
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

const ManageAppointmentDetailDrawerSection = ({ appointment, open, onClose, buttons }) => {
	const { t, language } = useTranslation()
	const theme = useTheme()
	const s = appointment ? defaultAppointmentStatusStyle(theme, appointment?.appointmentStatus) : {}
	const datetimeString = appointment ? `${appointment?.date}T${appointment?.time}` : null

	const formatDatetime = (datetimeString) => {
		return language === 'en'
			? formatDatetimeToMMDDYYYY(datetimeString)
			: formatDatetimeToDDMMYYYY(datetimeString)
	}

	const formatDate = (dateString) => {
		return language === 'en' ? formatDateToMMDDYYYY(dateString) : formatDateToDDMMYYYY(dateString)
	}

	const appointmentInfoRows = [
		{ label: `${t('text.date')} & ${t('text.time')}`, value: formatDatetime(datetimeString) },
		{ label: t('appointment.field.purpose'), value: appointment?.purpose },
		{ label: t('appointment.field.specialty'), value: appointment?.specialty?.name },
		{ label: t('appointment.field.doctor'), value: appointment?.doctor?.name },
	]

	const patientInfoRows = [
		{ label: t('profile.field.phone'), value: appointment?.patient?.phone },
		{ label: t('profile.field.date_of_birth'), value: formatDate(appointment?.patient?.dateOfBirth) },
		{ label: t('profile.field.gender'), value: appointment?.patient?.gender },
		{ label: t('profile.field.address'), value: appointment?.patient?.address },
		{
			label: t('profile.field.height_weight'),
			value: `${appointment?.patient?.height || '-'} cm / ${appointment?.patient?.weight || '-'} kg`,
		},
		{ label: t('profile.field.blood_type'), value: appointment?.patient?.bloodType },
	]

	const doctorInfoRows = [
		{ label: t('profile.field.phone'), value: appointment?.doctor?.phone },
		{ label: t('profile.field.specialty'), value: appointment?.specialty?.name },
	]

	const appointmentTimelinesRows = [
		{
			label: t('appointment.status.confirmed'),
			value: appointment?.confirmedDate ? formatDatetime(appointment?.confirmedDate) : '-',
		},
		{
			label: t('appointment.status.completed'),
			value: appointment?.completedDate ? formatDatetime(appointment?.completedDate) : '-',
		},
		{
			label: t('appointment.status.cancelled'),
			value: appointment?.cancelledDate ? formatDatetime(appointment?.cancelledDate) : '-',
		},
		{
			label: t('appointment.status.refused'),
			value: appointment?.refusedDate ? formatDatetime(appointment?.refusedDate) : '-',
		},
		{ label: t('appointment.field.cancel_reason'), value: appointment?.cancelledReason },
		{ label: t('appointment.field.refuse_reason'), value: appointment?.refusedReason },
	]

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
									{appointmentInfoRows.map((row, index) => (
										<InfoRow key={index} label={row.label} value={row.value} />
									))}
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
									{patientInfoRows.map((row, index) => (
										<InfoRow key={index} label={row.label} value={row.value} />
									))}
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
									{doctorInfoRows.map((row, index) => (
										<InfoRow key={index} label={row.label} value={row.value} />
									))}
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
									{appointmentTimelinesRows.map((row, index) => (
										<InfoRow key={index} label={row.label} value={row.value} />
									))}
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

const InfoRow = ({ label, value }) => (
	<Stack direction='row' justifyContent='space-between' alignItems='start'>
		<Typography variant='body2' sx={{ color: 'text.secondary' }}>
			{label}
		</Typography>
		<Typography variant='body2' sx={{ ml: 2, textAlign: 'right' }}>
			{value || '-'}
		</Typography>
	</Stack>
)

export default ManageAppointmentDetailDrawerSection
