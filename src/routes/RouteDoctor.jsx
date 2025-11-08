import { routeUrls } from '@/configs/routeUrls'
import LayoutDoctor from '@/layouts/LayoutDoctor'
import CreateMedicalHistoryPage from '@/pages/doctors/createMedicalHistoryPage/CreateMedicalHistoryPage'
import DoctorAppointmentManagementPage from '@/pages/doctors/doctorAppointmentManagementPage/DoctorAppointmentManagementPage'
import DoctorMedicalHistoryManagementPage from '@/pages/doctors/doctorMedicalHistoryManagementPage/DoctorMedicalHistoryManagementPage'
import MeetingRoomPage from '@/pages/patients/meetingRoomPage/meetingRoomPage/MeetingRoomPage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RouteDoctor = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				<Route element={<LayoutDoctor />}>
					<Route path='/' element={<div>Dashboard</div>} />
					<Route
						path={routeUrls.DOCTOR.APPOINTMENT_MANAGEMENT}
						element={<DoctorAppointmentManagementPage />}
					/>
					<Route
						path={routeUrls.DOCTOR.MEDICAL_HISTORY.INDEX}
						element={<DoctorMedicalHistoryManagementPage />}
					/>
					<Route path={routeUrls.DOCTOR.MEDICAL_HISTORY.CREATE} element={<CreateMedicalHistoryPage />} />
				</Route>
				<Route
					path={routeUrls.DOCTOR.APPOINTMENT.MEETING_ROOM_TOKEN(':id')}
					element={<MeetingRoomPage />}
				/>
			</Route>
		</Routes>
	)
}

export default RouteDoctor
