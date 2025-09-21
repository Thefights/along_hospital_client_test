import LayoutPatient from '@/layouts/LayoutPatient'
import ProfilePage from '@/pages/users/ProfilePage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RoutePatient = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				<Route element={<LayoutPatient />}>
					<Route path='/profile' element={<ProfilePage />} />
				</Route>
			</Route>
		</Routes>
	)
}

export default RoutePatient
