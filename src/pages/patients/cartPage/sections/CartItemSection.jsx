'use client'

import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { Add, Delete as DeleteIcon, Remove } from '@mui/icons-material'
import { Box, Button, Card, IconButton, Stack, Typography } from '@mui/material'

const CartItemSection = ({ cartData, updateQuantity, handleRemove }) => {
	const { t } = useTranslation()

	return (
		<Box sx={{ maxHeight: '80vh', overflowY: 'auto', pr: 1 }}>
			<Stack spacing={2}>
				{cartData.cartDetails.map((item) => (
					<Card
						key={item.medicineId}
						sx={{ display: 'flex', overflow: 'visible', width: '100%', minHeight: 180 }}
					>
						<Box
							sx={{
								width: 180,
								height: 180,
								bgcolor: 'background.default',
								flexShrink: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								overflow: 'hidden',
							}}
						>
							{item.medicine?.images?.length > 0 ? (
								<img
									src={getImageFromCloud(item.medicine.images[0])}
									alt={item.medicine.name}
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							) : (
								<Typography color='text.secondary'>{t('cart.no_image')}</Typography>
							)}
						</Box>

						<Box sx={{ p: 2, flex: 1 }}>
							<Stack spacing={2}>
								<Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
									<Box flex={1}>
										<Typography variant='h6' sx={{ fontWeight: 1000 }}>
											{item.medicine?.name}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											{t('cart.brand')}: {item.medicine?.brand}
										</Typography>
										<Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
											{t('cart.unit')}: {item.medicine?.medicineUnit}
										</Typography>
										<Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
											{item.discountPrice || item.medicine?.price || 0}{' '}
											<Typography component='span' variant='body2' sx={{ fontWeight: 600, ml: 1 }}>
												x {item.quantity}
											</Typography>
										</Typography>
									</Box>

									<Typography variant='h6' sx={{ fontWeight: 700 }}>
										{(item.discountPrice || item.medicine?.price || 0) * item.quantity}
									</Typography>
								</Stack>

								<Stack direction='row' alignItems='center' spacing={40}>
									<Stack
										direction='row'
										alignItems='center'
										sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
									>
										<IconButton
											size='small'
											onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
											sx={{ p: 0.5 }}
										>
											<Remove fontSize='small' />
										</IconButton>
										<Typography sx={{ px: 1.5, minWidth: 30, textAlign: 'center' }}>
											{item.quantity}
										</Typography>
										<IconButton
											size='small'
											onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
											sx={{ p: 0.5 }}
										>
											<Add fontSize='small' />
										</IconButton>
									</Stack>

									<Button
										startIcon={<DeleteIcon />}
										color='error'
										size='small'
										onClick={() => handleRemove(item.medicineId)}
										sx={{ ml: 'auto' }}
									>
										{t('button.delete')}
									</Button>
								</Stack>
							</Stack>
						</Box>
					</Card>
				))}
			</Stack>
		</Box>
	)
}

export default CartItemSection
