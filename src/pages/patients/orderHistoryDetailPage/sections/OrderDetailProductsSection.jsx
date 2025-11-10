import useTranslation from '@/hooks/useTranslation'
import { formatCurrencyBasedOnCurrentLanguage } from '@/utils/formatNumberUtil'
import { Grid, Paper, Stack, Typography } from '@mui/material'

export default function OrderDetailProductsSection({ order }) {
	const { t } = useTranslation()

	return (
		<Stack spacing={1.5}>
			<Typography variant='h6'>{t('order_detail.detail.products')}</Typography>
			{order.orderDetails.map((item) => (
				<Paper key={item.medicineId} sx={{ p: 2, borderLeft: '4px solid #1976d2' }}>
					<Grid container spacing={2} alignItems='center'>
						<Grid size={{ xs: 12, sm: 4 }}>
							<Typography sx={{ fontWeight: 600 }}>{item.medicineName}</Typography>
							<Typography variant='body2' sx={{ color: '#666' }}>
								{item.medicineBrand}
							</Typography>
						</Grid>
						<Grid size={{ xs: 6, sm: 2 }}>
							<Typography variant='body2' sx={{ color: '#999' }}>
								{t('order_detail.detail.quantity')}
							</Typography>
							<Typography sx={{ fontWeight: 600 }}>
								{item.quantity} {item.medicineUnit}
							</Typography>
						</Grid>
						<Grid size={{ xs: 6, sm: 2 }}>
							<Typography variant='body2' sx={{ color: '#999' }}>
								{t('order_detail.detail.unit_price')}
							</Typography>
							<Typography sx={{ fontWeight: 600 }}>
								{formatCurrencyBasedOnCurrentLanguage(item.unitPrice)}
							</Typography>
						</Grid>
						<Grid size={{ xs: 6, sm: 2 }}>
							<Typography variant='body2' sx={{ color: '#999' }}>
								{t('order_detail.detail.discount')}
							</Typography>
							<Typography sx={{ fontWeight: 600, color: '#d32f2f' }}>
								-{formatCurrencyBasedOnCurrentLanguage(item.discountAmount)}
							</Typography>
						</Grid>
						<Grid size={{ xs: 6, sm: 2 }}>
							<Typography variant='body2' sx={{ color: '#999' }}>
								{t('order_detail.detail.total')}
							</Typography>
							<Typography sx={{ fontWeight: 600, color: '#1976d2' }}>
								{formatCurrencyBasedOnCurrentLanguage(item.quantity * item.unitPrice - item.discountAmount)}
							</Typography>
						</Grid>
					</Grid>
				</Paper>
			))}
		</Stack>
	)
}
