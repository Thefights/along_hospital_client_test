import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material'

const MedicineDetailInfoSection = ({ medicine, quantity, setQuantity, onAddToCart, t, theme }) => {
	return (
		<Stack spacing={3}>
			{medicine.medicineCategory && (
				<Chip
					label={medicine.medicineCategory.name}
					sx={{
						bgcolor: theme.palette.info.light,
						color: theme.palette.info.main,
						fontWeight: 600,
						width: 'fit-content',
						fontSize: '0.85rem',
					}}
				/>
			)}

			<Box>
				<Typography variant='h4' sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
					{medicine.name || '-'}
				</Typography>
				<Typography variant='body2' sx={{ color: theme.palette.text.secondary, mb: 2 }}>
					{medicine.medicineCategory?.description}
				</Typography>
			</Box>

			<Divider />

			<Stack spacing={2}>
				{[
					{ label: t('medicine.field.brand'), value: medicine.brand },
					{ label: t('medicine.field.unit'), value: medicine.medicineUnit },
				].map((f, i) => (
					<Stack key={i} direction='row' spacing={2}>
						<Typography sx={{ fontWeight: 600, color: theme.palette.text.secondary, minWidth: 100 }}>
							{f.label}:
						</Typography>
						<Typography sx={{ fontWeight: 500 }}>{f.value || '-'}</Typography>
					</Stack>
				))}
			</Stack>

			<Divider />

			<Box
				sx={{
					bgcolor: theme.palette.background.paper,
					p: 2,
					borderRadius: 1.5,
					border: `1px solid ${theme.palette.divider}`,
				}}
			>
				<Stack spacing={1}>
					<Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem' }}>
						{t('medicine.field.price')}
					</Typography>
					<Stack direction='row' spacing={2} alignItems='center'>
						{medicine.discountAmount > 0 ? (
							<>
								<Typography
									sx={{
										textDecoration: 'line-through',
										color: theme.palette.text.disabled,
										fontSize: '1.1rem',
									}}
								>
									{medicine.price}$
								</Typography>
								<Typography
									sx={{
										fontSize: '1.8rem',
										fontWeight: 700,
										color: theme.palette.error.main,
									}}
								>
									{medicine.finalPrice}$
								</Typography>
								<Chip
									label={`-${medicine.discountAmount}%`}
									sx={{
										bgcolor: theme.palette.error.light,
										color: theme.palette.error.main,
										fontWeight: 700,
										ml: 'auto',
									}}
								/>
							</>
						) : (
							<Typography sx={{ fontSize: '1.8rem', fontWeight: 700, color: theme.palette.primary.main }}>
								{medicine.price}$
							</Typography>
						)}
					</Stack>
				</Stack>
			</Box>

			<Box>
				<Typography sx={{ fontWeight: 600, mb: 1.5 }}>{t('medicine.field.quantity')}</Typography>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						border: `1px solid ${theme.palette.divider}`,
						borderRadius: 1,
						width: 'fit-content',
						bgcolor: theme.palette.background.paper,
					}}
				>
					<Button size='small' onClick={() => setQuantity(Math.max(1, quantity - 1))}>
						−
					</Button>
					<Divider orientation='vertical' flexItem />
					<Typography sx={{ px: 2, minWidth: 50, textAlign: 'center', fontWeight: 600 }}>
						{quantity}
					</Typography>
					<Divider orientation='vertical' flexItem />
					<Button size='small' onClick={() => setQuantity(quantity + 1)}>
						+
					</Button>
				</Box>
			</Box>

			<Button
				variant='contained'
				size='large'
				onClick={() => onAddToCart(medicine, quantity)}
				sx={{ mt: 2, py: 1.5, fontWeight: 600, borderRadius: 1 }}
			>
				{t('shop.button.add_to_cart')}
			</Button>
		</Stack>
	)
}

export default MedicineDetailInfoSection
