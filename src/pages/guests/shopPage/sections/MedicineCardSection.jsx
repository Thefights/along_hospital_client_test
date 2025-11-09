import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { AddShoppingCart } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MedicineCardSection = ({ medicine, sx = {} }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [quantity, setQuantity] = useState(1)

	const { loading, submit } = useAxiosSubmit({
		url: routeUrls.CART.ADD_TO_CART,
		method: 'POST',
	})

	const handleCardClick = () => {
		navigate(`${routeUrls.HOME.MEDICINE}/${medicine.id}`)
	}

	const handleAddToCart = async () => {
		await submit({
			id: medicine.id,
			quantity: quantity,
		})
	}

	const handleQuantityChange = (delta) => {
		setQuantity((prev) => Math.max(1, prev + delta))
	}

	return (
		<Card
			onClick={handleCardClick}
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				cursor: 'pointer',
				transition: 'transform 0.2s, box-shadow 0.2s',
				'&:hover': {
					transform: 'translateY(-4px)',
					boxShadow: 3,
				},
				...sx,
			}}
		>
			<CardMedia
				component='img'
				image={getImageFromCloud(medicine.images?.[0])}
				alt={medicine.name}
				sx={{
					height: 200,
					objectFit: 'cover',
					pointerEvents: 'none',
				}}
				onError={(e) => {
					e.currentTarget.onerror = null
					e.currentTarget.src = '/placeholder-image.png'
				}}
			/>

			<CardContent sx={{ flexGrow: 1 }}>
				<Typography variant='h6' component='h2' noWrap gutterBottom>
					{medicine.name}
				</Typography>
				<Typography variant='body2' color='text.secondary' gutterBottom>
					{medicine.brand}
				</Typography>
				<Typography variant='subtitle1' color='primary' fontWeight='bold'>
					{medicine.price.toLocaleString()}₫
				</Typography>
				<Typography variant='caption' color='text.secondary' display='block'>
					{t('medicine.field.unit')}: {medicine.medicineUnit}
				</Typography>
			</CardContent>

			<CardActions onClick={(e) => e.stopPropagation()}>
				<Stack direction='row' spacing={1} alignItems='center' width='100%'>
					<IconButton size='small' onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
						<Remove />
					</IconButton>

					<TextField
						size='small'
						type='number'
						value={quantity}
						onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
						inputProps={{ min: 1, style: { textAlign: 'center', width: 50 } }}
					/>

					<IconButton size='small' onClick={() => handleQuantityChange(1)}>
						<Add />
					</IconButton>

					<Button
						fullWidth
						variant='contained'
						startIcon={<AddShoppingCart />}
						onClick={handleAddToCart}
						disabled={loading}
					>
						{loading ? t('shop.button.adding_to_cart') : t('shop.button.add_to_cart')}
					</Button>
				</Stack>
			</CardActions>
		</Card>
	)
}

export default MedicineCardSection
