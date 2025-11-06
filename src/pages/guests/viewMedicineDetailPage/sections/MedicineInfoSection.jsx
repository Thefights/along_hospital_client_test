import { Box, Button, Stack } from '@mui/material'

const MedicineInfoSection = ({ medicine, t, onAddToCart }) => {
	return (
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
	)
}

export default MedicineInfoSection
