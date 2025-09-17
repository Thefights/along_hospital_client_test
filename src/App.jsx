import { Container } from '@mui/material'
import { Route, BrowserRouter as RouterProvider, Routes } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import AuthProvider from './configs/AuthProvider'
import ConfirmationProvider from './configs/ConfirmationProvider'
import NotFoundPage from './pages/commons/NotFoundPage'
import TestTable from './pages/TestTable'
import GuestRoute from './routes/GuestRoute'
import UserRoute from './routes/UserRoute'

function App() {
	return (
		<Container maxWidth='xl' sx={{ minHeight: '100vh' }}>
			<RouterProvider>
				<AuthProvider>
					<ConfirmationProvider>
						<Routes>
							<Route path='/*' element={<GuestRoute />} />
							<Route path='/user/*' element={<UserRoute />} />
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
		</Container>
	)
}

export default App
