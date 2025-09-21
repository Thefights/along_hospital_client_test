import useTranslation from '@/hooks/useTranslation'
import { Login } from '@mui/icons-material'
import { Box, ButtonBase, Stack } from '@mui/material'

export default function LoginButton({ onClick }) {
	const { t } = useTranslation()

	return (
		<ButtonBase
			onClick={onClick}
			sx={{
				px: 2.5,
				py: 1,
				borderRadius: 999,
				boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
				bgcolor: 'primary.main',
				border: '1px solid',
				borderColor: 'divider',
				fontWeight: 600,
				fontSize: 14,
				':focus-visible': { outline: '3px solid', outlineColor: 'primary.light' },
			}}
		>
			<Stack direction='row' alignItems='center' gap={1} color={'primary.contrastText'}>
				<Box
					component='span'
					aria-hidden='true'
					sx={{
						width: 8,
						height: 8,
						borderRadius: '50%',
						bgcolor: 'primary.contrastText',
						boxShadow: '0 0 10px 3px rgba(255, 255, 255, 0.12)',
					}}
				/>
				<span>{t('button.login')}</span>
				<Login fontSize='small' />
			</Stack>
		</ButtonBase>
	)
}
