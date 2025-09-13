import GuestLayout from '@/layouts/GuestLayout'
import HomePage from '@/pages/guests/HomePage'
import LoginPage from '@/pages/guests/LoginPage'
import { Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const GuestRoute = () => {
	return (
		<Route element={<ProtectedRoute allowRoles={[]} />}>
			{/* This is route with layout */}
			<Route element={<GuestLayout />}>
				<Route path='/' index element={<HomePage />} />
			</Route>

			{/* This is route without layout */}
			<Route path='/login' element={<LoginPage />} />
		</Route>
	)
}

export default GuestRoute
