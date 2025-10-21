/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import useReduxStore from '@/hooks/useReduxStore'
import { useLocalStorage } from '@/hooks/useStorage'
import { resetAuthStore, setAuthStore } from '@/redux/reducers/authReducer'
import { createContext, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { ApiUrls } from './apiUrls'
import axiosConfig from './axiosConfig'

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch()
	const [_, setToken, removeToken] = useLocalStorage('token')

	const authStore = useReduxStore({
		url: ApiUrls.AUTH.CURRENT_ACCOUNT,
		selector: (s) => s.auth,
		setStore: setAuthStore,
	})

	const login = async (authData) => {
		if (typeof authData === 'string') {
			setToken(authData)
			await authStore.fetch()
		} else {
			const {
				accessToken,
				refreshToken,
				accessTokenExpires,
				refreshTokenExpires,
				role,
				authId,
				userId,
				stage,
			} = authData

			setToken(accessToken)

			dispatch(
				setAuthStore({
					accessToken,
					refreshToken,
					accessTokenExpires,
					refreshTokenExpires,
					role,
					authId,
					userId,
					stage,
				})
			)

			if (stage === null) {
				await authStore.fetch()
			}
		}
	}

	const logout = async () => {
		try {
			await axiosConfig.post(ApiUrls.AUTH.LOGOUT)
		} catch (error) {
			console.error('Logout API call failed:', error)
		} finally {
			removeToken()
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

	const value = useMemo(() => ({ auth: authStore.data, login, logout, hasRole }), [authStore.data])
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
