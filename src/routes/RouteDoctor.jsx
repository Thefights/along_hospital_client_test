import MedicalHistoryDetailBasePage from '@/components/basePages/medicalHistoryDetailBasePage/MedicalHistoryDetailBasePage'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import LayoutDoctor from '@/layouts/LayoutDoctor'
import NotFoundPage from '@/pages/commons/NotFoundPage'
import CreateMedicalHistoryPage from '@/pages/doctors/createMedicalHistoryPage/CreateMedicalHistoryPage'
import DoctorAppointmentManagementPage from '@/pages/doctors/doctorAppointmentManagementPage/DoctorAppointmentManagementPage'
import DoctorMeetingRoomPage from '@/pages/doctors/doctorAppointmentManagementPage/DoctorMeetingRoomPage'
import DoctorAttendanceManagementPage from '@/pages/doctors/doctorAttendanceManagementPage/DoctorAttendanceManagementPage'
import DoctorMedicalHistoryManagementPage from '@/pages/doctors/doctorMedicalHistoryManagementPage/DoctorMedicalHistoryManagementPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RouteDoctor = () => {
	const { auth, getReturnUrlByRole } = useAuth()

	return (
		<Routes>
			<Route
				element={
					<ProtectedRoute
						allowRoles={[EnumConfig.Role.Doctor]}
						unauthorizedPath={getReturnUrlByRole(auth?.role)}
					/>
				}
			>
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
					<Route path={routeUrls.DOCTOR.ATTENDANCE} element={<DoctorAttendanceManagementPage />} />
				</Route>
				<Route
					path={routeUrls.DOCTOR.APPOINTMENT.JOIN_MEETING_ROOM}
					element={<DoctorMeetingRoomPage />}
				/>
			</Route>

			<Route path='*' element={<NotFoundPage />} />
		</Routes>
	)
}

export default RouteDoctor
