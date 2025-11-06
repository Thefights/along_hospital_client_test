import { CheckCircleOutline } from '@mui/icons-material'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { keyframes } from '@mui/system'

const pulse = keyframes`
	0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.35); }
	60% { transform: scale(1.04); box-shadow: 0 0 0 12px rgba(46, 125, 50, 0); }
	100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
`

const PaymentReturnPage = () => {
	return (
		<Box sx={{ py: 6 }}>
			<Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
				<Stack alignItems='center' spacing={1.5}>
					<Box
						sx={{
							p: 2,
							borderRadius: '50%',
							bgcolor: 'success.softBg',
							border: (theme) => `1px dashed ${theme.palette.success.light}`,
							display: 'inline-flex',
							animation: `${pulse} 1.8s ease-in-out infinite`,
						}}
					>
						<CheckCircleOutline color='success' sx={{ fontSize: 44 }} />
					</Box>

					<Typography variant='h5' fontWeight={800}>
						Thanh toán thành công
					</Typography>
					<Typography variant='body1' color='text.secondary'>
						Cảm ơn bạn đã sử dụng dịch vụ của Along Hospital.
					</Typography>
					<Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic' }}>
						Chúc bạn một ngày thật nhiều sức khỏe!
					</Typography>
				</Stack>
			</Paper>
		</Box>
	)
}

export default PaymentReturnPage
