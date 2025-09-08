import axiosConfig from '@/axiosConfig'
import useAsync from './useAsync'

export default function useFetch(
	url,
	data = {},
	method = 'GET',
	fetchOnMount = true,
	dependencies = []
) {
	const firstRenderRef = useRef(true)

	return useAsync(() => {
		if (!fetchOnMount && firstRenderRef.current) {
			firstRenderRef.current = false
			return Promise.resolve(undefined)
		}
		return axiosConfig({ url, method, [method === 'GET' ? 'params' : 'data']: data })
	}, dependencies)
}
