import useAuth from '@/hooks/useAuth'
import LayoutGuest from '@/layouts/LayoutGuest'
import LayoutPatient from '@/layouts/LayoutPatient'
import HomePage from '@/pages/guests/HomePage'
import TestDialog from '@/pages/TestDialog'
import TestTable from '@/pages/TestTable'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const RouteGuest = () => {
	const { auth } = useAuth()

	return (
		<Routes>
			<Route element={<ProtectedRoute allowRoles={[]} />}>
				{/* This is route with layout */}
				<Route element={auth?.role !== null ? <LayoutPatient /> : <LayoutGuest />}>
					<Route path='/' index element={<HomePage />} />
					{process.env.NODE_ENV === 'development' && (
						<>
							<Route path='/test' element={<TestTable />} />
							<Route path='/test2' element={<TestDialog />} />
						</>
					)}
				</Route>
			</Route>
		</Routes>
	)
}

export default RouteGuest
