import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { Box, Button, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
export default function ViewMedicineDetailPage() {
	const { id } = useParams()
	const { t } = useTranslation()
	const { data: medicine, loading, error } = useFetch(id ? ApiUrls.MEDICINE.GET_BY_ID(id) : null)

	// State để lưu ảnh hiện tại
	const [currentImage, setCurrentImage] = useState(null)

	// Khi dữ liệu medicine load xong, đặt ảnh đầu tiên làm mặc định
	useEffect(() => {
		if (medicine?.images?.length) {
			setCurrentImage(medicine.images[0])
		}
	}, [medicine])

	if (loading) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' minHeight='60vh'>
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
				{/* Ảnh lớn */}
				<Grid item xs={12} md={5}>
					<Box
						sx={{
							width: '100%',
							height: 400,
							borderRadius: 2,
							boxShadow: 2,
							overflow: 'hidden',
						}}
					>
						{currentImage ? (
							<Box
								component='img'
								src={getImageFromCloud(currentImage)}
								alt={medicine.name || 'Medicine Image'}
								sx={{
									width: 400,
									height: 400,
									objectFit: 'cover',
									display: 'block',
								}}
								onError={(e) => {
									e.currentTarget.onerror = null
									e.currentTarget.src = '/placeholder-image.png'
								}}
							/>
						) : (
							<Box sx={{ width: '100%', height: '100%', bgcolor: 'grey.200' }} />
						)}
					</Box>
				</Grid>

				<Grid item xs={12} md={7}>
					<Grid item xs={12} md={7} container spacing={2}>
						<Stack spacing={1} sx={{ width: '100%' }}>
							<Stack direction='row' spacing={1} flexWrap='nowrap' alignItems='center'>
								<Typography color='text.secondary' minWidth={120}>
									{t('medicine.field.name')}:
								</Typography>
								<Typography fontWeight='bold'>{medicine.name || '-'}</Typography>
							</Stack>

							<Stack direction='row' spacing={1} flexWrap='nowrap' alignItems='center'>
								<Typography color='text.secondary' minWidth={120}>
									{t('medicine.field.brand')}:
								</Typography>
								<Typography>{medicine.brand || '-'}</Typography>
							</Stack>

							<Stack direction='row' spacing={1} flexWrap='nowrap' alignItems='center'>
								<Typography color='text.secondary' minWidth={120}>
									{t('medicine.field.price')}:
								</Typography>
								<Typography color='primary' fontWeight='bold'>
									{medicine.price}
								</Typography>
							</Stack>

							<Stack direction='row' spacing={1} flexWrap='nowrap' alignItems='center'>
								<Typography color='text.secondary' minWidth={120}>
									{t('medicine.field.unit')}:
								</Typography>
								<Typography>{medicine.medicineUnit || '-'}</Typography>
							</Stack>

							<Box mt={2}>
								<Button
									variant='contained'
									size='large'
									onClick={() => console.log('🛒 Add to cart:', medicine)}
								>
									{t('shop.button.add_to_cart')}
								</Button>
							</Box>
						</Stack>
					</Grid>

					{medicine.images?.length > 0 && (
						<Box mt={2} display='flex' gap={1} flexWrap='wrap'>
							{medicine.images.map((img, index) => (
								<Box
									key={index}
									component='img'
									src={getImageFromCloud(img)}
									alt={`Thumbnail ${index}`}
									onClick={() => setCurrentImage(img)}
									sx={{
										width: 60,
										height: 60,
										objectFit: 'cover',
										borderRadius: 1,
										cursor: 'pointer',
										border: currentImage === img ? '2px solid #1976d2' : '1px solid #ccc',
									}}
								/>
							))}
						</Box>
					)}
				</Grid>
			</Grid>
		</Container>
	)
}
