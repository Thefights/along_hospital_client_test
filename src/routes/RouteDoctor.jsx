import MedicalHistoryDetailBasePage from '@/components/basePages/medicalHistoryDetailBasePage/MedicalHistoryDetailBasePage'
import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import LayoutDoctor from '@/layouts/LayoutDoctor'
import CreateMedicalHistoryPage from '@/pages/doctors/createMedicalHistoryPage/CreateMedicalHistoryPage'
import DoctorAppointmentManagementPage from '@/pages/doctors/doctorAppointmentManagementPage/DoctorAppointmentManagementPage'
import DoctorMedicalHistoryManagementPage from '@/pages/doctors/doctorMedicalHistoryManagementPage/DoctorMedicalHistoryManagementPage'
import ProfilePage from '@/pages/ProfilePage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RouteDoctor = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				<Route element={<LayoutDoctor />}>
					<Route path='/' element={<div>Dashboard</div>} />
					<Route path={routeUrls.DOCTOR.PROFILE} element={<ProfilePage />} />
					<Route
						path={routeUrls.DOCTOR.APPOINTMENT_MANAGEMENT}
						element={<DoctorAppointmentManagementPage />}
					/>
					<Route
						path={routeUrls.DOCTOR.MEDICAL_HISTORY.INDEX}
						element={<DoctorMedicalHistoryManagementPage />}
					/>
					<Route path={routeUrls.DOCTOR.MEDICAL_HISTORY.CREATE} element={<CreateMedicalHistoryPage />} />
					<Route
						path={routeUrls.DOCTOR.MEDICAL_HISTORY.DETAIL(':id')}
						element={<MedicalHistoryDetailBasePage fetchUrl={ApiUrls.MEDICAL_HISTORY.MANAGEMENT.INDEX} />}
					/>
				</Route>
			</Route>
		</Routes>
	)
}

export default RouteDoctor
