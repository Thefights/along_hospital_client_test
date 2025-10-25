import { routeUrls } from '@/configs/routeUrls'
import LayoutAuth from '@/layouts/LayoutAuth'
import CompleteProfilePage from '@/pages/guests/Auth/CompleteProfilePage/CompleteProfilePage'
import ForgotPasswordPage from '@/pages/guests/Auth/ForgotPasswordPage/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/guests/Auth/ForgotPasswordPage/ResetPasswordPage/ResetPasswordPage'
import LoginPage from '@/pages/guests/Auth/LoginPage/LoginPage'
import RegisterPage from '@/pages/guests/Auth/RegisterPage/RegisterPage'
import ResendLinkPage from '@/pages/guests/Auth/RegisterPage/VerifyAccountPage/ResendLinkPage'
import VerifyLinkPage from '@/pages/guests/Auth/RegisterPage/VerifyAccountPage/VerifyLinkPage'
import { Route, Routes } from 'react-router-dom'

const RouteAuth = () => {
	return (
		<Routes>
			<Route element={<LayoutAuth />}>
				<Route path={routeUrls.AUTH.LOGIN} element={<LoginPage />} />
				<Route path={routeUrls.AUTH.REGISTER} element={<RegisterPage />} />
				<Route path={routeUrls.AUTH.VERIFY} element={<VerifyLinkPage />} />
				<Route path={routeUrls.AUTH.RESEND_LINK} element={<ResendLinkPage />} />
				<Route path={routeUrls.AUTH.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
				<Route path={routeUrls.AUTH.RESET_PASSWORD} element={<ResetPasswordPage />} />
				<Route path={routeUrls.AUTH.COMPLETE_PROFILE} element={<CompleteProfilePage />} />
			</Route>
		</Routes>
	)
}

export default RouteAuth
