import { Facebook, LinkedIn, Twitter, YouTube } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import SystemLogoAndName from '../headers/SystemLogoAndName'

const FooterBottom = () => {
	const theme = useTheme()
	const navigate = useNavigate()

	const iconSx = {
		color: 'primary.contrastText',
		opacity: 0.9,
		'&:hover': { opacity: 1 },
		'&:focus-visible': {
			outline: `2px solid ${alpha(theme.palette.primary.contrastText, 0.8)}`,
			outlineOffset: 2,
		},
	}

	return (
		<Stack
			direction={{ xs: 'column', sm: 'row' }}
			alignItems='center'
			justifyContent='space-between'
			spacing={2}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<SystemLogoAndName onClick={() => navigate('/')} />
			</Box>

			<Typography
				variant='caption'
				sx={{ color: 'primary.contrastText', textAlign: 'center', flex: 1 }}
			>
				© 2025 Medicare Hospital. All rights reserved.
			</Typography>

			<Stack direction='row' spacing={0.5} alignItems='center'>
				<IconButton aria-label='Visit our Facebook' size='small' sx={iconSx}>
					<Facebook fontSize='inherit' />
				</IconButton>
				<IconButton aria-label='Visit our X / Twitter' size='small' sx={iconSx}>
					<Twitter fontSize='inherit' />
				</IconButton>
				<IconButton aria-label='Visit our LinkedIn' size='small' sx={iconSx}>
					<LinkedIn fontSize='inherit' />
				</IconButton>
				<IconButton aria-label='Visit our YouTube' size='small' sx={iconSx}>
					<YouTube fontSize='inherit' />
				</IconButton>
			</Stack>
		</Stack>
	)
}

export default FooterBottom
