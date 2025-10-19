import { getTranslation } from '@/hooks/useTranslation'

export const isRequired =
	(msg = getTranslation('error.required')) =>
	(v) => {
		const s = typeof v === 'string' ? v.trim() : v
		return s == null || s === '' ? msg : true
	}

export const isEmail =
	(msg = getTranslation('error.invalid_email')) =>
	(v) =>
		v == null || v === '' || /\S+@\S+\.\S+/.test(String(v)) ? true : msg

export const isNumber =
	(msg = getTranslation('error.invalid_number')) =>
	(v) => {
		if (v == null || v === '') return true
		return !Number.isNaN(Number(v)) ? true : msg
	}

export const isPasswordStrong =
	(msg = getTranslation('error.weak_password')) =>
	(v) => {
		if (v == null || v === '') return true
		const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		return strongPasswordRegex.test(v) ? true : msg
	}

export const minLen = (n, msg) => (v) =>
	String(v ?? '').length < n
		? msg ?? getTranslation('error.min_length', { min: n, current: String(v ?? '').length })
		: true

export const maxLen = (n, msg) => (v) =>
	String(v ?? '').length > n
		? msg ?? getTranslation('error.max_length', { max: n, current: String(v ?? '').length })
		: true

export const numberRange = (min, max) => (v) => {
	if (v == null || v === '') return true
	const n = Number(v)

	if (min != null && n < min) return getTranslation('error.min_number', { min })
	if (max != null && n > max) return getTranslation('error.max_number', { max })
	return true
}

export const numberHigherThan = (min) => (v) => {
	if (v == null || v === '') return true
	const n = Number(v)
	return n > min ? true : getTranslation('error.min_number', { min })
}

export const numberLessThan = (max) => (v) => {
	if (v == null || v === '') return true
	const n = Number(v)
	return n < max ? true : getTranslation('error.max_number', { max })
}
