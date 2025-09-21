import LayoutManager from '@/layouts/LayoutManager'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RouteManager = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				<Route element={<LayoutManager />}>
					<Route path='/' element={<div>Dashboard</div>} />
				</Route>
			</Route>
		</Routes>
	)
}

export default RouteManager
