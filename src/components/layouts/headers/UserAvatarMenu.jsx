import useTranslation from '@/hooks/useTranslation'
import { ArrowDropDown, LogoutOutlined, SettingsOutlined } from '@mui/icons-material'
import {
	Avatar,
	Box,
	ButtonBase,
	Divider,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Popover,
	Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UserAvatarMenu = ({ patient, items = [], onLogout }) => {
	const [open, setOpen] = useState(false)
	const anchorRef = useRef(null)
	const listRefs = useRef([])
	const navigate = useNavigate()
	const { t } = useTranslation()

	const name = patient?.name || 'Patient Name'
	const email = patient?.email || 'patient@example.com'
	const avatarUrl = patient?.avatarUrl
	const initials = name
		.split(' ')
		.map((p) => p[0])
		.join('')
		.slice(0, 2)
		.toUpperCase()

	useEffect(() => {
		if (!open) listRefs.current = []
	}, [open])

	return (
		<>
			<ButtonBase
				ref={anchorRef}
				onClick={() => setOpen((o) => !o)}
				sx={{
					borderRadius: 999,
					border: '1px solid',
					borderColor: 'grey[300]',
					pl: 0.5,
					pr: 1,
					py: 0.25,
					gap: 1,
					bgcolor: 'common.white',
				}}
			>
				<Avatar
					src={avatarUrl}
					alt={name}
					sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'primary.contrastText' }}
				>
					{!avatarUrl && initials}
				</Avatar>
				<ArrowDropDown fontSize='small' />
			</ButtonBase>

			<Popover
				open={open}
				onClose={() => setOpen(false)}
				anchorEl={anchorRef.current}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				slotProps={{ paper: { sx: { mt: 1, borderRadius: 2, width: 300, maxWidth: '90vw' } } }}
			>
				<Box sx={{ p: 2, display: 'flex', gap: 1.5, alignItems: 'center' }}>
					<Avatar
						src={avatarUrl}
						alt={name}
						sx={{ width: 40, height: 40, bgcolor: 'primary.main', color: 'primary.contrastText' }}
					>
						{!avatarUrl && initials}
					</Avatar>
					<Box sx={{ minWidth: 0 }}>
						<Typography variant='subtitle2' sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
							{name}
						</Typography>
						<Typography variant='body2' color='text.secondary' noWrap>
							{email}
						</Typography>
					</Box>
				</Box>
				<Divider />
				<List role='menu' dense sx={{ py: 0.5 }}>
					{items.map((item, i) => (
						<ListItemButton
							key={item.label}
							role='menuitem'
							ref={(el) => (listRefs.current[i] = el)}
							onClick={() => {
								setOpen(false)
								navigate(item.url)
							}}
						>
							{item.icon ? <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon> : null}
							<ListItemText primary={item.label} />
						</ListItemButton>
					))}
				</List>
				<Divider />
				<List dense sx={{ py: 0.5 }}>
					<ListItemButton
						onClick={() => {
							setOpen(false)
							navigate('/settings')
						}}
					>
						<ListItemIcon sx={{ minWidth: 36 }}>
							<SettingsOutlined />
						</ListItemIcon>
						<ListItemText primary={t('header.user_menu.setting')} />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							setOpen(false)
							if (onLogout) onLogout()
							else navigate('/logout')
						}}
					>
						<ListItemIcon sx={{ minWidth: 36 }}>
							<LogoutOutlined />
						</ListItemIcon>
						<ListItemText primary={t('header.user_menu.logout')} />
					</ListItemButton>
				</List>
			</Popover>
		</>
	)
}

export default UserAvatarMenu
