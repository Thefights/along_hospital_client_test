import { getEnv } from '@/utils/commons'
import { Box, ButtonBase, Typography } from '@mui/material'

export default function SystemLogoAndName({ onClick, onlyShowIcon = false }) {
	return (
		<>
			<ButtonBase
				onClick={onClick}
				sx={{
					minWidth: 40,
					height: 40,
					borderRadius: '50%',
					overflow: 'hidden',
					bgcolor: 'background.paper',
					boxShadow: 1,
				}}
			>
				<Box component='svg' viewBox='0 0 100 100' role='img' sx={{ width: '100%', height: '100%' }}>
					<circle cx='50' cy='50' r='48' fill='#e3f2fd' stroke='#90caf9' strokeWidth='4' />
					<rect x='44' y='22' width='12' height='56' rx='3' fill='#1976d2' />
					<rect x='22' y='44' width='56' height='12' rx='3' fill='#1976d2' />
				</Box>
			</ButtonBase>
			{!onlyShowIcon && (
				<Typography
					variant='h6'
					component='div'
					noWrap
					textOverflow={'ellipsis'}
					sx={{ ml: 1, userSelect: 'none', color: 'primary.dark' }}
				>
					{getEnv('VITE_SYSTEM_NAME')}
				</Typography>
			)}
		</>
	)
}
