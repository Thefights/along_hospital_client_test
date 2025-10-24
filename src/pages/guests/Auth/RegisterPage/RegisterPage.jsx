import PasswordTextField from '@/components/textFields/PasswordTextField'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useTranslation from '@/hooks/useTranslation'
import { Alert, Box, Button, CircularProgress, Link, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const RegisterPage = () => {
	const { t } = useTranslation()
	const [formData, setFormData] = useState({
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
	})
	const [showVerify, setShowVerify] = useState(false)
	const [countdown, setCountdown] = useState(0)

	const { loading, submit } = useAxiosSubmit({
		url: ApiUrls.AUTH.REGISTER,
		method: 'POST',
		onSuccess: async () => {
			setShowVerify(true)
			setCountdown(60)
		},
	})

	const onSubmit = async (e) => {
		e.preventDefault()

		const fd = new FormData()
		fd.set('Email', formData.email)
		fd.set('Phone', formData.phone)
		fd.set('Password', formData.password)
		fd.set('ConfirmPassword', formData.confirmPassword)
		await submit(fd)
	}

	useEffect(() => {
		if (!showVerify || countdown <= 0) return
		const tId = setTimeout(() => setCountdown((c) => c - 1), 1000)
		return () => clearTimeout(tId)
	}, [showVerify, countdown])

	const { loading: resendLoading, submit: resend } = useAxiosSubmit({
		url: ApiUrls.AUTH.REGISTER_RESEND_LINK,
		method: 'POST',
	})

	const onResend = async () => {
		const fd = new FormData()
		fd.set('Phone', formData.phone)
		await resend(fd)
		setCountdown(60)
	}

	if (showVerify) {
		return (
			<>
				<Box sx={{ mb: { xs: 2, sm: 3 } }}>
					<Typography
						variant='h4'
						sx={{
							mb: 1,
							fontWeight: 700,
							fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
						}}
					>
						{t('auth.register.check_sms')}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
					>
						{t('auth.register.verify_subtitle')}
					</Typography>
				</Box>

				<Alert
					severity='success'
					sx={{
						mb: { xs: 2, sm: 3 },
						borderRadius: 2,
						bgcolor: 'primary.softBg',
						border: 1,
						borderColor: 'primary.softBorder',
					}}
				>
					<Typography variant='body2' sx={{ mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
						{t('auth.register.verify_sent')}
					</Typography>
					<Typography
						variant='body2'
						sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
					>
						{formData.phone}
					</Typography>
					{countdown > 0 && (
						<Typography
							variant='caption'
							color='text.secondary'
							sx={{
								mt: 1,
								display: 'block',
								fontSize: { xs: '0.7rem', sm: '0.75rem' },
							}}
						>
							{t('auth.register.resend_in')} {countdown} {t('auth.seconds')}
						</Typography>
					)}
				</Alert>

				<Stack spacing={{ xs: 1.5, sm: 2 }}>
					<ValidationTextField
						name='Phone'
						label={t('auth.field.phone')}
						placeholder={t('auth.register.phone_placeholder')}
						type='phone'
						value={formData.phone}
						onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
						required
					/>

					<Button
						variant='outlined'
						size='large'
						onClick={onResend}
						disabled={resendLoading || countdown > 0}
						sx={{
							py: { xs: 1.2, sm: 1.5 },
							borderRadius: 2,
							textTransform: 'none',
							fontSize: { xs: '0.9rem', sm: '1rem' },
							fontWeight: 600,
						}}
					>
						{countdown > 0 ? `${t('button.resend_in')} ${countdown}s` : t('auth.register.resend_link')}
					</Button>

					<Box sx={{ textAlign: 'center' }}>
						<Typography
							variant='body2'
							color='text.secondary'
							component='span'
							sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
						>
							{t('auth.register.already_have_account')}{' '}
						</Typography>
						<Link
							component={RouterLink}
							to={routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.LOGIN)}
							variant='body2'
							sx={{
								fontWeight: 600,
								textDecoration: 'none',
								fontSize: { xs: '0.8rem', sm: '0.875rem' },
								'&:hover': { textDecoration: 'underline' },
							}}
						>
							{t('auth.register.login')}
						</Link>
					</Box>
				</Stack>
			</>
		)
	}

	return (
		<>
			<Box sx={{ mb: { xs: 2, sm: 3 } }}>
				<Typography
					variant='h4'
					sx={{
						mb: 1,
						fontWeight: 700,
						fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
					}}
				>
					{t('auth.register.title')}
				</Typography>
				<Typography
					variant='body2'
					color='text.secondary'
					sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
				>
					{t('auth.register.subtitle')}
				</Typography>
			</Box>

			<Box component='form' onSubmit={onSubmit}>
				<Stack spacing={{ xs: 2, sm: 2.5 }}>
					<ValidationTextField
						name='Email'
						label={t('auth.field.email')}
						type='email'
						placeholder={t('auth.register.email_placeholder')}
						value={formData.email}
						onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						required={false}
					/>
					<ValidationTextField
						name='Phone'
						label={t('auth.field.phone')}
						type='phone'
						placeholder={t('auth.register.phone_placeholder')}
						value={formData.phone}
						onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
					/>
					<PasswordTextField
						name='Password'
						label={t('auth.field.password')}
						placeholder={t('auth.placeholder.password')}
						value={formData.password}
						onChange={(e) => setFormData({ ...formData, password: e.target.value })}
					/>
					<PasswordTextField
						name='ConfirmPassword'
						label={t('auth.field.confirm_password')}
						placeholder={t('auth.placeholder.confirm_password')}
						value={formData.confirmPassword}
						onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
					/>

					<Button
						type='submit'
						variant='contained'
						size='large'
						disabled={loading}
						startIcon={loading && <CircularProgress size={20} color='inherit' />}
						sx={{
							py: { xs: 1.2, sm: 1.5 },
							borderRadius: 2,
							textTransform: 'none',
							fontSize: { xs: '0.9rem', sm: '1rem' },
							fontWeight: 600,
							bgcolor: 'primary.main',
							color: 'primary.contrastText',
							'&:hover': {
								bgcolor: 'primary.dark',
							},
							'&.Mui-disabled': {
								bgcolor: 'action.disabledBackground',
								color: 'text.disabled',
							},
						}}
					>
						{t('auth.register.submit')}
					</Button>
				</Stack>
			</Box>

			<Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: 'center' }}>
				<Typography
					variant='body2'
					color='text.secondary'
					component='span'
					sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
				>
					{t('auth.register.already_have_account')}{' '}
				</Typography>
				<Link
					component={RouterLink}
					to={routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.LOGIN)}
					variant='body2'
					sx={{
						fontWeight: 600,
						textDecoration: 'none',
						fontSize: { xs: '0.8rem', sm: '0.875rem' },
						'&:hover': { textDecoration: 'underline' },
					}}
				>
					{t('auth.register.login')}
				</Link>
			</Box>
		</>
	)
}

export default RegisterPage
