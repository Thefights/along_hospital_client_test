import axiosConfig from '@/axiosConfig'
import useAsync from './useAsync'

export default function useFetch(url, data = {}, dependencies = []) {
	return useAsync(() => {
		return axiosConfig.get(url, { params: data }).then((res) => res.data)
	}, dependencies)
}
