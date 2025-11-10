import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { Route, BrowserRouter as RouterProvider, Routes } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import AuthProvider from './configs/AuthProvider'
import ConfirmationProvider from './configs/ConfirmationProvider'
import { routeUrls } from './configs/routeUrls'
import { hospitalDarkTheme, hospitalLightTheme } from './configs/themeConfig'
import { useLocalStorage } from './hooks/useStorage'
import store from './redux/store'
import RouteAuth from './routes/RouteAuth'
import RouteDoctor from './routes/RouteDoctor'
import RouteGuest from './routes/RouteGuest'
import RouteManager from './routes/RouteManager'
import RoutePatient from './routes/RoutePatient'
import { getEnv } from './utils/commons'

function App() {
	const [theme, _] = useLocalStorage('theme', 'light')
	return (
		<ThemeProvider theme={theme === 'light' ? hospitalLightTheme : hospitalDarkTheme}>
			<CssBaseline />
			<ReduxStoreProvider store={store}>
				<RouterProvider>
					<GoogleOAuthProvider clientId={getEnv('VITE_GOOGLE_CLIENT_ID')}>
						<AuthProvider>
							<ConfirmationProvider>
								<Routes>
									<Route path='/*' element={<RouteGuest />} />
									<Route path={`${routeUrls.BASE_ROUTE.PATIENT()}/*`} element={<RoutePatient />} />
									<Route path={`${routeUrls.BASE_ROUTE.MANAGER()}/*`} element={<RouteManager />} />
									<Route path={`${routeUrls.BASE_ROUTE.DOCTOR()}/*`} element={<RouteDoctor />} />
									<Route path={`${routeUrls.BASE_ROUTE.AUTH()}/*`} element={<RouteAuth />} />
								</Routes>
								<ToastContainer
									autoClose={3000}
									closeOnClick
									pauseOnHover
									theme='light'
									position='top-right'
									transition={Slide}
									limit={5}
								/>
							</ConfirmationProvider>
						</AuthProvider>
					</GoogleOAuthProvider>
				</RouterProvider>
			</ReduxStoreProvider>
		</ThemeProvider>
	)
}

export default App
