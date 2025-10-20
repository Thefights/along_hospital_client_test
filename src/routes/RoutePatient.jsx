import { routeUrls } from '@/configs/routeUrls'
import LayoutPatient from '@/layouts/LayoutPatient'
import CreateAppointmentPage from '@/pages/patients/createAppointmentPage/CreateAppointmentPage'
import CreateVideoConsultationPage from '@/pages/patients/createVideoConsultationPage/createVideoConsultationPage'
import MeetingRoomPage from '@/pages/patients/meetingRoomPage/MeetingRoomPage'
import PatientAppointmentHistoryPage from '@/pages/patients/patientAppointmentHistoryPage/PatientAppointmentHistoryPage'
import ProfilePage from '@/pages/patients/ProfilePage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RoutePatient = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				<Route element={<LayoutPatient />}>
					<Route path={routeUrls.PATIENT.PROFILE} element={<ProfilePage />} />
					<Route path={routeUrls.PATIENT.APPOINTMENT.CREATE} element={<CreateAppointmentPage />} />
					<Route
						path={routeUrls.PATIENT.APPOINTMENT.INDEX}
						element={<PatientAppointmentHistoryPage />}
					/>
					<Route path={routeUrls.PATIENT.APPOINTMENT.MEETING_ROOM} element={<MeetingRoomPage />} />
					<Route path={routeUrls.PATIENT.VIDEO_CONSULTATION} element={<CreateVideoConsultationPage />} />
					<Route path={routeUrls.PATIENT.APPOINTMENT.MEETING_ROOM} element={<MeetingRoomPage />} />
				</Route>
			</Route>
		</Routes>
	)
}

export default RoutePatient
