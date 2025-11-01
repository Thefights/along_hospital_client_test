import { routeUrls } from '@/configs/routeUrls'
import LayoutManager from '@/layouts/LayoutManager'
import NotFoundPage from '@/pages/commons/NotFoundPage'
import ComplaintManagementPage from '@/pages/managers/complaintManagementPage/ComplaintManagementPage'
import DoctorManagementPage from '@/pages/managers/doctorManagementPage/DoctorManagementPage'
import ManagerAppointmentManagementPage from '@/pages/managers/managerAppointmentManagementPage/ManagerAppointmentManagementPage'
import ManagerBlogManagementPage from '@/pages/managers/managerBlogManagementPage/ManagerBlogManagementPage'
import BlogUpsertPage from '@/pages/managers/managerBlogUpsertPage/BlogUpsertPage'
import ManagerMedicalHistoryManagementPage from '@/pages/managers/managerMedicalHistoryManagementPage/ManagerMedicalHistoryManagementPage'
import SpecialtyManagementPage from '@/pages/managers/specialtyManagementPage/SpecialtyManagementPage'
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
					<Route path={routeUrls.MANAGER.BLOG.INDEX} element={<ManagerBlogManagementPage />} />
					<Route path={routeUrls.MANAGER.BLOG.CREATE} element={<BlogUpsertPage />} />
					<Route path={routeUrls.MANAGER.BLOG.UPDATE(':id')} element={<BlogUpsertPage />} />
					<Route path={routeUrls.MANAGER.COMPLAINT_MANAGEMENT} element={<ComplaintManagementPage />} />
					<Route
						path={routeUrls.MANAGER.MEDICAL_HISTORY.INDEX}
						element={<ManagerMedicalHistoryManagementPage />}
					/>
					<Route path={routeUrls.MANAGER.SPECIALTY_MANAGEMENT} element={<SpecialtyManagementPage />} />
					<Route path={routeUrls.MANAGER.DOCTOR_MANAGEMENT} element={<DoctorManagementPage />} />
				</Route>
			</Route>

			<Route path='*' element={<NotFoundPage />} />
		</Routes>
	)
}

export default RouteManager
