'use client'

import ConfirmationButton from '@/components/order/ConfirmationButton'
import OrderDetailList from '@/components/order/OrderDetailList'
import { theme } from '@/theme' // Import theme from separate theme file
import DeleteIcon from '@mui/icons-material/Delete'
import {
	Box,
	Button,
	Chip,
	Container,
	Divider,
	Grid,
	Paper,
	Stack,
	ThemeProvider,
	Typography,
} from '@mui/material'
import React from 'react'

const mockOrders = [
	{
		id: 'ORD-001',
		orderDate: '2024-11-05',
		deliveryDate: '2024-11-08',
		orderStatus: 'DELIVERED',
		transactionId: 'TXN-2024-001',
		voucherCode: 'HEALTH10',
		originPrice: 450000,
		totalDiscountAmount: 95000,
		finalPrice: 355000,
		orderDetails: [
			{
				medicineId: 1,
				medicineName: 'Paracetamol',
				medicineBrand: 'Tylenol',
				medicineImages: ['/paracetamol_tablet.png'],
				medicineUnit: 'viên',
				discountAmount: 50000,
				quantity: 2,
				unitPrice: 225000,
			},
			{
				medicineId: 2,
				medicineName: 'Vitamin C',
				medicineBrand: 'Nature',
				medicineImages: ['/vitamin-assortment.png'],
				medicineUnit: 'hộp',
				discountAmount: 45000,
				quantity: 1,
				unitPrice: 225000,
			},
		],
	},
	{
		id: 'ORD-002',
		orderDate: '2024-11-01',
		deliveryDate: '2024-11-05',
		orderStatus: 'CANCELLED',
		transactionId: 'TXN-2024-002',
		voucherCode: null,
		originPrice: 300000,
		totalDiscountAmount: 0,
		finalPrice: 300000,
		orderDetails: [
			{
				medicineId: 3,
				medicineName: 'Ibuprofen',
				medicineBrand: 'Advil',
				medicineImages: ['/ibuprofen-tablets.png'],
				medicineUnit: 'viên',
				discountAmount: 0,
				quantity: 3,
				unitPrice: 100000,
			},
		],
	},
	{
		id: 'ORD-003',
		orderDate: '2024-11-08',
		deliveryDate: null,
		orderStatus: 'PENDING',
		transactionId: 'TXN-2024-003',
		voucherCode: 'SAVE20',
		originPrice: 580000,
		totalDiscountAmount: 116000,
		finalPrice: 464000,
		orderDetails: [
			{
				medicineId: 4,
				medicineName: 'Omeprazole',
				medicineBrand: 'Prilosec',
				medicineImages: ['/omeprazole.jpg'],
				medicineUnit: 'viên',
				discountAmount: 60000,
				quantity: 2,
				unitPrice: 290000,
			},
			{
				medicineId: 5,
				medicineName: 'Metformin',
				medicineBrand: 'Glucophage',
				medicineImages: ['/metformin.jpg'],
				medicineUnit: 'hộp',
				discountAmount: 56000,
				quantity: 1,
				unitPrice: 280000,
			},
		],
	},
]

const getStatusColor = (status) => {
	switch (status) {
		case 'DELIVERED':
			return 'success'
		case 'PENDING':
			return 'warning'
		case 'CANCELLED':
			return 'error'
		default:
			return 'default'
	}
}

const getStatusLabel = (status) => {
	const labels = {
		DELIVERED: 'Đã giao',
		PENDING: 'Đang xử lý',
		CANCELLED: 'Đã hủy',
	}
	return labels[status] || status
}

const formatDate = (date) => {
	return new Date(date).toLocaleDateString('vi-VN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	})
}

const formatPrice = (price) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(price)
}

