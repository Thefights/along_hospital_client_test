import MedicalHistoryDetailBasePage from '@/components/basePages/medicalHistoryDetailBasePage/MedicalHistoryDetailBasePage'
import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import LayoutManager from '@/layouts/LayoutManager'
import ComplaintManagementPage from '@/pages/managers/complaintManagementPage/ComplaintManagementPage'
import ManagerAppointmentManagementPage from '@/pages/managers/managerAppointmentManagementPage/ManagerAppointmentManagementPage'
import ManagerBlogManagementPage from '@/pages/managers/managerBlogManagementPage/ManagerBlogManagementPage'
import BlogUpsertPage from '@/pages/managers/managerBlogUpsertPage/BlogUpsertPage'
import ManagerDepartmentManagementPage from '@/pages/managers/managerDepartmentManagementPage/ManagerDepartmentManagementPage'
import ManagerMedicalHistoryManagementPage from '@/pages/managers/managerMedicalHistoryManagementPage/ManagerMedicalHistoryManagementPage'
import ManagerMedicalServiceManagementPage from '@/pages/managers/managerMedicalServiceManagementPage/ManagerMedicalServiceManagemnetPage'
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
					<Route
						path={routeUrls.MANAGER.DEPARTMENT_MANAGEMENT}
						element={<ManagerDepartmentManagementPage />}
					/>
					<Route
						path={routeUrls.MANAGER.MEDICAL_SERVICE}
						element={<ManagerMedicalServiceManagementPage />}
					/>
					<Route
						path={routeUrls.MANAGER.MEDICAL_HISTORY.DETAIL(':id')}
						element={<MedicalHistoryDetailBasePage fetchUrl={ApiUrls.MEDICAL_HISTORY.MANAGEMENT.INDEX} />}
					/>
					<Route path={routeUrls.MANAGER.SPECIALTY_MANAGEMENT} element={<SpecialtyManagementPage />} />
				</Route>
			</Route>
		</Routes>
	)
}

export default RouteManager
