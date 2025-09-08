const { default: axios } = require('axios')

const axiosConfig = axios.create({
	baseURL: 'http://localhost:3000',
	headers: {
		'Content-Type': 'application/json',
	},
})

export default axiosConfig
