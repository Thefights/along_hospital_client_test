/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import useReduxStore from '@/hooks/useReduxStore'
import { useLocalStorage } from '@/hooks/useStorage'
import { resetAuthStore, setAuthStore } from '@/redux/reducers/authReducer'
import { resetPatientStore } from '@/redux/reducers/patientReducer'
import { createContext, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ApiUrls } from './apiUrls'
import axiosConfig from './axiosConfig'
import { routeUrls } from './routeUrls'

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage('accessToken')
	const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage('refreshToken')

	useEffect(() => {
		const fetchToken = async () => {
			if (accessToken && refreshToken) await authStore.fetch()
		}
		fetchToken()
	}, [accessToken, refreshToken])

	const authStore = useReduxStore({
		selector: (s) => s.auth,
		setStore: setAuthStore,
	})

	const login = async (accessToken, refreshToken) => {
		setAccessToken(accessToken)
		setRefreshToken(refreshToken)
	}

	const logout = async () => {
		try {
			if (refreshToken) {
				await axiosConfig.post(ApiUrls.AUTH.LOGOUT, { refreshToken })
			}
		} finally {
			removeAccessToken()
			removeRefreshToken()
			dispatch(resetAuthStore())
			dispatch(resetPatientStore())
			navigate(routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.LOGIN))
		}
	}

	const hasRole = (required) => {
		if (!required?.length) return true

		const auth = authStore.data
		if (!auth?.role) return false
		required = required.map((r) => String(r).toUpperCase())
		return required.includes(String(auth?.role)?.toUpperCase() || null)
	}

	const value = useMemo(() => ({ auth: authStore.data, login, logout, hasRole }), [authStore.data])
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
