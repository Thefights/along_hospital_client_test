import SearchBar from '@/components/generals/SearchBar'
import useAuth from '@/hooks/useAuth'
import { AppBar, Box, Stack, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppointmentButton from './buttons/AppointmentButton'
import CartButton from './buttons/CartButton'
import LoginButton from './buttons/LoginButton'
import MobileMenuButton from './buttons/MobileMenuButton'
import LanguageSwitcher from './commons/LanguageSwitcher'
import SystemLogoAndName from './commons/SystemLogoAndName'
import ThemeSwitcher from './commons/ThemeSwitcher'
import UserAvatarMenu from './commons/UserAvatarMenu'
import MobileDrawer from './MobileDrawer'
import NavItem from './navItems/NavItem'

const Header = ({
	items = [],
	isAuthenticated = false,
	userMenuItems = [],
	profile = {},
	cartCount = 0,
}) => {
	const navigate = useNavigate()
	const [openDrawer, setOpenDrawer] = useState(false)
	const { logout } = useAuth()
	const theme = useTheme()

	const isDownSm = useMediaQuery(theme.breakpoints.down('sm'))
	const isDownMd = useMediaQuery(theme.breakpoints.down('md'))
	const isDownLg = useMediaQuery(theme.breakpoints.down('lg'))

	return (
		<>
			<AppBar
				position='sticky'
				color='transparent'
				elevation={0}
				sx={{
					backdropFilter: 'saturate(180%) blur(8px)',
					bgcolor: 'rgba(255,255,255,0.6)',
					borderBottom: '1px solid',
					borderColor: 'divider',
				}}
			>
				<Toolbar sx={{ minHeight: 72 }}>
					<Stack direction='row' alignItems='center' spacing={2} sx={{ flex: 1 }}>
						<SystemLogoAndName onClick={() => navigate('/')} onlyShowIcon={isDownSm} />

						{!isDownMd && (
							<Stack direction='row' spacing={0.5} sx={{ display: 'flex', ml: 2 }} role='menubar'>
								{items.map((item) => (
									<NavItem key={item.label} label={item.label} url={item.url} of={item.of} />
								))}
							</Stack>
						)}
					</Stack>

					<Stack direction='row' alignItems='center' spacing={1.5}>
						{!isDownLg && (
							<Box sx={{ minWidth: 260 }}>
								<SearchBar />
							</Box>
						)}
						<ThemeSwitcher />
						<LanguageSwitcher />
						{!isAuthenticated ? (
							<LoginButton onClick={() => navigate('/login')} />
						) : (
							<>
								<CartButton count={cartCount} onClick={() => navigate('/cart')} />
								<AppointmentButton onClick={() => navigate('/appointment')} />
								<UserAvatarMenu items={userMenuItems} profile={profile} onLogout={logout} />
							</>
						)}
						{isDownMd && <MobileMenuButton onOpen={() => setOpenDrawer(true)} />}
					</Stack>
				</Toolbar>
			</AppBar>
			<MobileDrawer items={items} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
		</>
	)
}

export default Header
