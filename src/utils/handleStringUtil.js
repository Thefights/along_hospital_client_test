export const getStringCapitalized = (string) => {
	return string
		.trim()
		.toLowerCase()
		.split(/[\s_]+/)
		.map((str) => str.replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase()))
		.join(' ')
}

export const trimStringsDeep = (input) => {
	if (typeof input === 'string') return input.trim()
	if (Array.isArray(input)) return input.map(trimStringsDeep)
	if (input && typeof input === 'object') {
		if (input instanceof File || input instanceof Blob || input instanceof Date) return input
		const out = {}
		for (const k of Object.keys(input)) out[k] = trimStringsDeep(input[k])
		return out
	}
	return input
}

export const appendPath = (baseUrl, tail) => {
	if (tail == null || tail === '') return baseUrl
	const parts = Array.isArray(tail) ? tail : [tail]
	const cleaned = parts
		.map((p) => String(p).replace(/^\/+|\/+$/g, ''))
		.filter(Boolean)
		.map(encodeURIComponent)

	const [base, query = ''] = String(baseUrl).split('?')
	const url = [base.replace(/\/+$/, ''), ...cleaned].join('/')
	return query ? `${url}?${query}` : url
}
