import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useTranslation from '@/hooks/useTranslation'
import { Alert, Box, Button, CircularProgress, Link, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'

const VerifyLinkPage = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [params] = useSearchParams()
	const token = useMemo(() => params.get('token') || '', [params])
	const { login } = useAuth()
	const [verifying, setVerifying] = useState(true)
	const [success, setSuccess] = useState(false)
	const [failed, setFailed] = useState(false)

	const { loading, submit } = useAxiosSubmit({
		url: `${ApiUrls.AUTH.REGISTER_VERIFY}?token=${encodeURIComponent(token)}`,
		method: 'POST',
		onSuccess: async (resp) => {
			const token = resp.data.accessToken
			if (!token) {
				setFailed(true)
				setVerifying(false)
				return
			}

			await login(token)
			setSuccess(true)

			setTimeout(() => {
				navigate(routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.COMPLETE_PROFILE), { replace: true })
			}, 2000)
		},
		onError: () => {
			setFailed(true)
			setVerifying(false)
		},
	})

	const hasCalledRef = useRef(false)
	const submitRef = useRef(submit)
	useEffect(() => {
		submitRef.current = submit
	}, [submit])

	useEffect(() => {
		if (hasCalledRef.current) return
		hasCalledRef.current = true
		if (token) {
			submitRef.current()
		} else {
			setFailed(true)
			setVerifying(false)
		}
	}, [token])

	if (verifying && loading) {
		return (
			<>
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
					<CircularProgress size={48} sx={{ mb: 3 }} />
					<Typography variant='body1' color='text.secondary'>
						{t('auth.verify_link.processing')}
					</Typography>
				</Box>
			</>
		)
	}

	if (success) {
		return (
			<>
				<Box sx={{ textAlign: 'center', py: 4 }}>
					<Box
						sx={{
							fontSize: '4rem',
							mb: 2,
							color: 'success.main',
						}}
					>
						✓
					</Box>
					<Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
						{t('auth.verify_link.success')}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{t('auth.verify_link.redirecting')}
					</Typography>
				</Box>
			</>
		)
	}

	return (
		<>
			<Box sx={{ mb: 3 }}>
				<Typography variant='h4' sx={{ mb: 1, fontWeight: 700 }}>
					{t('auth.verify_link.title')}
				</Typography>
			</Box>

			<Stack spacing={3}>
				{failed && (
					<Alert
						severity='error'
						sx={{
							borderRadius: 2,
							bgcolor: 'error.softBg',
							border: 1,
							borderColor: 'error.softBorder',
						}}
					>
						<Typography variant='body2' sx={{ fontWeight: 600 }}>
							{t('auth.verify_link.failed')}
						</Typography>
						<Typography variant='body2' sx={{ mt: 0.5 }}>
							{t('auth.verify_link.invalid')}
						</Typography>
					</Alert>
				)}

				<Link
					component={RouterLink}
					to={routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.LOGIN)}
					sx={{ textDecoration: 'none' }}
				>
					<Button
						variant='outlined'
						fullWidth
						size='large'
						sx={{
							py: 1.5,
							borderRadius: 2,
							textTransform: 'none',
							fontSize: '1rem',
							fontWeight: 600,
						}}
					>
						{t('auth.back_to_login')}
					</Button>
				</Link>
			</Stack>
		</>
	)
}

export default VerifyLinkPage
