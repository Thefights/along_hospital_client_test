import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { formatDateBasedOnCurrentLanguage } from '@/utils/formatDateUtil'
import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material'

export default function OrderDetailInfoSection({ order }) {
	const { t } = useTranslation()
	const _enum = useEnum()

	const getStatusLabel = (status) =>
		_enum.orderStatusOptions.find((s) => s.value === status)?.label || status

	return (
		<Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
			<Stack spacing={2}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						gap: 2,
					}}
				>
					<Typography variant='h6'>{t('order_detail.detail.info_title')}</Typography>
					<Chip label={getStatusLabel(order.orderStatus)} variant='filled' sx={{ fontWeight: 600 }} />
				</Box>
				<Divider />
				<Grid container spacing={2}>
					<Grid item xs={6} sm={3}>
						<Typography
							variant='body2'
							sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
						>
							{t('order_detail.detail.order_date')}
						</Typography>
						<Typography sx={{ fontWeight: 600, mt: 0.5 }}>
							{formatDateBasedOnCurrentLanguage(order.orderDate)}
						</Typography>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Typography
							variant='body2'
							sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
						>
							{t('order_detail.detail.delivery_date')}
						</Typography>
						<Typography sx={{ fontWeight: 600, mt: 0.5 }}>
							{order.deliveryDate
								? formatDateBasedOnCurrentLanguage(order.deliveryDate)
								: t('order_detail.status.waiting_for_confirmation')}
						</Typography>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Typography
							variant='body2'
							sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
						>
							{t('order_detail.detail.voucher_code')}
						</Typography>
						<Typography sx={{ fontWeight: 600, mt: 0.5 }}>{order.voucherCode || '-'}</Typography>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Typography
							variant='body2'
							sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
						>
							{t('order_detail.detail.total_quantity')}
						</Typography>
						<Typography sx={{ fontWeight: 600, mt: 0.5 }}>
							{order.orderDetails.reduce((sum, d) => sum + d.quantity, 0)}{' '}
							{t('order_detail.detail.unit_product')}
						</Typography>
					</Grid>
				</Grid>
			</Stack>
		</Paper>
	)
}
