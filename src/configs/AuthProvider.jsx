import useReduxStore from '@/hooks/useReduxStore'
import { resetAuthStore, setAuthStore } from '@/redux/reducers/authReducer'
import { createContext, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { ApiUrls } from './apiUrls'

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch()

	const authStore = useReduxStore({
		url: ApiUrls.AUTH.CURRENT_ACCOUNT,
		selector: (s) => s.auth,
		setStore: setAuthStore,
	})

	const login = (payload) => {
		dispatch(setAuthStore(payload))
	}

	const logout = () => {
		dispatch(resetAuthStore())
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
