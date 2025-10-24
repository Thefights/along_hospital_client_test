import PasswordTextField from '@/components/textFields/PasswordTextField'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Box, Button, CircularProgress, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

const RegisterPage = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { values, handleChange } = useForm({
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
	})

	const { loading, submit } = useAxiosSubmit({
		url: ApiUrls.AUTH.REGISTER,
		method: 'POST',
		onSuccess: async () => {
			navigate(routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.RESEND_LINK), { replace: true })
		},
	})

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

			<Box
				component='form'
				onSubmit={(e) => {
					e.preventDefault()
					submit(values, {})
				}}
			>
				<Stack spacing={{ xs: 2, sm: 2.5 }}>
					<ValidationTextField
						name='email'
						label={t('auth.field.email')}
						type='email'
						placeholder={t('auth.register.email_placeholder')}
						value={values.email}
						onChange={handleChange}
						required={false}
					/>
					<ValidationTextField
						name='phone'
						label={t('auth.field.phone')}
						type='phone'
						placeholder={t('auth.register.phone_placeholder')}
						value={values.phone}
						onChange={handleChange}
					/>
					<PasswordTextField
						name='password'
						label={t('auth.field.password')}
						placeholder={t('auth.placeholder.password')}
						value={values.password}
						onChange={handleChange}
					/>
					<PasswordTextField
						name='confirmPassword'
						label={t('auth.field.confirm_password')}
						placeholder={t('auth.placeholder.confirm_password')}
						value={values.confirmPassword}
						onChange={handleChange}
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
