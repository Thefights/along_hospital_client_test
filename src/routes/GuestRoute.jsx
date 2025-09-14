import useAuth from '@/hooks/useAuth'
import GuestLayout from '@/layouts/GuestLayout'
import UserLayout from '@/layouts/UserLayout'
import HomePage from '@/pages/guests/HomePage'
import LoginPage from '@/pages/guests/LoginPage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const GuestRoute = () => {
	const { auth } = useAuth()

	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				{/* This is route with layout */}
				<Route element={auth?.role !== null ? <UserLayout /> : <GuestLayout />}>
					<Route path='/' index element={<HomePage />} />
				</Route>

				{/* This is route without layout */}
				<Route path='/login' element={<LoginPage />} />
			</Route>
		</Routes>
	)
}

export default GuestRoute
