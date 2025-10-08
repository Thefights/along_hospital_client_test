import LayoutDoctor from '@/layouts/LayoutDoctor'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RouteDoctor = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				<Route element={<LayoutDoctor />}>
					<Route path='/' element={<div>Dashboard</div>} />
				</Route>
			</Route>
		</Routes>
	)
}

export default RouteDoctor
