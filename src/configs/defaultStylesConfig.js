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
