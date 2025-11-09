import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import OrderHistoryCard from './sections/OrderHistoryCardSection'

export default function OrderHistoryPage() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { data: orderData, loading } = useFetch(ApiUrls.ORDER_HISTORY.INDEX)
	const orders = orderData?.collection || []

	const handleDetailClick = (id) => {
		navigate(routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.ORDER_HISTORY.DETAIL(id)))
	}

	const cancelOrderSubmit = useAxiosSubmit({
		method: 'PUT',
	})

	const handleCancelClick = async (orderId) => {
		await cancelOrderSubmit.submit(null, {
			overrideUrl: ApiUrls.ORDER_HISTORY.CANCEL(orderId),
		})
	}

	return (
		<Box sx={{ minHeight: '100vh', py: 4 }}>
			<Container maxWidth='lg'>
				<Stack spacing={3}>
					<Box sx={{ mb: 2 }}>
						<Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
							{t('order.title.page')}
						</Typography>
						<Typography variant='body2' sx={{ color: '#666' }}>
							{t('order.title.subtitle')}
						</Typography>
					</Box>

					{loading ? (
						<Typography>{t('common.loading')}</Typography>
					) : orders.length > 0 ? (
						<Stack spacing={2}>
							{orders.map((order) => (
								<OrderHistoryCard
									key={order.id}
									order={order}
									onDetailClick={handleDetailClick}
									onCancelClick={handleCancelClick}
								/>
							))}
						</Stack>
					) : (
						<Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
							<Typography variant='h6'>{t('order.history.empty')}</Typography>
							<Typography variant='body2'>{t('order.history.empty_desc')}</Typography>
						</Paper>
					)}
				</Stack>
			</Container>
		</Box>
	)
}
