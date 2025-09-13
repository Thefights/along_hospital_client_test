import Footer from '@/components/layouts/Footer'
import HeaderUser from '@/components/layouts/HeaderUser'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
	return (
		<>
			<HeaderUser />
			<Outlet />
			<Footer />
		</>
	)
}

export default UserLayout
