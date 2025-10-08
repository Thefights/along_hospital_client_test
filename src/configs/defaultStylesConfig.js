import { alpha } from '@mui/material'

export const defaultScrollbarStyle = {
	'&::-webkit-scrollbar': {
		width: '8px',
	},
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.1),
		borderRadius: '4px',
	},
	'&::-webkit-scrollbar-thumb:hover': {
		backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.3),
	},
}

export const defaultStatusStyle = (theme, status) => {
	const map = {
		Scheduled: theme.palette.info,
		Confirmed: theme.palette.primary,
		Completed: theme.palette.success,
		Cancelled: theme.palette.error,
		Refused: theme.palette.warning,
	}
	const p = map[status] || theme.palette.primary
	return { bg: p.softBg || p.main + '1A', border: p.softBorder || p.main + '33', color: p.main }
}
