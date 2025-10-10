import { routeUrls } from '@/configs/routeUrls'
import LayoutPatient from '@/layouts/LayoutPatient'
import CreateAppointmentPage from '@/pages/patients/CreateAppointmentPage'
import PatientAppointmentHistoryPage from '@/pages/patients/PatientAppointmentHistoryPage'
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
				</Route>
			</Route>
		</Routes>
	)
}

export default RoutePatient
