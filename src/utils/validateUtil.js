export const isRequired =
	(msg = 'This field is required') =>
	(v) => {
		const s = typeof v === 'string' ? v.trim() : v
		return s == null || s === '' ? msg : true
	}

export const isEmail =
	(msg = 'Please enter a valid email') =>
	(v) =>
		v == null || v === '' || /\S+@\S+\.\S+/.test(String(v)) ? true : msg

export const isNumber =
	(msg = 'Please enter a valid number') =>
	(v) => {
		if (v == null || v === '') return true
		return !Number.isNaN(Number(v)) ? true : msg
	}

export const isPasswordStrong =
	(
		msg = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
	) =>
	(v) => {
		if (v == null || v === '') return true
		const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		return strongPasswordRegex.test(v) ? true : msg
	}

export const minLen = (n, msg) => (v) =>
	String(v ?? '').length < n ? msg ?? `Must be at least ${n} characters` : true

export const maxLen = (n, msg) => (v) =>
	String(v ?? '').length > n ? msg ?? `Cannot exceed ${n} characters` : true

export const numberRange = (min, max) => (v) => {
	if (v == null || v === '') return true
	const n = Number(v)

	if (min != null && n < min) return `Minimum number is ${min}`
	if (max != null && n > max) return `Maximum number is ${max}`
	return true
}
