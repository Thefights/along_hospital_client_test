import useTranslation from '@/hooks/useTranslation'
import { Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const CartSummarySection = ({ cartData, total, checkout }) => {
	const { t } = useTranslation()
	const [voucherCode, setVoucherCode] = useState('')

	return (
		<Paper
			sx={(theme) => ({
				p: 3,
				position: { xs: 'static', md: 'sticky' },
				top: 20,
				height: 'fit-content',
				backgroundColor: theme.palette.background.paper,
				border: `1px solid ${theme.palette.divider}`,
			})}
		>
			<Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>
				{t('cart.summary.title')}
			</Typography>

			<Stack spacing={2}>
				{cartData.cartDetails.map((item) => (
					<Stack
						key={item.medicineId}
						direction='row'
						justifyContent='space-between'
						alignItems='center'
					>
						<Typography variant='body2' color='text.secondary'>
							{item.medicine?.name} x {item.quantity}
						</Typography>
						<Typography variant='body2' sx={{ fontWeight: 500 }}>
							{(item.discountPrice || item.medicine?.price || 0) * item.quantity}
						</Typography>
					</Stack>
				))}

				<Divider sx={{ my: 1 }} />

				<Stack direction='row' justifyContent='space-between' alignItems='center'>
					<Typography variant='h6' sx={{ fontWeight: 700 }}>
						{t('cart.summary.total')}
					</Typography>
					<Typography
						variant='h6'
						sx={{ fontWeight: 700, color: (theme) => theme.palette.primary.main }}
					>
						{total}
					</Typography>
				</Stack>

				{/* Input voucher code */}
				<TextField
					label={t('cart.summary.voucher_code')}
					value={voucherCode}
					onChange={(e) => setVoucherCode(e.target.value)}
					size='small'
					fullWidth
				/>

				<Button
					variant='contained'
					size='large'
					fullWidth
					sx={{ mt: 2 }}
					onClick={() =>
						checkout.submit({
							voucherCode: voucherCode || null,
							paymentType: 'PayOS',
							description: t('cart.summary.checkout_description'),
							selectedMedicineIds: cartData.cartDetails.map((ci) => ci.medicineId),
						})
					}
					disabled={checkout.loading}
				>
					{checkout.loading ? t('cart.summary.processing') : t('cart.summary.checkout')}
				</Button>
			</Stack>
		</Paper>
	)
}

export default CartSummarySection
