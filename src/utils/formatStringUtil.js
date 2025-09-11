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
