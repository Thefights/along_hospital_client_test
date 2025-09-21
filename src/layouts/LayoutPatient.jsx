import Footer from '@/components/layouts/Footer'
import HeaderPatient from '@/components/layouts/HeaderPatient'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setCartStore, setProfileStore } from '@/redux/reducers/userReducer'
import { AssignmentOutlined, HistoryOutlined, LockReset, Person } from '@mui/icons-material'
import { Outlet } from 'react-router-dom'

const LayoutPatient = () => {
	const patientStore = useReduxStore({
		url: '/profile',
		selector: (s) => s.user.profile,
		setStore: setProfileStore,
	})

	const cartCountStore = useReduxStore({
		url: '/cart',
		selector: (s) => s.user.cart,
		setStore: setCartStore,
		dataToGet: (cart) => cart?.cartDetails?.length || 0,
	})

	const { t } = useTranslation()
	const items = [
		{ label: t('header.home'), url: '/' },
		{
			label: t('header.service'),
			of: [
				{ label: t('header.medical_service'), url: '/service' },
				{ label: t('header.medicine'), url: '/medicine' },
				{ label: t('header.doctor'), url: '/doctor' },
			],
		},
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
			<HeaderPatient
				items={items}
				userMenuItems={userMenuItems}
				patient={patientStore.data}
				cartCount={cartCountStore.data}
			/>
			<Outlet />
			<Footer />
		</>
	)
}

export default LayoutPatient
