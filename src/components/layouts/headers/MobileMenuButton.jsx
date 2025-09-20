import { Menu } from '@mui/icons-material'
import { IconButton } from '@mui/material'

export default function MobileMenuButton({ onOpen }) {
	return (
		<IconButton
			onClick={onOpen}
			sx={{
				display: 'inline-flex',
				border: '1px solid',
				borderColor: 'divider',
				bgcolor: 'background.default',
			}}
		>
			<Menu />
		</IconButton>
	)
}
