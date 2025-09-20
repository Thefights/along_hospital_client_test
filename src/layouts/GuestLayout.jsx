import Footer from '@/components/layouts/Footer'
import HeaderGuest from '@/components/layouts/HeaderGuest'
import useTranslation from '@/hooks/useTranslation'
import { Outlet } from 'react-router-dom'

const GuestLayout = () => {
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
	return (
		<>
			<HeaderGuest items={items} />
			<Outlet />
			<Footer />
		</>
	)
}

export default GuestLayout
