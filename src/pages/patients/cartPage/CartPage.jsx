import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, Button, CircularProgress, Container, Grid, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import CartItemSection from './sections/CartItemSection'
import CartSummarySection from './sections/CartSummarySection'

const CartPage = () => {
	const { t } = useTranslation()
	const confirm = useConfirm()
	const [cartData, setCartData] = useState(null)

	const getCartItems = useFetch(ApiUrls.CART.INDEX)

	useEffect(() => {
		if (getCartItems.data) setCartData(getCartItems.data)
	}, [getCartItems.data])

	const checkout = useAxiosSubmit({
		url: ApiUrls.CART.CHECKOUT,
		method: 'POST',
		onSuccess: (data) => {
			alert(`${t('checkout.success')}\nOrder ID: ${data.orderId}`)
			getCartItems.fetch()
		},
	})

	const deleteItem = useAxiosSubmit({
		method: 'DELETE',
		onSuccess: () => getCartItems.fetch(),
	})

	const handleRemove = async (medicineId) => {
		if (!cartData) return
		const isConfirmed = await confirm({ title: t('checkout.confirm_delete') })
		if (!isConfirmed) return
		await deleteItem.submit(null, { overrideUrl: ApiUrls.CART.DELETE(medicineId) })
	}

	const updateQuantity = (medicineId, newQty) => {
		if (!cartData) return
		if (newQty <= 0) {
			handleRemove(medicineId)
			return
		}
		setCartData({
			...cartData,
			cartDetails: cartData.cartDetails.map((item) =>
				item.medicineId === medicineId ? { ...item, quantity: newQty } : item
			),
		})
	}

	const total =
		cartData?.cartDetails.reduce(
			(sum, item) => sum + (item.discountPrice || item.medicine?.price || 0) * item.quantity,
			0
		) || 0

	if (getCartItems.loading || !cartData)
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
				<CircularProgress />
			</Box>
		)

	if (getCartItems.error)
		return (
			<Container sx={{ py: 4 }}>
				<Typography color='error'>
					{t('common.error.loading_data')}: {getCartItems.error.message || 'Unknown error'}
				</Typography>
			</Container>
		)

	const isEmpty = !cartData.cartDetails || cartData.cartDetails.length === 0

	return (
		<Container maxWidth='lg' sx={{ py: 6 }}>
			<Typography variant='h4' mb={4}>
				{t('checkout.title')}
			</Typography>

			{isEmpty ? (
				<Paper sx={{ p: 6, textAlign: 'center' }}>
					<Typography variant='h6'>{t('checkout.empty_cart')}</Typography>
					<Button variant='contained' sx={{ mt: 2 }}>
						Continue Shopping
					</Button>
				</Paper>
			) : (
				<Grid container spacing={3}>
					<Grid item xs={12} md={8.4}>
						<CartItemSection
							cartData={cartData}
							updateQuantity={updateQuantity}
							handleRemove={handleRemove}
						/>
					</Grid>
					<Grid item xs={12} md={3.6}>
						<CartSummarySection cartData={cartData} total={total} checkout={checkout} />
					</Grid>
				</Grid>
			)}
		</Container>
	)
}

export default CartPage
