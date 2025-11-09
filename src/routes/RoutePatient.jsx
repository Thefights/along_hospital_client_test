import MedicalHistoryDetailBasePage from '@/components/basePages/medicalHistoryDetailBasePage/MedicalHistoryDetailBasePage'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import LayoutPatient from '@/layouts/LayoutPatient'
import NotFoundPage from '@/pages/commons/NotFoundPage'
import CreateAppointmentPage from '@/pages/patients/createAppointmentPage/CreateAppointmentPage'
import OrderHistoryDetailPage from '@/pages/patients/orderHistoryDetailPage/OrderHistoryDetailPage'
import OrderHistoryPage from '@/pages/patients/orderHistoryPage/OrderHistoryPage'
import PatientAppointmentHistoryPage from '@/pages/patients/patientAppointmentHistoryPage/PatientAppointmentHistoryPage'
import PatientMedicalHistoryPage from '@/pages/patients/patientMedicalHistoryPage/PatientMedicalHistoryPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
const RoutePatient = () => {
	const { auth, getReturnUrlByRole } = useAuth()

	return (
		<Routes>
			<Route
				element={
					<ProtectedRoute
						allowRoles={[EnumConfig.Role.Patient]}
						unauthorizedPath={getReturnUrlByRole(auth?.role)}
					/>
				}
			>
				<Route element={<LayoutPatient />}>
					<Route path={routeUrls.PATIENT.PROFILE} element={<ProfilePage />} />
					<Route path={routeUrls.PATIENT.APPOINTMENT.CREATE} element={<CreateAppointmentPage />} />
					<Route
						path={routeUrls.PATIENT.APPOINTMENT.INDEX}
						element={<PatientAppointmentHistoryPage />}
					/>
					<Route
						path={routeUrls.PATIENT.MEDICAL_HISTORY.INDEX}
						element={<PatientMedicalHistoryPage />}
					/>
					<Route
						path={routeUrls.PATIENT.MEDICAL_HISTORY.DETAIL(':id')}
						element={<MedicalHistoryDetailBasePage fetchUrl={ApiUrls.MEDICAL_HISTORY.INDEX} />}
					/>
					<Route path={routeUrls.PATIENT.ORDER_HISTORY.INDEX} element={<OrderHistoryPage />} />
					<Route
						path={routeUrls.PATIENT.ORDER_HISTORY.DETAIL(':id')}
						element={<OrderHistoryDetailPage />}
					/>
				</Route>
			</Route>
			<Route path='*' element={<NotFoundPage />} />
		</Routes>
	)
}

export default RoutePatient
