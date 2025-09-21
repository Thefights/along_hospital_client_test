import axiosConfig from '@/configs/axiosConfig'
import { isPlainObject } from '@/utils/handleBooleanUtil'
import { appendPath } from '@/utils/handleStringUtil'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function useFetch(url, params = {}, dependencies = [], fetchOnMount = true) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [data, setData] = useState(null)

	const memoParams = useMemo(() => params, [JSON.stringify(params)])

	const fetchData = useCallback(async () => {
		const controller = new AbortController()
		const currentReqId = Date.now()
		fetchData.reqId = currentReqId

		setLoading(true)

		const isObjParams = isPlainObject(memoParams)
		const finalUrl = isObjParams ? url : appendPath(url, memoParams)
		const axiosParams = isObjParams ? memoParams : undefined

		try {
			const response = await axiosConfig.get(finalUrl, {
				params: axiosParams,
				signal: controller.signal,
			})

			if (fetchData.reqId === currentReqId) {
				setData(response.data)
			}
		} catch (error) {
			if (error.name !== 'CanceledError' && fetchData.reqId === currentReqId) {
				setError(error)
			}
		} finally {
			if (fetchData.reqId === currentReqId) {
				setLoading(false)
			}
		}
	}, [url, memoParams, ...dependencies])

	useEffect(() => {
		if (fetchOnMount) fetchData()
	}, [fetchData, fetchOnMount])

	return { loading, error, data, fetch: fetchData }
}
