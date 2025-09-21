import { getEnv } from '@/utils/commons'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { toast } from 'react-toastify'

const axiosConfig = axios.create({
	baseURL: getEnv('VITE_BASE_API_URL', 'https://localhost:8080'),
	headers: {
		'Content-Type': 'multipart/form-data',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'X-Requested-With',
	},
})

axiosConfig.interceptors.request.use(
	(request) => {
		const auth = secureLocalStorage.getItem('auth')
		if (auth && auth.token) {
			request.headers.Authorization = `Bearer ${auth.token}`
		}
		return request
	},
	(error) => Promise.reject(error)
)

axiosConfig.interceptors.response.use(
	(response) => {
		switch (response.status) {
			case 201:
			case 204:
				toast.success(response.data.message || 'Success')
				break
		}

		return response.data
	},
	(error) => {
		const { status, response } = error

		let errorMessages = response?.data?.error
		if (errorMessages && !Array.isArray(errorMessages)) {
			errorMessages = [errorMessages]
		}

		switch (status) {
			case 400:
			case 401:
			case 403:
			case 404:
			case 409:
			case 422:
				errorMessages?.forEach((msg) => toast.error(msg))
				break
			case 500:
			default:
				toast.error('Occurred a server error, please try again later')
				break
		}
		return Promise.reject(error)
	}
)

export default axiosConfig
