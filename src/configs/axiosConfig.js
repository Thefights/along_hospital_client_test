import { getEnv } from '@/utils/commons'
import axios from 'axios'
import { toast } from 'react-toastify'

const axiosConfig = axios.create({
	baseURL: getEnv('VITE_BASE_API_URL', 'https://localhost:5000/api/v1'),
	headers: {
		'Content-Type': 'multipart/form-data',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'X-Requested-With',
	},
})

axiosConfig.interceptors.request.use(
	(request) => {
		const token = localStorage.getItem('token')
		if (token) {
			request.headers.Authorization = `Bearer ${token}`
		}
		return request
	},
	(error) => Promise.reject(error)
)

axiosConfig.interceptors.response.use(
	(response) => {
		const { message } = response.data
		if (message) {
			toast.success(message)
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
