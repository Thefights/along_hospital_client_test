import ValidationTextField from '@/components/textFields/ValidationTextField'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { Box, Button, CircularProgress, MenuItem, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CompleteProfilePage = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { auth, login } = useAuth()
	const _enum = useEnum()
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		dateOfBirth: '',
		gender: '',
		address: '',
	})

	const needsPhone = auth?.stage === EnumConfig.AuthStage.PatientProfilePendingWithoutPhone

	useEffect(() => {
		if (!auth) {
			navigate(routeUrls.BASE_ROUTE.AUTH(routeUrls.AUTH.LOGIN), { replace: true })
			return
		}
	})

	const { loading, submit } = useAxiosSubmit({
		url: ApiUrls.AUTH.COMPLETE_PROFILE,
		method: 'POST',
		onSuccess: async () => {},
	})

	const onSubmit = async (e) => {
		e.preventDefault()

		const fd = new FormData()
		fd.set('Name', formData.name)
		fd.set('DateOfBirth', formData.dateOfBirth)
		fd.set('Gender', formData.gender)
		fd.set('Address', formData.address)
		if (needsPhone && formData.phone) {
			fd.set('Phone', formData.phone)
		}
		await submit(fd)
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
					{t('auth.complete.title')}
				</Typography>
				<Typography
					variant='body2'
					color='text.secondary'
					sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
				>
					{t('auth.complete.subtitle')}
				</Typography>
			</Box>

			<Box component='form' onSubmit={onSubmit}>
				<Stack spacing={{ xs: 2, sm: 2.5 }}>
					<ValidationTextField
						name='Name'
						label={t('profile.field.name')}
						placeholder={t('profile.placeholder.name')}
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					/>

					{needsPhone && (
						<ValidationTextField
							name='Phone'
							type='phone'
							label={t('profile.field.phone')}
							placeholder={t('auth.register.phone_placeholder')}
							value={formData.phone}
							onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
							required
						/>
					)}

					<ValidationTextField
						name='DateOfBirth'
						type='date'
						label={t('profile.field.date_of_birth')}
						value={formData.dateOfBirth}
						onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
					/>

					<ValidationTextField
						name='Gender'
						type='select'
						label={t('profile.field.gender')}
						value={formData.gender}
						onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
					>
						<MenuItem value='' disabled>
							{t('profile.placeholder.gender')}
						</MenuItem>
						{_enum.genderOptions.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</ValidationTextField>

					<ValidationTextField
						name='Address'
						label={t('profile.field.address')}
						placeholder={t('profile.placeholder.address')}
						value={formData.address}
						onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
		</>
	)
}

export default CompleteProfilePage
