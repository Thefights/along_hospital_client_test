import axiosConfig from '@/configs/axiosConfig'
import { isPlainObject } from '@/utils/handleBooleanUtil'
import { getObjectConvertingToFormData } from '@/utils/handleObjectUtil'
import { appendPath, getTrimString } from '@/utils/handleStringUtil'
import { useCallback, useState } from 'react'

/**
 * @param {Object} config
 * @param {string} config.url
 * @param {'POST'|'GET'|'PUT'|'DELETE'} [config.method='POST']
 * @param {Object} [config.data={}]
 * @param {Object|string} [config.params={}]
 * @returns {{loading: boolean, error: Error|null, response: any|null, submit: function(): Promise<any>}}
 */
export function useAxiosSubmit({ url = '', method = 'POST', data = {}, params = {} }) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [response, setResponse] = useState(null)

	const submit = useCallback(async () => {
		if (loading) return Promise.resolve(null)

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
				const trimmed = getTrimString(data)
				payload = getObjectConvertingToFormData(trimmed)
			}
			const response = await axiosConfig.request({
				url: finalUrl,
				method: upper,
				params: axiosParams,
				data: payload,
			})

			setResponse(response)
			return response
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}, [loading, url, method, data, params])

	return { loading, error, response, submit }
}

// Example usage:
/* 
const postUser = useAxiosSubmit('/api/user',
 'POST',
 { name: "Name", description: 'My file' },
 { id: 123 } // or 1 // params can be object or string if string then look like /api/user/1
)
*/

// await postUser.submit()
// postUser.loading
// postUser.error
// postUser.response
