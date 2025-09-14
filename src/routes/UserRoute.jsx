import UserLayout from '@/layouts/UserLayout'
import ProfilePage from '@/pages/users/ProfilePage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const UserRoute = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={['USER']} />}>
				<Route element={<UserLayout />}>
					<Route path='/profile' element={<ProfilePage />} />
				</Route>
			</Route>
		</Routes>
	)
}

export default UserRoute
