import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setCartStore, setProfileStore } from '@/redux/reducers/patientReducer'
import {
	AssignmentOutlined,
	EventAvailable,
	HistoryOutlined,
	LockReset,
	Person,
} from '@mui/icons-material'
import { Container, Stack } from '@mui/material'
import { Outlet } from 'react-router-dom'

const LayoutPatient = () => {
	const profileStore = useReduxStore({
		url: ApiUrls.USER.PROFILE,
		selector: (s) => s.patient.profile,
		setStore: setProfileStore,
	})

	const cartCountStore = useReduxStore({
		url: ApiUrls.USER.CART,
		selector: (s) => s.patient.cart,
		setStore: setCartStore,
		dataToGet: (cart) => cart?.cartDetails?.length || 0,
	})

	const { t } = useTranslation()
	const items = [
		{ label: t('header.home'), url: '/' },
		{
			label: t('header.service'),
			of: [
				{ label: t('header.medical_service'), url: routeUrls.HOME },
				{ label: t('header.medicine'), url: routeUrls.HOME.MEDICINE },
				{ label: t('header.doctor'), url: routeUrls.HOME.DOCTOR },
				{ label: t('header.specialty'), url: routeUrls.HOME.SPECIALTY },
			],
		},
		{
			label: t('header.booking'),
			of: [
				{
					label: t('header.appointment'),
					url: routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.APPOINTMENT.CREATE),
				},
				{
					label: t('header.video_consultation'),
					url: routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.VIDEO_CONSULTATION),
				},
			],
		},
		{
			label: t('header.more'),
			of: [
				{ label: t('header.blog'), url: routeUrls.HOME.BLOG },
				{ label: t('header.about_us'), url: routeUrls.HOME.ABOUT_US },
			],
		},
		{
			label: t('header.meeting_room'),
			url: routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.APPOINTMENT.JOIN_MEETING_ROOM),
		},
	]

	const userMenuItems = [
		{
			label: t('header.user_menu.profile'),
			url: routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.PROFILE),
			icon: <Person />,
		},
		{
			label: t('header.user_menu.appointments'),
			url: routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.APPOINTMENT.INDEX),
			icon: <EventAvailable />,
		},
		{
			label: t('header.user_menu.medical_history'),
			url: routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.MEDICAL_HISTORY),
			icon: <AssignmentOutlined />,
		},
		{
			label: t('header.user_menu.order_history'),
			url: routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.ORDER_HISTORY),
			icon: <HistoryOutlined />,
		},
		{
			label: t('header.user_menu.change_password'),
			url: routeUrls.BASE_ROUTE.PATIENT(routeUrls.AUTH.CHANGE_PASSWORD),
			icon: <LockReset />,
		},
	]

	const footerSections = [
		{
			title: t('footer.medical'),
			links: [
				{ label: t('footer.service'), url: routeUrls.HOME.MEDICAL_SERVICE },
				{ label: t('footer.doctor'), url: routeUrls.HOME.DOCTOR },
				{ label: t('footer.specialty'), url: routeUrls.HOME.SPECIALTY },
			],
		},
		{
			title: t('footer.resources'),
			links: [
				{ label: t('footer.blog'), url: routeUrls.HOME.BLOG },
				{ label: t('footer.medicine'), url: routeUrls.HOME.MEDICINE },
			],
		},
		{
			title: t('footer.support'),
			links: [
				{ label: t('footer.contact_us'), url: routeUrls.HOME.CONTACT },
				{ label: t('footer.faq'), url: routeUrls.HOME.FAQ },
			],
		},
		{
			title: t('footer.about'),
			links: [
				{ label: t('footer.our_hospital'), url: routeUrls.HOME.ABOUT_US },
				{ label: t('footer.career'), url: routeUrls.HOME.CAREER },
				{ label: t('footer.privacy_policy'), url: routeUrls.HOME.PRIVACY_POLICY },
				{ label: t('footer.terms_of_service'), url: routeUrls.HOME.TERMS_OF_SERVICE },
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
