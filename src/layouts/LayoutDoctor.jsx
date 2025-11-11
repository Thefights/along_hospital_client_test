import { default as DashboardDrawer } from '@/components/layouts/DashboardDrawer'
import DashboardHeader from '@/components/layouts/DashboardHeader'
import { routeUrls } from '@/configs/routeUrls'
import { default as useAuth } from '@/hooks/useAuth'
import { default as useReduxStore } from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setProfileStore } from '@/redux/reducers/patientReducer'
import {
	DashboardRounded,
	DescriptionRounded,
	EventAvailableRounded,
	EventRounded,
	Person,
	SettingsRounded,
	VideocamRounded,
} from '@mui/icons-material'
import { Container, Stack } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const LayoutDoctor = () => {
	const [collapsedDrawer, setCollapsedDrawer] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const { logout } = useAuth()
	const { t } = useTranslation()

	const profileStore = useReduxStore({
		selector: (s) => s.patient.profile,
		setStore: setProfileStore,
	})

	const sections = [
		{
			items: [
				{
					key: 'dashboard',
					label: 'Dashboard',
					icon: <DashboardRounded />,
					url: routeUrls.BASE_ROUTE.DOCTOR(),
				},
			],
		},
		{
			title: 'Work',
			items: [
				{
					key: 'appointment',
					label: 'Appointments',
					icon: <EventAvailableRounded />,
					url: routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.APPOINTMENT_MANAGEMENT),
				},
				{
					key: 'medical-history',
					label: 'Medical History',
					icon: <DescriptionRounded />,
					url: routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.MEDICAL_HISTORY.INDEX),
				},
			],
		},
		{
			title: 'Personal',
			items: [
				{
					key: 'attendance',
					label: 'Attendance',
					icon: <EventRounded />,
					url: routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.ATTENDANCE),
				},
			],
		},
		{
			title: 'System',
			items: [
				{ key: 'settings', label: 'Settings', icon: <SettingsRounded />, url: '/settings' },
				{
					key: 'join-tele-room',
					label: 'Join Meeting Room',
					icon: <VideocamRounded />,
					url: routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.APPOINTMENT.JOIN_MEETING_ROOM),
				},
			],
		},
	]

	const userMenuItems = [
		{
			label: t('header.user_menu.profile'),
			url: routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.PROFILE),
			icon: <Person />,
		},
	]

	return (
		<Stack direction={'row'}>
			<DashboardDrawer
				sections={sections}
				collapsed={collapsedDrawer}
				onToggleCollapse={() => setCollapsedDrawer((prev) => !prev)}
				mobileOpen={mobileOpen}
				onMobileClose={() => setMobileOpen(false)}
			/>
			<Stack flexGrow={1}>
				<DashboardHeader
					profile={profileStore.data}
					onLogout={logout}
					onOpenDrawer={() => setMobileOpen(true)}
					userMenuItems={userMenuItems}
				/>
				<Container sx={{ flexGrow: 1, py: 3 }} maxWidth='xl'>
					<Outlet />
				</Container>
			</Stack>
		</Stack>
	)
}

export default LayoutDoctor
