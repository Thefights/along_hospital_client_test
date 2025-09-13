import { AuthContext } from '@/configs/AuthProvider'
import { useContext } from 'react'

export default function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return {
		auth: ctx.auth,
		hasRole: () => ctx.hasRole(),
		login: (token, role) => ctx.login(token, role),
		logout: () => ctx.logout(),
	}
}
