import axios from 'axios'

const axiosConfig = axios.create({
	baseURL: 'https://localhost:8000/api/v1',
	headers: {
		'Content-Type': 'multipart/form-data',
	},
})

export default axiosConfig
