import { EnumConfig } from './enumConfig'

export const defaultAppointmentStatusStyle = (theme, status) => {
	const map = {
		[EnumConfig.AppointmentStatus.Scheduled]: theme.palette.info,
		[EnumConfig.AppointmentStatus.Confirmed]: theme.palette.primary,
		[EnumConfig.AppointmentStatus.Completed]: theme.palette.success,
		[EnumConfig.AppointmentStatus.Cancelled]: theme.palette.error,
		[EnumConfig.AppointmentStatus.Refused]: theme.palette.warning,
	}
	const p = map[status] || theme.palette.primary
	return { bg: p.softBg || p.main + '1A', border: p.softBorder || p.main + '33', color: p.main }
}

export const defaultMedicalHistoryStatusStyle = (status) => {
	const map = {
		[EnumConfig.MedicalHistoryStatus.Draft]: 'warning',
		[EnumConfig.MedicalHistoryStatus.Processed]: 'info',
		[EnumConfig.MedicalHistoryStatus.Paid]: 'success',
	}
	return map[status] || 'primary'
}

export const defaultLineClampStyle = (lines = 2) => ({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	width: '100%',
	display: '-webkit-box',
	WebkitLineClamp: lines,
	lineClamp: lines,
	WordBreak: 'break-word',
	WebkitBoxOrient: 'vertical',
})
