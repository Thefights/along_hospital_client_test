import ValidationTextField from '@/components/textFields/ValidationTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useTranslation from '@/hooks/useTranslation'
import { Alert, Box, Button, CircularProgress, Link, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'

const ResendLinkPage = () => {
	const { t } = useTranslation()
	const [params] = useSearchParams()
	const phoneFromUrl = params.get('phone') || ''
	const [phone, setPhone] = useState(phoneFromUrl)
	const [editingPhone, setEditingPhone] = useState(false)
	const [resendTimer, setResendTimer] = useState(0)

	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
			return () => clearTimeout(timer)
		}
	}, [resendTimer])

	const { loading, submit, error } = useAxiosSubmit({
		url: ApiUrls.AUTH.REGISTER_RESEND_LINK,
		method: 'POST',
		onSuccess: () => {
			setResendTimer(60)
			setEditingPhone(false)
		},
	})

	const handleResendLink = async () => {
		const fd = new FormData()
		fd.set('Phone', phone)
		await submit(fd)
	}

	return (
		<>
			<Box sx={{ mb: 3 }}>
				<Typography variant='h4' sx={{ mb: 1, fontWeight: 700 }}>
					{t('auth.resend.title', 'Check your SMS')}
				</Typography>
				<Typography variant='body2' color='text.secondary'>
					{t('auth.resend.subtitle', 'We sent a verification link to your phone')}
				</Typography>
			</Box>

			<Stack spacing={3}>
				{error && (
					<Alert
						severity='error'
						sx={{
							borderRadius: 2,
							bgcolor: 'error.softBg',
							border: 1,
							borderColor: 'error.softBorder',
						}}
					>
						{error}
					</Alert>
				)}

				<Alert
					severity='info'
					sx={{
						borderRadius: 2,
						bgcolor: 'primary.softBg',
						border: 1,
						borderColor: 'primary.softBorder',
					}}
				>
					<Typography variant='body2' sx={{ mb: 0.5 }}>
						{t('auth.resend.link_sent', 'Verification link sent to')}
					</Typography>
					<Typography variant='body2' sx={{ fontWeight: 600 }}>
						{phone}
					</Typography>
					{resendTimer > 0 && (
						<Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
							{t('auth.resend.resend_in', 'Resend in')} {resendTimer} {t('auth.seconds', 'seconds')}
						</Typography>
					)}
				</Alert>

				{editingPhone ? (
					<Stack spacing={2}>
						<ValidationTextField
							label={t('auth.field.phone', 'Phone')}
							type='tel'
							placeholder='+1234567890'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							required={false}
						/>
						<Stack direction='row' spacing={2}>
							<Button
								variant='contained'
								size='large'
								onClick={() => setEditingPhone(false)}
								sx={{
									flex: 1,
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
								{t('button.next', 'Next')}
							</Button>
							<Button
								variant='outlined'
								size='large'
								onClick={() => {
									setEditingPhone(false)
									setPhone(phoneFromUrl)
								}}
								sx={{
									flex: 1,
									py: 1.5,
									borderRadius: 2,
									textTransform: 'none',
									fontSize: '1rem',
									fontWeight: 600,
								}}
							>
								{t('button.cancel', 'Cancel')}
							</Button>
						</Stack>
					</Stack>
				) : (
					<Button
						variant='outlined'
						size='large'
						onClick={() => setEditingPhone(true)}
						sx={{
							py: 1.5,
							borderRadius: 2,
							textTransform: 'none',
							fontSize: '1rem',
							fontWeight: 600,
						}}
					>
						{t('auth.resend.edit_phone', 'Edit phone number')}
					</Button>
				)}

				<Box>
					{resendTimer > 0 ? (
						<Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center' }}>
							{t('auth.resend.resend_in', 'Resend in')} {resendTimer} {t('auth.seconds', 'seconds')}
						</Typography>
					) : (
						<Button
							variant='outlined'
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
							}}
						>
							{t('auth.resend.button', 'Resend verification link')}
						</Button>
					)}
				</Box>

				<Box sx={{ textAlign: 'center' }}>
					<Typography variant='body2' color='text.secondary' component='span'>
						{t('auth.resend.already_have_account', 'Already have an account?')}{' '}
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
						{t('auth.login.submit', 'Login')}
					</Link>
				</Box>
			</Stack>
		</>
	)
}

export default ResendLinkPage
