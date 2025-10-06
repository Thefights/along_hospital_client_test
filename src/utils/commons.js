export const getEnv = (key, defaultValue = '') => {
	return import.meta.env[key] || defaultValue
}

export const getImageFromCloud = (imagePath) => {
	const cloudUrl = getEnv('VITE_IMAGE_CLOUD_URL')
	if (!cloudUrl || !imagePath) return '/placeholder-image.png'
	return `${cloudUrl}/${imagePath}`
}
