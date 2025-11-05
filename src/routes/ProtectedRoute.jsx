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
	const authStore = useReduxStore({
		selector: (s) => s.auth,
		setStore: setAuthStore,
	})

	const hasRole = (roles) => {
		return String(roles).toLowerCase().includes(authStore.data.role?.toLowerCase())
	}

	const location = useLocation()

	const completeProfilePath = routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.COMPLETE_PROFILE)

	if (allowRoles.length === 0) return <Outlet />

	if (!authStore.data.role) {
		return <Navigate to={redirectPath} replace state={{ from: location }} />
	}

	if (
		authStore.data.stage &&
		authStore.data.stage !== EnumConfig.AuthStage.Done &&
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
