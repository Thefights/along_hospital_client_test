import { useSecureStorage } from '@/hooks/useStorage'
import { createContext, useEffect, useMemo } from 'react'

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
	const [auth, setAuth, removeAuth] = useSecureStorage('auth', {
		token: null,
		role: null,
	})

	useEffect(() => {
		const onChange = () => setAuth(auth)
		window.addEventListener('storage', onChange)
		window.addEventListener('authchange', onChange)
		return () => {
			window.removeEventListener('storage', onChange)
			window.removeEventListener('authchange', onChange)
		}
	}, [])

	const login = (token, role) => {
		setAuth({ token, role })
		window.dispatchEvent(new Event('authchange'))
	}

	const logout = () => {
		removeAuth()
		window.dispatchEvent(new Event('authchange'))
	}

	const hasRole = (required) => {
		if (!required?.length) return true
		required = required.map((r) => String(r).toUpperCase())
		return required.includes(String(auth?.role)?.toUpperCase() || null)
	}

	const value = useMemo(() => ({ auth, login, logout, hasRole }), [auth])
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
