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
 * 	logout: () => void,
 * 	getReturnUrlByRole: (role: string) => string
 * }}
 */
export default function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
