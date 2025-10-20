export const defaultAppointmentStatusStyle = (theme, status) => {
	const map = {
		scheduled: theme.palette.info,
		confirmed: theme.palette.primary,
		completed: theme.palette.success,
		cancelled: theme.palette.error,
		refused: theme.palette.warning,
	}
	const p = map[status] || theme.palette.primary
	return { bg: p.softBg || p.main + '1A', border: p.softBorder || p.main + '33', color: p.main }
}

export const defaultMedicalHistoryStatusStyle = (status) => {
	const map = {
		draft: 'warning',
		processed: 'info',
		paid: 'success',
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
