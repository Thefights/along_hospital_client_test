import useAuth from '@/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ allowRoles = [], redirectPath = '/login', unauthorizedPath = '/' }) => {
	const { auth, hasRole } = useAuth()
	const location = useLocation()

	if (allowRoles.length === 0) return <Outlet />

	if (!auth) {
		return <Navigate to={redirectPath} replace state={{ from: location }} />
	}

	if (auth.stage !== null && auth.stage !== undefined && location.pathname !== '/user/complete') {
		return <Navigate to='/user/complete' replace />
	}

	if (!hasRole(allowRoles)) {
		return <Navigate to={unauthorizedPath} replace />
	}

	return <Outlet />
}

export default ProtectedRoute
