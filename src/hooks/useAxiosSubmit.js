// useAxiosSubmit.js
import axiosConfig from '@/utils/axiosConfig'
import { isPlainObject } from '@/utils/handleBooleanUtil'
import { getObjectConvertingToFormData } from '@/utils/handleObjectUtil'
import { appendPath, getTrimString } from '@/utils/handleStringUtil'
import { useCallback, useState } from 'react'

export function useAxiosSubmit(url = '', method = 'POST', data = {}, params = {}) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [data, setData] = useState(null)

	const submit = useCallback(async () => {
		console.log(data)
		setLoading(true)
		setError(null)
		setData(null)
		try {
			const upper = String(method).toUpperCase()
			const queryOnly = upper === 'GET' || upper === 'DELETE'

			const isObjParams = isPlainObject(params)
			const finalUrl = isObjParams ? url : appendPath(url, params)
			const axiosParams = isObjParams ? params : undefined

			let payload = undefined
			if (!queryOnly) {
				const trimmed = getTrimString(data)
				payload = getObjectConvertingToFormData(trimmed)
			}

			const response = await axiosConfig.request({
				url: finalUrl,
				method: upper,
				params: axiosParams,
				data: payload,
			})

			setData(response.data)
			return response
		} catch (err) {
			setError(err)
			throw err
		} finally {
			setLoading(false)
		}
	}, [url, method, params, data])

	return { loading, error, data, submit }
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
