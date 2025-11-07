import ChatBotFloatingButton from '@/components/layouts/chatbot/ChatBotFloatingButton'
import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import { routeUrls } from '@/configs/routeUrls'
import useTranslation from '@/hooks/useTranslation'
import { Container, Stack } from '@mui/material'
import { Outlet } from 'react-router-dom'

const LayoutGuest = () => {
	const { t } = useTranslation()
	const items = [
		{ label: t('header.home'), url: '/' },
		{
			label: t('header.service'),
			of: [
				{ label: t('header.medical_service'), url: routeUrls.HOME.MEDICAL_SERVICE },
				{ label: t('header.medicine'), url: routeUrls.HOME.MEDICINE },
				{ label: t('header.doctor'), url: routeUrls.HOME.DOCTOR },
			],
		},
		{ label: t('header.specialty'), url: routeUrls.HOME.SPECIALTY },
		{ label: t('header.blog'), url: routeUrls.HOME.BLOG },
		{ label: t('header.about_us'), url: routeUrls.HOME.ABOUT_US },
	]

	const footerSections = [
		{
			title: t('footer.medical'),
			links: [
				{ label: t('footer.medical_service'), url: routeUrls.HOME.MEDICAL_SERVICE },
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
			<Header items={items} />
			<Container sx={{ flexGrow: 1 }} maxWidth='lg'>
				<Outlet />
			</Container>
			<ChatBotFloatingButton />
			<Footer sections={footerSections} />
		</Stack>
	)
}

export default LayoutGuest
