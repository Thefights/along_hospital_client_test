// Định nghĩa route cho khu vực Patient, bao gồm trang Feedback mới
import { routeUrls } from '@/configs/routeUrls'
import LayoutPatient from '@/layouts/LayoutPatient'
import CreateAppointmentPage from '@/pages/patients/createAppointmentPage/CreateAppointmentPage'
import FeedbackPage from '@/pages/patients/feedbackPage/FeedbackPage'
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
					{/* Trang hồ sơ và trang đánh giá (feedback) */}
					<Route path={routeUrls.PATIENT.PROFILE} element={<ProfilePage />} />
					<Route path={routeUrls.PATIENT.FEEDBACK} element={<FeedbackPage />} />
					<Route path={routeUrls.PATIENT.APPOINTMENT.CREATE} element={<CreateAppointmentPage />} />
					<Route
						path={routeUrls.PATIENT.APPOINTMENT.INDEX}
						element={<PatientAppointmentHistoryPage />}
					/>
					<Route
						path={routeUrls.PATIENT.MEDICAL_HISTORY.INDEX}
						element={<PatientMedicalHistoryPage />}
					/>
				</Route>
			</Route>
		</Routes>
	)
}

export default RoutePatient
