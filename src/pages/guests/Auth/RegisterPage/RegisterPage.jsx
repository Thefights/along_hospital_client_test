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
						{t('auth.register.check_sms', 'Check your SMS')}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
					>
						{t('auth.register.verify_subtitle', 'We sent a verification link to your phone')}
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
						{t('auth.register.verify_sent', 'Verification link sent via SMS to')}
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
							{t('auth.register.resend_in', 'Resend in')} {countdown} {t('auth.seconds', 'seconds')}
						</Typography>
					)}
				</Alert>

				<Stack spacing={{ xs: 1.5, sm: 2 }}>
					<ValidationTextField
						name='Phone'
						label={t('auth.field.phone', 'Phone')}
						placeholder={t('auth.register.phone_placeholder', 'Enter your phone number')}
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
						{countdown > 0
							? `${t('button.resend_in', 'Resend in')} ${countdown}s`
							: t('auth.register.resend_link', 'Resend verification link')}
					</Button>

					<Box sx={{ textAlign: 'center' }}>
						<Typography
							variant='body2'
							color='text.secondary'
							component='span'
							sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
						>
							{t('auth.register.already_have_account', 'Already have an account?')}{' '}
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
							{t('auth.register.login', 'Login')}
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
					{t('auth.register.title', 'Create account')}
				</Typography>
				<Typography
					variant='body2'
					color='text.secondary'
					sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
				>
					{t('auth.register.subtitle', 'Get started with your free account')}
				</Typography>
			</Box>

			<Box component='form' onSubmit={onSubmit}>
				<Stack spacing={{ xs: 2, sm: 2.5 }}>
					<ValidationTextField
						name='Email'
						label={t('auth.field.email', 'Email')}
						type='email'
						placeholder={t('auth.register.email_placeholder', 'Enter your email address')}
						value={formData.email}
						onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						required={false}
					/>
					<ValidationTextField
						name='Phone'
						label={t('auth.field.phone', 'Phone')}
						type='phone'
						placeholder={t('auth.register.phone_placeholder', 'Enter your phone number')}
						value={formData.phone}
						onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
					/>
					<PasswordTextField
						name='Password'
						label={t('auth.field.password', 'Password')}
						placeholder={t('auth.placeholder.password', 'Please enter your password')}
						value={formData.password}
						onChange={(e) => setFormData({ ...formData, password: e.target.value })}
					/>
					<PasswordTextField
						name='ConfirmPassword'
						label={t('auth.field.confirm_password', 'Confirm Password')}
						placeholder={t('auth.placeholder.confirm_password', 'Please confirm your password')}
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
						{t('auth.register.submit', 'Register')}
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
					{t('auth.register.already_have_account', 'Already have an account?')}{' '}
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
					{t('auth.register.login', 'Login')}
				</Link>
			</Box>
		</>
	)
}

export default RegisterPage
