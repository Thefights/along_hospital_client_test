/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import useReduxStore from '@/hooks/useReduxStore'
import { useLocalStorage } from '@/hooks/useStorage'
import { resetAuthStore, setAuthStore } from '@/redux/reducers/authReducer'
import { createContext, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { ApiUrls } from './apiUrls'
import axiosConfig from './axiosConfig'
import { EnumConfig } from './enumConfig'
import { routeUrls } from './routeUrls'

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch()
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
		}
	}

	const hasRole = (required) => {
		if (!required?.length) return true

		const auth = authStore.data
		if (!auth?.role) return false
		required = required.map((r) => String(r).toUpperCase())
		return required.includes(String(auth?.role)?.toUpperCase() || null)
	}

	const getReturnUrlByRole = (role) => {
		switch (String(role).toLowerCase()) {
			case EnumConfig.Role.Doctor.toLowerCase():
				return routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.DASHBOARD)
			case EnumConfig.Role.Manager.toLowerCase():
				return routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.DASHBOARD)
			case EnumConfig.Role.Patient.toLowerCase():
			default:
				return '/'
		}
	}

	const value = useMemo(
		() => ({ auth: authStore.data, login, logout, hasRole, getReturnUrlByRole }),
		[authStore.data]
	)
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
