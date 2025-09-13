import UserLayout from '@/layouts/UserLayout'
import { Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const UserRoute = () => {
	return (
		<Route element={<ProtectedRoute allowRoles={['USER']} />}>
			<Route element={<UserLayout />}>
				<Route path='/profile' element={<div>Profile Page</div>} />
			</Route>
		</Route>
	)
}

export default UserRoute
