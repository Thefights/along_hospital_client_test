import { routeUrls } from '@/configs/routeUrls'
/* eslint-disable no-undef */
import useAuth from '@/hooks/useAuth'
import LayoutGuest from '@/layouts/LayoutGuest'
import LayoutPatient from '@/layouts/LayoutPatient'
import CreateMedicalHistoryPage from '@/pages/doctors/createMedicalHistoryPage/CreateMedicalHistoryPage'
import HomePage from '@/pages/guests/HomePage'
import BlogDetailPage from '@/pages/guests/viewBlogDetailPage/BlogDetailPage'
import BlogPage from '@/pages/guests/viewBlogPage/BlogPage'
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
					<Route path={routeUrls.HOME.BLOG} element={<BlogPage />} />
					<Route path={`${routeUrls.HOME.BLOG}/:id`} element={<BlogDetailPage />} />
					{process.env.NODE_ENV === 'development' && (
						<>
							<Route path='/test' element={<TestTable />} />
							<Route path='/test2' element={<CreateMedicalHistoryPage />} />
						</>
					)}
				</Route>
			</Route>
		</Routes>
	)
}

export default RouteGuest
