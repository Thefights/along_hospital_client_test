import Footer from '@/components/layouts/Footer'
import HeaderGuest from '@/components/layouts/HeaderGuest'
import { Outlet } from 'react-router-dom'

const GuestLayout = () => {
	return (
		<>
			<HeaderGuest />
			<Outlet />
			<Footer />
		</>
	)
}

export default GuestLayout
