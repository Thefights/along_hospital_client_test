import SearchBar from '@/components/generals/SearchBar'
import { AppBar, Box, Stack, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginButton from './buttons/LoginButton'
import MobileMenuButton from './buttons/MobileMenuButton'
import LanguageSwitcher from './commons/LanguageSwitcher'
import NavItem from './commons/NavItem'
import SystemLogoAndName from './commons/SystemLogoAndName'
import MobileDrawer from './MobileDrawer'

export default function HeaderGuest({ items = [] }) {
	const navigate = useNavigate()
	const [openDrawer, setOpenDrawer] = useState(false)
	const theme = useTheme()
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
						<SystemLogoAndName onClick={() => navigate('/')} />

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
						<LanguageSwitcher />
						<LoginButton onClick={() => navigate('/login')} />
						{isDownMd && <MobileMenuButton onOpen={() => setOpenDrawer(true)} />}
					</Stack>
				</Toolbar>
			</AppBar>
			<MobileDrawer items={items} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
		</>
	)
}

/* -------------------------------------------
Example usage (remove or adjust in your app):
----------------------------------------------
const items = [
  { label: 'Home', url: '/' },
  { label: 'Medicine', url: '/medicine' },
  { label: 'Medical Service', url: '/service', of: [
      { label: 'General Checkup', url: '/service/checkup' },
      { label: 'Pediatrics', url: '/service/pediatrics' },
  ]},
  { label: 'Doctor', url: '/doctor' },
  { label: 'Specialty', url: '/specialty' },
  { label: 'Blog', url: '/blog' },
];
// <HeaderGuest items={items} />
*/
