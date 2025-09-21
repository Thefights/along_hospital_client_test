import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import { ApiUrls } from '@/configs/apiUrls'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setCartStore, setProfileStore } from '@/redux/reducers/userReducer'
import { AssignmentOutlined, HistoryOutlined, LockReset, Person } from '@mui/icons-material'
import { Container, Stack } from '@mui/material'
import { Outlet } from 'react-router-dom'

const LayoutPatient = () => {
	const profileStore = useReduxStore({
		url: ApiUrls.USER.PROFILE,
		selector: (s) => s.user.profile,
		setStore: setProfileStore,
	})

	const cartCountStore = useReduxStore({
		url: ApiUrls.USER.CART,
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

	const footerSections = [
		{
			title: t('footer.medical'),
			links: [
				{ label: t('footer.service'), url: '/service' },
				{ label: t('footer.doctor'), url: '/doctor' },
				{ label: t('footer.specialty'), url: '/specialty' },
			],
		},
		{
			title: t('footer.resources'),
			links: [
				{ label: t('footer.blog'), url: '/blog' },
				{ label: t('footer.medicine'), url: '/medicine' },
			],
		},
		{
			title: t('footer.support'),
			links: [
				{ label: t('footer.contact_us'), url: '/contact' },
				{ label: t('footer.faq'), url: '/faq' },
			],
		},
		{
			title: t('footer.about'),
			links: [
				{ label: t('footer.our_hospital'), url: '/about' },
				{ label: t('footer.career'), url: '/careers' },
				{ label: t('footer.privacy_policy'), url: '/privacy-policy' },
				{ label: t('footer.terms_of_service'), url: '/terms-of-service' },
			],
		},
	]

	return (
		<Stack minHeight='100vh'>
			<Header
				items={items}
				isAuthenticated={true}
				userMenuItems={userMenuItems}
				profile={profileStore.data}
				cartCount={cartCountStore.data}
			/>
			<Container sx={{ flexGrow: 1 }} maxWidth='lg'>
				<Outlet />
			</Container>
			<Footer sections={footerSections} />
		</Stack>
	)
}

export default LayoutPatient
