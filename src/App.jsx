import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { Route, BrowserRouter as RouterProvider, Routes } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import AuthProvider from './configs/AuthProvider'
import ConfirmationProvider from './configs/ConfirmationProvider'
import { hospitalLightTheme } from './configs/themeConfig'
import NotFoundPage from './pages/commons/NotFoundPage'
import TestTable from './pages/TestTable'
import store from './redux/store'
import RouteGuest from './routes/RouteGuest'
import RoutePatient from './routes/RoutePatient'

function App() {
	return (
		<ThemeProvider theme={hospitalLightTheme}>
			<CssBaseline />
			<ReduxStoreProvider store={store}>
				<RouterProvider>
					<AuthProvider>
						<ConfirmationProvider>
							<Routes>
								<Route path='/*' element={<RouteGuest />} />
								<Route path='/user/*' element={<RoutePatient />} />
								<Route path='/test' element={<TestTable />} />
								<Route path='*' element={<NotFoundPage />} />
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
				</RouterProvider>
			</ReduxStoreProvider>
		</ThemeProvider>
	)
}

export default App
