import Footer from '@/components/layouts/Footer'
import HeaderPatient from '@/components/layouts/HeaderPatient'
import useTranslation from '@/hooks/useTranslation'
import { AssignmentOutlined, HistoryOutlined, LockReset, Person } from '@mui/icons-material'
import { Outlet } from 'react-router-dom'

const LayoutPatient = () => {
	const { t } = useTranslation()
	const items = [
		{ label: t('header.home'), url: '/' },
		{ label: t('header.medicine'), url: '/medicine' },
		{
			label: t('header.medical_service'),
			url: '/service',
		},
		{ label: t('header.doctor'), url: '/doctor' },
		{ label: t('header.specialty'), url: '/specialty' },
		{ label: t('header.blog'), url: '/blog' },
		{ label: t('header.about_us'), url: '/about' },
	]

	const userMenuItems = [
		{ label: t('header.user_menu.profile'), url: '/profile', icon: <Person /> },
		{
			label: t('header.user_menu.medical_history'),
			url: '/medical-history',
			icon: <AssignmentOutlined />,
		},
		{ label: t('header.user_menu.order_history'), url: '/order-history', icon: <HistoryOutlined /> },
		{ label: t('header.user_menu.change_password'), url: '/change-password', icon: <LockReset /> },
	]

	return (
		<>
			<HeaderPatient items={items} userMenuItems={userMenuItems} patient={{}} />
			<Outlet />
			<Footer />
		</>
	)
}

export default LayoutPatient
