import { Route, BrowserRouter as RouterProvider, Routes } from 'react-router-dom'
import AuthProvider from './configs/AuthProvider'
import NotFoundPage from './pages/commons/NotFoundPage'
import GuestRoute from './routes/GuestRoute'
import UserRoute from './routes/UserRoute'

function App() {
	return (
		<RouterProvider>
			<AuthProvider>
				<Routes>
					<UserRoute />
					<GuestRoute />
					<Route path='*' element={<NotFoundPage />} />
				</Routes>
			</AuthProvider>
		</RouterProvider>
	)
}

export default App
