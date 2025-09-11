// useAxiosSubmit.js
import axiosConfig from '@/axiosConfig'
import { trimStringsDeep } from '@/utils/formatStringUtil'
import { getFromDataFromObject } from '@/utils/handleObjectUtil'
import { useCallback, useState } from 'react'

const appendPath = (baseUrl, tail) => {
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

export function useAxiosSubmit(url = '', method = 'POST', data = {}, params = {}) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [response, setResponse] = useState(null)

	const submit = useCallback(async () => {
		setLoading(true)
		setError(null)
		setResponse(null)

		try {
			const upper = String(method).toUpperCase()
			const queryOnly = upper === 'GET' || upper === 'DELETE'

			const isObjParams = isPlainObject(params)
			const finalUrl = isObjParams ? url : appendPath(url, params)
			const axiosParams = isObjParams ? params : undefined

			let payload = undefined
			if (!queryOnly) {
				const trimmed = trimStringsDeep(data)
				payload = getFromDataFromObject(trimmed)
			}

			const res = await axiosConfig.request({
				url: finalUrl,
				method: upper,
				params: axiosParams,
				data: payload,
			})

			setResponse(res)
			return res
		} catch (err) {
			setError(err)
			throw err
		} finally {
			setLoading(false)
		}
	}, [url, method, params, data])

	return { loading, error, response, submit }
}

// Example usage:

// const postUser = useAxiosSubmit('/api/user',
// 'POST',
// { id: 123 },
// { name: "Name", description: 'My file' })
// postUser.submit()
// postUser.loading
// postUser.error
// postUser.response
