import axiosConfig from '@/configs/axiosConfig'
import { getObjectConvertingToFormData } from '@/utils/handleObjectUtil'
import { getTrimString } from '@/utils/handleStringUtil'
import { useCallback, useState } from 'react'

/**
 * @param {Object} config
 * @param {string} config.url
 * @param {'POST'|'GET'|'PUT'|'DELETE'} [config.method='POST']
 * @param {Object} [config.data={}]
 * @param {Object|string} [config.params={}]
 * @returns {{loading: boolean, error: Error|null, response: any|null, submit: function(overrideValues): Promise<any>}}
 */
export function useAxiosSubmit({
	url = '',
	method = 'POST',
	data = {},
	params = {},
	onSuccess = async (response) => Promise.resolve(response),
	onError = async (error) => Promise.resolve(error),
}) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [response, setResponse] = useState(null)

	const submit = useCallback(
		async (overrideValues) => {
			if (loading) return Promise.resolve(null)

			setLoading(true)
			setError(null)
			setResponse(null)

			const upper = String(method).toUpperCase()
			const queryOnly = upper === 'GET' || upper === 'DELETE'
			const bodySource = overrideValues !== undefined ? overrideValues : data

			try {
				let payload = undefined
				if (!queryOnly) {
					if (bodySource instanceof FormData) {
						payload = bodySource
					} else {
						const trimmed = getTrimString(bodySource)
						payload = getObjectConvertingToFormData(trimmed)
					}
				}
				const response = await axiosConfig.request({
					url,
					method: upper,
					params,
					data: payload,
				})

				setResponse(response)
				await onSuccess(response)
				return response
			} catch (err) {
				setError(err)
				await onError(err)
				return undefined
			} finally {
				setLoading(false)
			}
		},
		[loading, url, method, data, params]
	)

	return { loading, error, response, submit }
}

// Example usage:
/* 
const postUser = useAxiosSubmit('/api/user/{selectedUser?.id}',
 'POST',
 { name: "Name", description: 'My file' },
)
*/

// await postUser.submit()
// postUser.loading
// postUser.error
// postUser.response
