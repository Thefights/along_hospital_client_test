import { AuthContext } from '@/configs/AuthProvider'
import { useContext } from 'react'

/**
 * @typedef {import('@/redux/store').RootState} RootState
 */

/**
 * @returns {{
 *  auth: RootState['auth'],
 * 	hasRole: (required: (string|number)[]) => boolean,
 * 	login: (accessToken: string, refreshToken: string) => Promise<void>,
 * 	logout: () => void
 * }}
 */
export default function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return {
		auth: ctx.auth,
		hasRole: (required) => ctx.hasRole(required),
		login: (accessToken, refreshToken, role) => ctx.login(accessToken, refreshToken, role),
		logout: () => ctx.logout(),
	}
}
