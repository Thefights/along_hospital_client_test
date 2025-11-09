import { routeUrls } from '@/configs/routeUrls'
/* eslint-disable no-undef */
import useAuth from '@/hooks/useAuth'
import LayoutGuest from '@/layouts/LayoutGuest'
import LayoutPatient from '@/layouts/LayoutPatient'
import MedicalHistoryInvoicePage from '@/pages/commons/invoicePage/MedicalHistoryInvoicePage'
import PrescriptionPrintPage from '@/pages/commons/invoicePage/PrescriptionPrintPage'
import NotFoundPage from '@/pages/commons/NotFoundPage'
import CreateMedicalHistoryPage from '@/pages/doctors/createMedicalHistoryPage/CreateMedicalHistoryPage'
import HomePage from '@/pages/guests/HomePage'
import BlogDetailPage from '@/pages/guests/viewBlogDetailPage/BlogDetailPage'
import BlogPage from '@/pages/guests/viewBlogPage/BlogPage'
import DoctorPage from '@/pages/guests/viewDoctorPage/DoctorPage'
import SpecialtyPage from '@/pages/patients/specialtyPage/SpecialtyPage'
import CollectibleVoucherListPage from '@/pages/patients/voucherPage/CollectibleVoucherListPage'
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
					<Route path={routeUrls.HOME.SPECIALTY} element={<SpecialtyPage />} />
					<Route path={routeUrls.HOME.VOUCHERS} element={<CollectibleVoucherListPage />} />
					<Route path={routeUrls.HOME.DOCTOR} element={<DoctorPage />} />
					<Route path={routeUrls.HOME.BLOG} element={<BlogPage />} />
					<Route path={`${routeUrls.HOME.BLOG}/:id`} element={<BlogDetailPage />} />
					<Route
						path={routeUrls.HOME.MEDICAL_HISTORY_INVOICE(':id')}
						element={<MedicalHistoryInvoicePage />}
					/>
					<Route
						path={routeUrls.HOME.MEDICAL_HISTORY_PRINT_PRESCRIPTION(':id')}
						element={<PrescriptionPrintPage />}
					/>
					{process.env.NODE_ENV === 'development' && (
						<>
							<Route path='/test' element={<TestTable />} />
							<Route path='/test2' element={<CreateMedicalHistoryPage />} />
						</>
					)}
				</Route>
			</Route>

			<Route path='*' element={<NotFoundPage />} />
		</Routes>
	)
}

export default RouteGuest
