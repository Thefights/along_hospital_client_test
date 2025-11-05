import { routeUrls } from '@/configs/routeUrls'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { AddShoppingCart } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const MedicineCard = ({ medicine, sx = {} }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const handleCardClick = () => {
		console.log('➡️ Navigate to medicine detail:', medicine)
		// 🔹 Sau này chỉ cần thay bằng:
		// router.push(`/medicine/${medicine.id}`)
		navigate(`${routeUrls.HOME.MEDICINE}/${medicine.id}`)
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
				<Typography gutterBottom variant='h6' component='h2' noWrap>
					{medicine.name}
				</Typography>
				<Typography variant='body2' color='text.secondary' gutterBottom>
					{medicine.brand}
				</Typography>
				<Typography variant='subtitle1' color='primary' fontWeight='bold'>
					₫{medicine.price?.toLocaleString('vi-VN')}
				</Typography>
				<Typography variant='caption' color='text.secondary' display='block'>
					{t('medicine.field.unit')}: {medicine.medicineUnit}
				</Typography>
			</CardContent>

			{/* Ngăn click vào button bị trigger card click */}
			<CardActions onClick={(e) => e.stopPropagation()}>
				<Button
					fullWidth
					variant='contained'
					startIcon={<AddShoppingCart />}
					onClick={() => console.log('🛒 Add to cart:', medicine)}
				>
					{t('shop.button.add_to_cart')}
				</Button>
			</CardActions>
		</Card>
	)
}

export default MedicineCard
