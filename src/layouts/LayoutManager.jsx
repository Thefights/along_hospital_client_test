import DashboardDrawer from '@/components/layouts/DashboardDrawer'
import { default as DashboardHeader } from '@/components/layouts/DashboardHeader'
import useAuth from '@/hooks/useAuth'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setProfileStore } from '@/redux/reducers/userReducer'
import {
	DashboardRounded,
	Inventory2Rounded,
	LocalHospitalRounded,
	PeopleAltRounded,
	Person,
	SettingsRounded,
} from '@mui/icons-material'
import { Container, Stack } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const LayoutManager = () => {
	const [collapsedDrawer, setCollapsedDrawer] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const { logout } = useAuth()
	const { t } = useTranslation()

	const profileStore = useReduxStore({
		url: '/profile',
		selector: (s) => s.user.profile,
		setStore: setProfileStore,
	})

	const sections = [
		{
			title: 'Resource',
			items: [
				{ key: 'dashboard', label: 'Dashboard', icon: <DashboardRounded />, url: '/admin' },
				{
					key: 'staff',
					label: 'Staff',
					icon: <PeopleAltRounded />,
					of: [
						{ key: 'doctors', label: 'Doctors', icon: <LocalHospitalRounded />, url: '/admin/doctors' },
						{ key: 'nurses', label: 'Nurses', icon: <PeopleAltRounded />, url: '/admin/nurses' },
					],
				},
				{
					key: 'inventory',
					label: 'Inventory',
					icon: <Inventory2Rounded />,
					of: [
						{
							key: 'medicines',
							label: 'Medicines',
							icon: <Inventory2Rounded />,
							url: '/admin/medicines',
						},
						{
							key: 'supplies',
							label: 'Medical Supplies',
							icon: <Inventory2Rounded />,
							url: '/admin/supplies',
						},
					],
				},
			],
		},
		{
			title: 'System',
			items: [
				{ key: 'settings', label: 'Settings', icon: <SettingsRounded />, url: '/admin/settings' },
			],
		},
	]

	const userMenuItems = [{ label: t('header.user_menu.profile'), url: '/profile', icon: <Person /> }]

	return (
		<Stack direction={'row'}>
			<DashboardDrawer
				sections={sections}
				collapsed={collapsedDrawer}
				onToggleCollapse={() => setCollapsedDrawer((prev) => !prev)}
				mobileOpen={mobileOpen}
				onMobileOpen={() => setMobileOpen(true)}
				onMobileClose={() => setMobileOpen(false)}
				currentPath='/admin'
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

export default LayoutManager
