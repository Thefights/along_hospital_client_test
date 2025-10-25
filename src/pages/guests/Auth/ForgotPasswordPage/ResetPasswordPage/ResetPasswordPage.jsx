import PasswordTextField from '@/components/textFields/PasswordTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { compare } from '@/utils/validateUtil'
import { Box, Button, CircularProgress, Link, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'

const ResetPasswordPage = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [params] = useSearchParams()
	const token = useMemo(() => params.get('token') || '', [params])
	const [submitted, setSubmitted] = useState(false)
	const { values, handleChange, registerRef, validateAll } = useForm({
		newPassword: '',
		confirmPassword: '',
	})
	const [success, setSuccess] = useState(false)

	useEffect(() => {
		if (!token) {
			navigate(routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.FORGOT_PASSWORD), { replace: true })
		}
	}, [token, navigate])

	const { loading, submit } = useAxiosSubmit({
		url: ApiUrls.AUTH.FORGOT_PASSWORD_RESET,
		params: { token },
		method: 'POST',
		onSuccess: async () => {
			setSuccess(true)
			setTimeout(() => {
				navigate(routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.LOGIN), { replace: true })
			}, 2000)
		},
	})

	const onSubmit = async (e) => {
		e.preventDefault()
		setSubmitted(true)
		const ok = validateAll()
		if (!ok) return
		await submit(values)
	}

	if (success) {
		return (
			<>
				<Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
					<Box
						sx={{
							fontSize: { xs: '3rem', sm: '4rem' },
							mb: 2,
							color: 'success.main',
						}}
					>
						✓
					</Box>
					<Typography
						variant='h6'
						sx={{
							fontWeight: 600,
							mb: 1,
							fontSize: { xs: '1rem', sm: '1.25rem' },
						}}
					>
						{t('auth.reset.success')}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
					>
						{t('auth.reset.redirecting')}
					</Typography>
				</Box>
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
					{t('auth.reset.title')}
				</Typography>
				<Typography
					variant='body2'
					color='text.secondary'
					sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
				>
					{t('auth.reset.subtitle')}
				</Typography>
			</Box>

			<Box component='form' onSubmit={onSubmit}>
				<Stack spacing={{ xs: 2, sm: 2.5 }}>
					<PasswordTextField
						name='newPassword'
						label={t('auth.field.new_password')}
						placeholder={t('auth.placeholder.new_password')}
						value={values.newPassword}
						onChange={handleChange}
						ref={registerRef('newPassword')}
						submitted={submitted}
					/>
					<PasswordTextField
						name='confirmPassword'
						label={t('auth.field.confirm_password')}
						placeholder={t('auth.placeholder.confirm_password')}
						value={values.confirmPassword}
						onChange={handleChange}
						ref={registerRef('confirmPassword')}
						submitted={submitted}
						validate={[compare(values.newPassword, t('error.password_not_match'))]}
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
						{t('button.submit')}
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
					{t('auth.reset.no_account')}{' '}
				</Typography>
				<Link
					component={RouterLink}
					to={routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.REGISTER)}
					variant='body2'
					sx={{
						fontWeight: 600,
						textDecoration: 'none',
						fontSize: { xs: '0.8rem', sm: '0.875rem' },
						'&:hover': { textDecoration: 'underline' },
					}}
				>
					{t('auth.register.title')}
				</Link>
			</Box>
		</>
	)
}

export default ResetPasswordPage
