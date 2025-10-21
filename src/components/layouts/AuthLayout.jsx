import SwitchLanguageButton from '@/components/buttons/SwitchLanguageButton'
import SwitchThemeButton from '@/components/buttons/SwitchThemeButton'
import useTranslation from '@/hooks/useTranslation'
import { Box, Container, Stack, Typography, useTheme } from '@mui/material'

const AuthLayout = ({ children, showHero = true }) => {
	const theme = useTheme()
	const { t } = useTranslation()

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				bgcolor: 'background.default',
				flexDirection: { xs: 'column', lg: 'row' },
			}}
		>
			{showHero && (
				<Box
					sx={{
						display: { xs: 'none', md: 'flex' },
						width: { xs: '100%', md: '100%', lg: '50%' },
						minHeight: { xs: '200px', md: '300px', lg: 'auto' },
						background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #06B6D4 100%)',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						p: { xs: 3, sm: 4, md: 6 },
						position: 'relative',
						overflow: 'hidden',
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							inset: 0,
							opacity: 0.2,
						}}
					>
						<svg width='100%' height='100%' viewBox='0 0 400 400' fill='none'>
							<circle cx='200' cy='200' r='150' stroke='rgba(255,255,255,0.1)' strokeWidth='2' />
							<path
								d='M 150 200 Q 200 150 250 200'
								stroke='rgba(255,255,255,0.1)'
								strokeWidth='2'
								fill='none'
							/>
						</svg>
					</Box>

					<Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white' }}>
						<Typography
							variant='h2'
							sx={{
								fontWeight: 700,
								mb: { xs: 2, md: 3 },
								fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
							}}
						>
							Telemedicine
						</Typography>
						<Typography
							variant='h6'
							sx={{
								maxWidth: 500,
								opacity: 0.9,
								lineHeight: 1.6,
								fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
								px: { xs: 2, sm: 0 },
							}}
						>
							{t(
								'auth.hero.subtitle',
								'Connecting patients and doctors through secure, convenient telemedicine'
							)}
						</Typography>
					</Box>

					<Box
						sx={{
							position: 'absolute',
							bottom: 48,
							right: 48,
							opacity: 0.3,
						}}
					>
						<svg
							width='128'
							height='128'
							viewBox='0 0 24 24'
							fill='none'
							stroke='white'
							strokeWidth='1.5'
						>
							<path d='M9 12c0-1.657 1.343-3 3-3s3 1.343 3 3' />
							<circle cx='12' cy='12' r='1' fill='white' />
							<path d='M12 13v8' />
							<path d='M9 21h6' />
						</svg>
					</Box>
				</Box>
			)}

			<Box
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					p: { xs: 2, sm: 3, md: 4 },
					position: 'relative',
					minHeight: { xs: 'calc(100vh - 200px)', md: 'calc(100vh - 300px)', lg: '100vh' },
				}}
			>
				<Stack
					direction='row'
					spacing={1.5}
					sx={{
						position: 'absolute',
						top: { xs: 12, sm: 16, md: 24 },
						right: { xs: 12, sm: 16, md: 24 },
					}}
				>
					<SwitchLanguageButton />
					<SwitchThemeButton />
				</Stack>

				<Container
					maxWidth='sm'
					sx={{
						width: '100%',
						maxWidth: { xs: '100%', sm: '500px', md: '600px' },
					}}
				>
					<Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
						<Stack direction='row' spacing={{ xs: 1.5, sm: 2 }} alignItems='center' sx={{ mb: 2 }}>
							<Box
								sx={{
									width: { xs: 36, sm: 40 },
									height: { xs: 36, sm: 40 },
									borderRadius: 2,
									bgcolor: 'primary.main',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<svg
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='white'
									style={{ width: '60%', height: '60%' }}
								>
									<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z' />
								</svg>
							</Box>
							<Box>
								<Typography
									variant='h5'
									sx={{
										fontWeight: 700,
										fontSize: { xs: '1.2rem', sm: '1.5rem' },
									}}
								>
									Telemedicine
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
								>
									{t('auth.hero.tagline', 'Your healthcare, anywhere')}
								</Typography>
							</Box>
						</Stack>
					</Box>

					<Box
						sx={{
							bgcolor: 'background.paper',
							border: 1,
							borderColor: 'divider',
							borderRadius: { xs: 3, sm: 4 },
							boxShadow: theme.shadows[3],
							p: { xs: 2.5, sm: 3, md: 4 },
						}}
					>
						{children}
					</Box>
				</Container>
			</Box>
		</Box>
	)
}

export default AuthLayout
