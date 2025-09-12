export const getObjectValueFromStringPath = (object, path) => {
	if (!object || typeof object !== 'object' || !path) return undefined
	return path
		.split('.')
		.reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), object)
}

export const getObjectConvertingToFormData = (obj, form = new FormData(), segments = []) => {
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
		obj.forEach((v, i) => getObjectConvertingToFormData(v, form, segments.concat(i)))
		return form
	}

	if (typeof obj === 'object') {
		Object.keys(obj).forEach((k) => getObjectConvertingToFormData(obj[k], form, segments.concat(k)))
		return form
	}

	form.append(buildKey(segments), obj)
	return form
}
