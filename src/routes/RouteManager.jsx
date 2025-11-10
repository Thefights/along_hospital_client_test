import MedicalHistoryDetailBasePage from '@/components/basePages/medicalHistoryDetailBasePage/MedicalHistoryDetailBasePage'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import LayoutManager from '@/layouts/LayoutManager'
import NotFoundPage from '@/pages/commons/NotFoundPage'
import ComplaintManagementPage from '@/pages/managers/complaintManagementPage/ComplaintManagementPage'
import DoctorManagementPage from '@/pages/managers/doctorManagementPage/DoctorManagementPage'
import FeedbackReportManagementPage from '@/pages/managers/feedbackReportManagementPage/FeedbackReportManagementPage'
import ManagerAppointmentManagementPage from '@/pages/managers/managerAppointmentManagementPage/ManagerAppointmentManagementPage'
import ManagerAttendanceManagementPage from '@/pages/managers/managerAttendanceManagementPage/ManagerAttendanceManagementPage'
import ManagerBlogManagementPage from '@/pages/managers/managerBlogManagementPage/ManagerBlogManagementPage'
import BlogUpsertPage from '@/pages/managers/managerBlogUpsertPage/BlogUpsertPage'
import ManagerDepartmentManagementPage from '@/pages/managers/managerDepartmentManagementPage/ManagerDepartmentManagementPage'
import ImportManagementPage from '@/pages/managers/managerImportManagementPage/ImportManagementPage'
import ManagerMedicalHistoryManagementPage from '@/pages/managers/managerMedicalHistoryManagementPage/ManagerMedicalHistoryManagementPage'
import ManagerMedicalServiceManagementPage from '@/pages/managers/managerMedicalServiceManagementPage/ManagerMedicalServiceManagemnetPage'
import ManagerMedicineCategoryManagementPage from '@/pages/managers/managerMedicineCategoryManagementPage/ManagerMedicineCategoryManagementPage'
import ManagerMedicineManagemntPage from '@/pages/managers/managerMedicineManagementPage/ManagerMedicineManagementPage'
import ManagerSupplierPage from '@/pages/managers/managerSupplierPage/ManagerSupplierPage'
import SpecialtyManagementPage from '@/pages/managers/specialtyManagementPage/SpecialtyManagementPage'
import VoucherManagementPage from '@/pages/managers/voucherManagementPage/VoucherManagementPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RouteManager = () => {
	const { auth, getReturnUrlByRole } = useAuth()

	return (
		<Routes>
			<Route
				element={
					<ProtectedRoute
						allowRoles={[EnumConfig.Role.Manager]}
						unauthorizedPath={getReturnUrlByRole(auth?.role)}
					/>
				}
			>
				<Route element={<LayoutManager />}>
					<Route path={routeUrls.MANAGER.DASHBOARD} element={<div>Dashboard</div>} />
					<Route path={routeUrls.MANAGER.PROFILE} element={<ProfilePage />} />
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
					<Route path={routeUrls.MANAGER.DOCTOR_MANAGEMENT} element={<DoctorManagementPage />} />
					<Route
						path={routeUrls.MANAGER.MEDICINE_MANAGEMENT.INDEX}
						element={<ManagerMedicineManagemntPage />}
					/>

					<Route
						path={routeUrls.MANAGER.MEDICINE_CATEGORY_MANAGEMENT.INDEX}
						element={<ManagerMedicineCategoryManagementPage />}
					/>
					<Route path={routeUrls.MANAGER.IMPORT_MANAGEMENT.INDEX} element={<ImportManagementPage />} />
					<Route path={routeUrls.MANAGER.VOUCHER_MANAGEMENT} element={<VoucherManagementPage />} />
					<Route path={routeUrls.MANAGER.SUPPLIER_MANAGEMENT} element={<ManagerSupplierPage />} />
					<Route
						path={routeUrls.MANAGER.FEEDBACK_REPORT_MANAGEMENT}
						element={<FeedbackReportManagementPage />}
					/>
					<Route
						path={routeUrls.MANAGER.ATTENDANCE_MANAGEMENT}
						element={<ManagerAttendanceManagementPage />}
					/>
				</Route>
			</Route>

			<Route path='*' element={<NotFoundPage />} />
		</Routes>
	)
}

export default RouteManager
