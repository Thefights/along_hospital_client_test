import axiosConfig from '@/configs/axiosConfig'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function useFetch(url, params = {}, dependencies = []) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [responseData, setResponseData] = useState(null)

	const memoParams = useMemo(() => params, [JSON.stringify(params)])

	const fetchData = useCallback(async () => {
		setLoading(true)
		try {
			const response = await axiosConfig.get(url, { params: memoParams })
			setResponseData(response.data)
		} catch (error) {
			setError(error)
		} finally {
			setLoading(false)
		}
	}, [url, memoParams, ...dependencies])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return { loading, error, responseData }
}
