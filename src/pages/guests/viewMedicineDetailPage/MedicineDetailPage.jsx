import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit' // hook của bạn
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MedicineDetailImageSection from './sections/MedicineDetailImageSection'
import MedicineDetailInfoSection from './sections/MedicineDetailInfoSection'

const MedicineDetailPage = () => {
	const { id } = useParams()
	const { t } = useTranslation()
	const theme = useTheme()

	const { data: medicine, loading, error } = useFetch(id ? ApiUrls.MEDICINE.GET_BY_ID(id) : null)

	const [currentImage, setCurrentImage] = useState(null)
	const [quantity, setQuantity] = useState(1)

	useEffect(() => {
		if (medicine?.images?.length) {
			setCurrentImage(medicine.images[0])
		}
	}, [medicine])

	const { loading: addingToCart, submit: addToCartApi } = useAxiosSubmit({
		url: ApiUrls.CART.ADD_TO_CART,
		method: 'POST',
	})

	const handleAddToCart = () => {
		addToCartApi({ medicineId: medicine.id, quantity })
	}

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
		<Container maxWidth='lg' sx={{ py: 6 }}>
			<Grid container spacing={6} alignItems='flex-start'>
				<Grid item xs={12} md={5}>
					<MedicineDetailImageSection
						medicine={medicine}
						currentImage={currentImage}
						setCurrentImage={setCurrentImage}
						theme={theme}
					/>
				</Grid>

				<Grid item xs={12} md={7}>
					<MedicineDetailInfoSection
						medicine={medicine}
						quantity={quantity}
						setQuantity={setQuantity}
						onAddToCart={handleAddToCart}
						t={t}
						theme={theme}
						loading={addingToCart}
					/>
				</Grid>
			</Grid>
		</Container>
	)
}

export default MedicineDetailPage
