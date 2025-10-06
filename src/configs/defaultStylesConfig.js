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
