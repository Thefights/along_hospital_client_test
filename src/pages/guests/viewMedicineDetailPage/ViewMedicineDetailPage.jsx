import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { Box, Button, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

export default function ViewMedicineDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { t } = useTranslation()

	// Dùng useFetch để gọi API backend
	const getMedicine = useFetch(ApiUrls.MEDICINE.GET_BY_ID(id))

	const medicine = getMedicine.data || null
	const loading = getMedicine.loading
	const error = getMedicine.error

	if (loading) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
				<CircularProgress />
			</Box>
		)
	}

	if (error) {
		return (
			<Container sx={{ py: 4 }}>
				<Typography color='error'>
					{t('common.error.loading_data')}: {error.message || 'Unknown error'}
				</Typography>
			</Container>
		)
	}

	if (!medicine) {
		return (
			<Container sx={{ py: 4 }}>
				<Typography>{t('common.error.not_found')}</Typography>
			</Container>
		)
	}

	return (
		<Container sx={{ py: 4 }}>
			<Grid container spacing={4}>
				<Grid item xs={12} md={5}>
					<Box
						component='img'
						src={getImageFromCloud(medicine.images?.[0] || '')}
						alt={medicine.name || ''}
						sx={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 2, boxShadow: 2 }}
					/>
				</Grid>

				<Grid item xs={12} md={7}>
					<Typography variant='h4' fontWeight='bold' gutterBottom>
						{medicine.name}
					</Typography>
					<Typography variant='subtitle1' color='text.secondary' gutterBottom>
						{medicine.brand || '-'}
					</Typography>
					<Typography variant='h5' color='primary' fontWeight='bold' gutterBottom>
						{medicine.price != null ? `₫${medicine.price.toLocaleString('vi-VN')}` : '-'}
					</Typography>
					<Typography variant='body1' gutterBottom>
						{t('medicine.field.unit')}: {medicine.medicineUnit || '-'}
					</Typography>

					<Box mt={3}>
						<Button
							variant='contained'
							size='large'
							onClick={() => console.log('🛒 Add to cart:', medicine)}
						>
							{t('shop.button.add_to_cart')}
						</Button>
					</Box>
				</Grid>
			</Grid>

			<Box mt={6}>
				<Typography variant='h6' gutterBottom>
					{t('medicine.field.description')}
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					{medicine.description || t('medicine.field.no_description')}
				</Typography>
			</Box>
		</Container>
	)
}
