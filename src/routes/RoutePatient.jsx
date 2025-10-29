import { routeUrls } from '@/configs/routeUrls'
import LayoutPatient from '@/layouts/LayoutPatient'
import CreateAppointmentPage from '@/pages/patients/createAppointmentPage/CreateAppointmentPage'
import CreateVideoConsultationPage from '@/pages/patients/createVideoConsultationPage/createVideoConsultationPage'
import EndMeetingRoomPage from '@/pages/patients/meetingRoomPage/endMeetingRoomPage/EndMeetingRoomPage'
import JoinMeetingRoomPage from '@/pages/patients/meetingRoomPage/JoinMeetingRoomPage'
import MeetingRoomPage from '@/pages/patients/meetingRoomPage/meetingRoomPage/MeetingRoomPage'
import PatientAppointmentHistoryPage from '@/pages/patients/patientAppointmentHistoryPage/PatientAppointmentHistoryPage'
import PatientMedicalHistoryPage from '@/pages/patients/patientMedicalHistoryPage/PatientMedicalHistoryPage'
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
					<Route
						path={routeUrls.PATIENT.APPOINTMENT.JOIN_MEETING_ROOM}
						element={<JoinMeetingRoomPage />}
					/>
					<Route
						path={routeUrls.PATIENT.APPOINTMENT.JOIN_MEETING_ROOM + '/complete'}
						element={<EndMeetingRoomPage />}
					/>
					<Route path={routeUrls.PATIENT.VIDEO_CONSULTATION} element={<CreateVideoConsultationPage />} />
					<Route
						path={routeUrls.PATIENT.MEDICAL_HISTORY.INDEX}
						element={<PatientMedicalHistoryPage />}
					/>
				</Route>
				<Route
					path={routeUrls.PATIENT.APPOINTMENT.MEETING_ROOM_TOKEN(':id')}
					element={<MeetingRoomPage />}
				/>
			</Route>
		</Routes>
	)
}

export default RoutePatient
