export const getStringCapitalized = (string) => {
	return string
		.trim()
		.toLowerCase()
		.split(/[\s_]+/)
		.map((str) => str.replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase()))
		.join(' ')
}

export const getObjectWithTrimmedStringValue = (object) => {
	if (!object || typeof object !== 'object') return object

	return Object.fromEntries(
		Object.entries(object).map(([key, value]) => [
			key,
			typeof value === 'string' ? value.trim() : value,
		])
	)
}

export const getValueInObjectFromPath = (object, path) => {
	if (!object || typeof object !== 'object' || !path) return undefined
	return path
		.split('.')
		.reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), object)
}
