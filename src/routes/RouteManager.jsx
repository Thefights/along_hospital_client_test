import { routeUrls } from '@/configs/routeUrls'
import LayoutManager from '@/layouts/LayoutManager'
import ManagerAppointmentManagementPage from '@/pages/managers/managerAppointmentManagementPage/ManagerAppointmentManagementPage'
import ManagerBlogManagementPage from '@/pages/managers/managerBlogManagementPage/ManagerBlogManagementPage'
import BlogUpsertPage from '@/pages/managers/managerBlogUpsertPage/BlogUpsertPage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RouteManager = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				<Route element={<LayoutManager />}>
					<Route path={routeUrls.MANAGER.DASHBOARD} element={<div>Dashboard</div>} />
					<Route
						path={routeUrls.MANAGER.APPOINTMENT_MANAGEMENT}
						element={<ManagerAppointmentManagementPage />}
					/>
					<Route path={routeUrls.MANAGER.BLOG_MANAGEMENT} element={<ManagerBlogManagementPage />} />
					<Route path={routeUrls.MANAGER.BLOG_CREATE} element={<BlogUpsertPage />} />
					<Route path={routeUrls.MANAGER.BLOG_UPDATE()} element={<BlogUpsertPage />} />
				</Route>
			</Route>
		</Routes>
	)
}

export default RouteManager
