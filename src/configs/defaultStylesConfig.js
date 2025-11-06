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

export const defaultAppointmentPaymentStatusStyle = (status) => {
	const map = {
		[EnumConfig.AppointmentPaymentStatus.None]: 'default',
		[EnumConfig.AppointmentPaymentStatus.Pending]: 'warning',
		[EnumConfig.AppointmentPaymentStatus.Completed]: 'success',
		[EnumConfig.AppointmentPaymentStatus.Failed]: 'error',
	}
	return map[status] || 'default'
}

export const defaultAllergySeverityStyle = (severity) => {
	const map = {
		[EnumConfig.AllergySeverity.Mild]: 'info.dark',
		[EnumConfig.AllergySeverity.Moderate]: 'warning.dark',
		[EnumConfig.AllergySeverity.Severe]: 'error.dark',
	}
	return map[severity] || 'primary'
}

export const defaultMedicalHistoryStatusStyle = (status) => {
	const map = {
		[EnumConfig.MedicalHistoryStatus.Draft]: 'warning',
		[EnumConfig.MedicalHistoryStatus.Processed]: 'info',
		[EnumConfig.MedicalHistoryStatus.Paid]: 'success',
	}
	return map[status] || 'primary'
}

export const defaultComplaintTypeStyle = (type) => {
	const map = {
		[EnumConfig.ComplaintType.Neutral]: 'info',
		[EnumConfig.ComplaintType.Positive]: 'success',
		[EnumConfig.ComplaintType.Negative]: 'error',
	}
	return map[type] || 'primary'
}

export const defaultComplaintResolveStatusStyle = (status) => {
	const map = {
		[EnumConfig.ComplaintResolveStatus.Pending]: 'warning',
		[EnumConfig.ComplaintResolveStatus.Draft]: 'info',
		[EnumConfig.ComplaintResolveStatus.Resolved]: 'success',
		[EnumConfig.ComplaintResolveStatus.Closed]: 'error',
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

export const defaultBlogTypeStyle = (theme, blogType) => {
	const map = {
		[EnumConfig.BlogType.Health]: theme.palette.success,
		[EnumConfig.BlogType.News]: theme.palette.info,
		[EnumConfig.BlogType.Promotion]: theme.palette.warning,
		[EnumConfig.BlogType.Guide]: theme.palette.secondary,
		[EnumConfig.BlogType.Other]: theme.palette.primary,
	}
	const p = map[blogType] || theme.palette.primary
	return { bg: p.softBg || p.main + '1A', border: p.softBorder || p.main + '33', color: p.main }
}

export const defaultVoucherStatusStyle = (status) => {
	const map = {
		[EnumConfig.VoucherStatus.Active]: 'success',
		[EnumConfig.VoucherStatus.Expired]: 'error',
	}
	return map[status] || 'default'
}

export const defaultVoucherTypeStyle = (type) => {
	const map = {
		[EnumConfig.VoucherType.Patient]: 'primary',
		[EnumConfig.VoucherType.Medicine]: 'secondary',
	}
	return map[type] || 'default'
}
