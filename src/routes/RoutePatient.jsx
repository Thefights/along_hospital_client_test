import LayoutPatient from '@/layouts/LayoutPatient'
import CreateAppointmentPage from '@/pages/users/CreateAppointmentPage'
import PatientAppointmentHistoryPage from '@/pages/users/PatientAppointmentHistoryPage'
import ProfilePage from '@/pages/users/ProfilePage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RoutePatient = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				<Route element={<LayoutPatient />}>
					<Route path='/profile' element={<ProfilePage />} />
					<Route path='/appointment/create' element={<CreateAppointmentPage />} />
					<Route path='/appointment' element={<PatientAppointmentHistoryPage />} />
				</Route>
			</Route>
		</Routes>
	)
}

export default RoutePatient
