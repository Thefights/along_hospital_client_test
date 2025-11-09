import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, Button, CircularProgress, Container, Grid, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CartItemSection from './sections/CartItemSection'
import CartSummarySection from './sections/CartSummarySection'

const CartPage = () => {
	const { t } = useTranslation()
	const confirm = useConfirm()
	const [cartData, setCartData] = useState(null)
	const [voucherList, setVoucherList] = useState([])
	const navigate = useNavigate()

	const getCartItems = useFetch(ApiUrls.CART.INDEX)
	const getVouchers = useFetch(ApiUrls.VOUCHER.MY_ALL_VOUCHERS)

	useEffect(() => {
		if (getCartItems.data) setCartData(getCartItems.data)
	}, [getCartItems.data])

	useEffect(() => {
		if (getVouchers.data) setVoucherList(getVouchers.data)
	}, [getVouchers.data])

	const checkout = useAxiosSubmit({
		url: ApiUrls.CART.CHECKOUT,
		method: 'POST',
		onSuccess: () => {
			getCartItems.fetch()
		},
	})

	const deleteItem = useAxiosSubmit({
		method: 'DELETE',
		onSuccess: () => getCartItems.fetch(),
	})

	const handleRemove = async (medicineId) => {
		if (!cartData) return
		const isConfirmed = await confirm({ title: t('cart.confirm_delete') })
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
					{t('common.error.loading_data')}: {getCartItems.error.message || t('common.error.unknown')}
				</Typography>
			</Container>
		)

	const isEmpty = !cartData.cartDetails || cartData.cartDetails.length === 0

	return (
		<Container maxWidth='lg' sx={{ py: 6 }}>
			<Typography variant='h4' mb={4}>
				{t('cart.title')}
			</Typography>

			{isEmpty ? (
				<Paper sx={{ p: 6, textAlign: 'center' }}>
					<Typography variant='h6'>{t('cart.empty_cart')}</Typography>
					<Button variant='contained' sx={{ mt: 2 }} onClick={() => navigate(routeUrls.HOME.MEDICINE)}>
						{t('cart.continue_shopping')}
					</Button>
				</Paper>
			) : (
				<Grid container spacing={3}>
					<Grid item xs={12} sx={{ width: 750 }}>
						<CartItemSection
							cartData={cartData}
							updateQuantity={updateQuantity}
							handleRemove={handleRemove}
							sx={{ height: 500, width: 300 }}
						/>
					</Grid>
					<Grid item xs={12} md={4} sx={{ width: { xs: '100%', md: 300 } }}>
						<CartSummarySection
							cartData={cartData}
							total={total}
							voucherList={voucherList}
							loading={checkout.loading}
							onCheckout={async (voucherCode, paymentType) => {
							const response = await checkout.submit({
								voucherCode: voucherCode || null,
								paymentType,
								description: t('cart.summary.checkout_description'),
								selectedMedicineIds: cartData.cartDetails.map((ci) => ci.medicineId),
							})

							if (response) {
								getCartItems.fetch() 
							}
							}}
						/>
					</Grid>
				</Grid>
			)}
		</Container>
	)
}

export default CartPage
