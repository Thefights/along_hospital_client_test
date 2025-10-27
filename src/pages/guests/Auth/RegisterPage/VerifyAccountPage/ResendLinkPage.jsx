import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Box, Button, CircularProgress, Link, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const ResendLinkPage = () => {
	const { t } = useTranslation()
	const { values, handleChange, setField, registerRef, validateAll } = useForm({
		phone: '',
	})
	const { renderField } = useFieldRenderer(values, setField, handleChange, registerRef, false)
	const [resendTimer, setResendTimer] = useState(0)

	const fields = useMemo(
		() => [
			{
				key: 'phone',
				title: t('auth.field.phone'),
				type: 'phone',
				props: { placeholder: t('auth.placeholder.phone') },
			},
		],
		[t]
	)

	const { loading, submit } = useAxiosSubmit({
		url: ApiUrls.AUTH.REGISTER_RESEND_LINK,
		method: 'POST',
		onSuccess: () => {
			setResendTimer(60)
		},
	})

	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
			return () => clearTimeout(timer)
		}
	}, [resendTimer])

	const handleResendLink = async () => {
		const ok = validateAll()
		if (!ok) return
		await submit({ phone: values.phone })
	}

	return (
		<>
			<Box sx={{ mb: 3 }}>
				<Typography variant='h4' sx={{ mb: 1, fontWeight: 700 }}>
					{t('auth.resend.title')}
				</Typography>
				<Typography variant='body2' color='text.secondary'>
					{t('auth.resend.subtitle')}
				</Typography>
			</Box>

			<Stack spacing={3}>
				<Stack spacing={2}>
					{fields.map(renderField)}
					{resendTimer > 0 ? (
						<Button
							variant='outlined'
							size='large'
							fullWidth
							disabled
							sx={{
								py: 1.5,
								borderRadius: 2,
								textTransform: 'none',
								fontSize: '1rem',
								fontWeight: 600,
							}}
						>
							{t('auth.resend.resend_in')} {resendTimer} {t('auth.seconds')}
						</Button>
					) : (
						<Button
							variant='contained'
							size='large'
							fullWidth
							onClick={handleResendLink}
							disabled={loading}
							startIcon={loading && <CircularProgress size={20} color='inherit' />}
							sx={{
								py: 1.5,
								borderRadius: 2,
								textTransform: 'none',
								fontSize: '1rem',
								fontWeight: 600,
								bgcolor: 'primary.main',
								color: 'primary.contrastText',
								'&:hover': {
									bgcolor: 'primary.dark',
								},
							}}
						>
							{t('auth.resend.button')}
						</Button>
					)}
				</Stack>

				<Box sx={{ textAlign: 'center' }}>
					<Typography variant='body2' color='text.secondary' component='span'>
						{t('auth.resend.already_have_account')}{' '}
					</Typography>
					<Link
						component={RouterLink}
						to={routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.LOGIN)}
						variant='body2'
						sx={{
							fontWeight: 600,
							textDecoration: 'none',
							'&:hover': { textDecoration: 'underline' },
						}}
					>
						{t('auth.login.submit')}
					</Link>
				</Box>
			</Stack>
		</>
	)
}

export default ResendLinkPage
