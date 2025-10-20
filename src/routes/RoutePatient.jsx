import { routeUrls } from '@/configs/routeUrls'
import LayoutPatient from '@/layouts/LayoutPatient'
import CreateAppointmentPage from '@/pages/patients/createAppointmentPage/CreateAppointmentPage'
import CreateVideoConsultationPage from '@/pages/patients/createVideoConsultationPage/createVideoConsultationPage'
import JoinMeetingRoomPage from '@/pages/patients/meetingRoomPage/JoinMeetingRoomPage'
import WaitingRoomPage from '@/pages/patients/meetingRoomPage/WaitingRoomPage'
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
					<Route path={routeUrls.PATIENT.APPOINTMENT.MEETING_ROOM} element={<JoinMeetingRoomPage />} />
					<Route
						path={routeUrls.PATIENT.APPOINTMENT.MEETING_ROOM_TOKEN(':id')}
						element={<WaitingRoomPage />}
					/>
					<Route path={routeUrls.PATIENT.VIDEO_CONSULTATION} element={<CreateVideoConsultationPage />} />
					<Route path={routeUrls.PATIENT.APPOINTMENT.MEETING_ROOM} element={<JoinMeetingRoomPage />} />
				</Route>
			</Route>
		</Routes>
	)
}

export default RoutePatient
