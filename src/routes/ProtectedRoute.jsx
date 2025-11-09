import { EnumConfig } from '@/configs/enumConfig'
import { routeUrls } from '@/configs/routeUrls'
import useReduxStore from '@/hooks/useReduxStore'
import { setAuthStore } from '@/redux/reducers/authReducer'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute = ({
	allowRoles = [],
	redirectPath = routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.LOGIN),
	unauthorizedPath = '/',
}) => {
	const location = useLocation()
	const completeProfilePath = routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.COMPLETE_PROFILE)

	const { data: auth, fetchedOnce } = useReduxStore({
		selector: (s) => s.auth,
		setStore: setAuthStore,
	})

	const hasRole = (roles) => {
		if (!auth?.role) return false
		return roles.map((r) => String(r).toLowerCase()).includes(auth.role.toLowerCase())
	}

	if (allowRoles.length === 0) return <Outlet />

	if (!fetchedOnce) {
		return <Outlet />
	}

	if (!auth?.role) {
		return <Navigate to={redirectPath} replace state={{ from: location }} />
	}

	if (
		auth.stage &&
		auth.stage !== EnumConfig.AuthStage.Done &&
		location.pathname !== completeProfilePath
	) {
		return <Navigate to={completeProfilePath} replace />
	}

	if (!hasRole(allowRoles)) {
		return <Navigate to={unauthorizedPath} replace />
	}

	return <Outlet />
}

export default ProtectedRoute
