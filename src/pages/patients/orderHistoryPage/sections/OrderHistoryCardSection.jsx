import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { formatDateBasedOnCurrentLanguage } from '@/utils/formatDateUtil'
import { formatCurrencyBasedOnCurrentLanguage } from '@/utils/formatNumberUtil'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material'

export default function OrderHistoryCard({ order, onDetailClick, onCancelClick }) {
	const { t } = useTranslation()
	const _enum = useEnum()

	const statusLabel = getEnumLabelByValue(_enum.orderStatusOptions)
	const totalQuantity = order.orderDetails?.reduce((sum, d) => sum + d.quantity, 0) || 0

	const deliveryDisplay = order.deliveryDate
		? formatDateBasedOnCurrentLanguage(order.deliveryDate)
		: t('order.history.waiting_for_confirmation')

	return (
		<Paper
			sx={{
				p: 2.5,
				mb: 2,
				borderRadius: 2,
				boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
				transition: 'all 0.3s ease',
				'&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
			}}
		>
			<Stack spacing={2}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						flexWrap: 'wrap',
						gap: 2,
					}}
				>
					<Box>
						<Typography variant='h6' sx={{ mb: 0.5 }}>
							{t('order.history.order_id')} {order.id}
						</Typography>
						<Typography variant='body2' sx={{ color: '#666' }}>
							{t('order.history.transaction_id')}: {order.transactionId}
						</Typography>
					</Box>
					<Chip label={statusLabel} variant='filled' sx={{ fontWeight: 600 }} />
				</Box>

				<Divider />

				<Grid container spacing={2}>
					<Grid size={{ xs: 6, sm: 3 }}>
						<Typography
							variant='body2'
							sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
						>
							{t('order.history.order_date')}
						</Typography>
						<Typography sx={{ fontWeight: 600, mt: 0.5 }}>
							{formatDateBasedOnCurrentLanguage(order.orderDate)}
						</Typography>
					</Grid>

					<Grid size={{ xs: 6, sm: 3 }}>
						<Typography
							variant='body2'
							sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
						>
							{t('order.history.delivery_date')}
						</Typography>
						<Typography sx={{ fontWeight: 600, mt: 0.5 }}>{deliveryDisplay}</Typography>
					</Grid>

					<Grid size={{ xs: 6, sm: 3 }}>
						<Typography
							variant='body2'
							sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
						>
							{t('order.history.voucher_code')}
						</Typography>
						<Typography sx={{ fontWeight: 600, mt: 0.5 }}>{order.voucherCode || '-'}</Typography>
					</Grid>

					<Grid size={{ xs: 6, sm: 3 }}>
						<Typography
							variant='body2'
							sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
						>
							{t('order.history.total_products')}
						</Typography>
						<Typography sx={{ fontWeight: 600, mt: 0.5 }}>
							{totalQuantity} {t('order.history.product_unit')}
						</Typography>
					</Grid>
				</Grid>

				<Divider />

				<Box sx={{ p: 2, borderRadius: 1.5 }}>
					<Stack spacing={1}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
							<Typography variant='body2'>{t('order.history.origin_price')}</Typography>
							<Typography variant='body2'>
								{formatCurrencyBasedOnCurrentLanguage(order.originPrice)}
							</Typography>
						</Box>

						<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
							<Typography variant='body2' sx={{ color: '#d32f2f' }}>
								{t('order.history.discount')}
							</Typography>
							<Typography variant='body2' sx={{ color: '#d32f2f', fontWeight: 600 }}>
								-{formatCurrencyBasedOnCurrentLanguage(order.totalDiscountAmount)}
							</Typography>
						</Box>

						<Divider sx={{ my: 1 }} />

						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
							<Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1976d2' }}>
								{t('order.history.total')}: {formatCurrencyBasedOnCurrentLanguage(order.finalPrice)}
							</Typography>
							<Box sx={{ display: 'flex', gap: 1 }}>
								{order.orderStatus?.toLowerCase() === 'unpaid' && (
									<Button
										variant='contained'
										color='error'
										size='small'
										onClick={() => onCancelClick?.(order.id)}
									>
										{t('button.cancel')}
									</Button>
								)}
								<Button variant='outlined' size='small' onClick={() => onDetailClick?.(order.id)}>
									{t('order.history.detail_button')}
								</Button>
							</Box>
						</Box>
					</Stack>
				</Box>

				<Stack spacing={1}>
					{order.orderDetails?.map((item) => (
						<Box key={item.medicineId} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<img
								src={getImageFromCloud(item.medicineImages?.[0]) || ''}
								alt={item.medicineName}
								style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
							/>
							<Box>
								<Typography sx={{ fontWeight: 600 }}>{item.medicineName}</Typography>
								<Typography variant='body2' sx={{ color: '#555' }}>
									{item.medicineBrand}
								</Typography>
								<Typography variant='body2' sx={{ color: '#777' }}>
									{t('order.history.quantity')}: {item.quantity} {item.medicineUnit}
								</Typography>
							</Box>
						</Box>
					))}
				</Stack>
			</Stack>
		</Paper>
	)
}
