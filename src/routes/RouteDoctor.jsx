import { routeUrls } from '@/configs/routeUrls'
import LayoutDoctor from '@/layouts/LayoutDoctor'
import DoctorAppointmentManagementPage from '@/pages/doctors/DoctorAppointmentManagementPage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RouteDoctor = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				<Route element={<LayoutDoctor />}>
					<Route path='/' element={<div>Dashboard</div>} />
					<Route
						path={routeUrls.DOCTOR.MANAGE_APPOINTMENTS}
						element={<DoctorAppointmentManagementPage />}
					/>
				</Route>
			</Route>
		</Routes>
	)
}

export default RouteDoctor
