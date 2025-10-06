import { alpha } from '@mui/material'

export const getEnv = (key, defaultValue = '') => {
	return import.meta.env[key] || defaultValue
}

export const getImageFromCloud = (imagePath) => {
	const cloudUrl = getEnv('VITE_IMAGE_CLOUD_URL')
	if (!cloudUrl || !imagePath) return '/placeholder-image.png'
	return `${cloudUrl}/${imagePath}`
}

export const defaultScrollbarConfig = {
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