const OrderCard = ({ order }) => {
	const [openDetails, setOpenDetails] = React.useState(false)

	return (
		<>
			<Paper
				sx={{
					p: 2.5,
					mb: 2,
					borderRadius: 2,
					boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
					transition: 'all 0.3s ease',
					'&:hover': {
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
					},
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
								Đơn hàng: {order.id}
							</Typography>
							<Typography variant='body2' sx={{ color: '#666' }}>
								Mã giao dịch: {order.transactionId}
							</Typography>
						</Box>
						<Chip
							label={getStatusLabel(order.orderStatus)}
							color={getStatusColor(order.orderStatus)}
							variant='filled'
							sx={{ fontWeight: 600 }}
						/>
					</Box>

					<Divider />

					<Grid container spacing={2}>
						<Grid item xs={6} sm={3}>
							<Typography
								variant='body2'
								sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
							>
								Ngày đặt hàng
							</Typography>
							<Typography sx={{ fontWeight: 600, mt: 0.5 }}>{formatDate(order.orderDate)}</Typography>
						</Grid>
						<Grid item xs={6} sm={3}>
							<Typography
								variant='body2'
								sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
							>
								Ngày giao dự kiến
							</Typography>
							<Typography sx={{ fontWeight: 600, mt: 0.5 }}>
								{order.deliveryDate ? formatDate(order.deliveryDate) : 'Chờ xác nhận'}
							</Typography>
						</Grid>
						<Grid item xs={6} sm={3}>
							<Typography
								variant='body2'
								sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
							>
								Mã voucher
							</Typography>
							<Typography sx={{ fontWeight: 600, mt: 0.5 }}>{order.voucherCode || '-'}</Typography>
						</Grid>
						<Grid item xs={6} sm={3}>
							<Typography
								variant='body2'
								sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}
							>
								Số lượng sản phẩm
							</Typography>
							<Typography sx={{ fontWeight: 600, mt: 0.5 }}>
								{order.orderDetails.reduce((sum, d) => sum + d.quantity, 0)} sản phẩm
							</Typography>
						</Grid>
					</Grid>

					<Divider />

					<Box sx={{ backgroundColor: '#f9f9f9', p: 2, borderRadius: 1.5 }}>
						<Stack spacing={1}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography variant='body2'>Giá gốc:</Typography>
								<Typography variant='body2'>{formatPrice(order.originPrice)}</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography variant='body2' sx={{ color: '#d32f2f' }}>
									Giảm giá:
								</Typography>
								<Typography variant='body2' sx={{ color: '#d32f2f', fontWeight: 600 }}>
									-{formatPrice(order.totalDiscountAmount)}
								</Typography>
							</Box>
							<Divider sx={{ my: 1 }} />
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Tổng tiền:</Typography>
								<Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1976d2' }}>
									{formatPrice(order.finalPrice)}
								</Typography>
							</Box>
						</Stack>
					</Box>

					<Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
						<Button
							variant='outlined'
							size='small'
							onClick={() => setOpenDetails(!openDetails)}
							sx={{ textTransform: 'none' }}
						>
							{openDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
						</Button>
						{order.orderStatus !== 'DELIVERED' && (
							<ConfirmationButton
								confirmationTitle='Hủy đơn hàng'
								confirmationDescription={`Bạn có chắc chắn muốn hủy đơn hàng ${order.id}? Hành động này không thể hoàn tác.`}
								confirmButtonText='Hủy đơn hàng'
								confirmButtonColor='error'
								onConfirm={() => console.log('Cancel order:', order.id)}
								variant='outlined'
								size='small'
								startIcon={<DeleteIcon />}
								sx={{ textTransform: 'none', color: '#d32f2f', borderColor: '#d32f2f' }}
							>
								Hủy đơn
							</ConfirmationButton>
						)}
					</Box>

					{openDetails && (
						<>
							<Divider />
							<OrderDetailList details={order.orderDetails} />
						</>
					)}
				</Stack>
			</Paper>
		</>
	)
}

export default function OrderHistoryPage() {
	return (
		<ThemeProvider theme={theme}>
			<Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
				<Container maxWidth='lg'>
					<Stack spacing={3}>
						<Box sx={{ mb: 2 }}>
							<Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
								Lịch sử đơn hàng
							</Typography>
							<Typography variant='body2' sx={{ color: '#666' }}>
								Quản lý và theo dõi các đơn hàng của bạn
							</Typography>
						</Box>

						{mockOrders.length > 0 ? (
							<Stack spacing={2}>
								{mockOrders.map((order) => (
									<OrderCard key={order.id} order={order} />
								))}
							</Stack>
						) : (
							<Paper
								sx={{
									p: 4,
									textAlign: 'center',
									backgroundColor: '#fff',
									borderRadius: 2,
								}}
							>
								<Typography variant='h6' sx={{ mb: 1 }}>
									Không có đơn hàng nào
								</Typography>
								<Typography variant='body2' sx={{ color: '#666' }}>
									Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
								</Typography>
							</Paper>
						)}
					</Stack>
				</Container>
			</Box>
		</ThemeProvider>
	)
}
