import { EnumConfig } from '@/configs/enumConfig'
import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute = ({
	allowRoles = [],
	redirectPath = routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.LOGIN),
	unauthorizedPath = '/',
}) => {
	const { auth, hasRole } = useAuth()
	const location = useLocation()

	const completeProfilePath = routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.COMPLETE_PROFILE)

	if (allowRoles.length === 0) return <Outlet />

	if (!auth) {
		return <Navigate to={redirectPath} replace state={{ from: location }} />
	}

	if (auth.stage !== EnumConfig.AuthStage.Done && location.pathname !== completeProfilePath) {
		return <Navigate to={completeProfilePath} replace />
	}

	if (!hasRole(allowRoles)) {
		return <Navigate to={unauthorizedPath} replace />
	}

	return <Outlet />
}

export default ProtectedRoute
