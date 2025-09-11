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

export const getFromDataFromObject = (obj, form = new FormData(), segments = []) => {
	const isFiley = (v) => v instanceof File || v instanceof Blob

	const buildKey = (segs) => {
		let key = ''
		for (let i = 0; i < segs.length; i++) {
			const s = segs[i]
			if (typeof s === 'number') {
				key += `[${s}]`
			} else {
				key += i === 0 ? s : `.${s}`
			}
		}
		return key
	}

	if (obj == null) {
		if (segments.length) form.append(buildKey(segments), '')
		return form
	}

	if (isFiley(obj)) {
		form.append(buildKey(segments), obj)
		return form
	}

	if (obj instanceof Date) {
		form.append(buildKey(segments), obj.toISOString())
		return form
	}

	if (Array.isArray(obj)) {
		obj.forEach((v, i) => objectToFormData(v, form, segments.concat(i)))
		return form
	}

	if (typeof obj === 'object') {
		Object.keys(obj).forEach((k) => objectToFormData(obj[k], form, segments.concat(k)))
		return form
	}

	form.append(buildKey(segments), obj)
	return form
}
