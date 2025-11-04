import { ApiUrls } from '@/configs/apiUrls'
import { createSlice } from '@reduxjs/toolkit'

const initState = {
	cart: {},
	profile: {},
	orders: [],
	vouchers: [],
}

const patientSlice = createSlice({
	name: 'patient',
	initialState: initState,
	reducers: {
		setCartStore: (state, action) => {
			state.cart = action.payload
		},
		setProfileStore: (state, action) => {
			state.profile = action.payload
		},
		setOrdersStore: (state, action) => {
			state.orders = action.payload
		},
		setVouchersStore: (state, action) => {
			state.vouchers = action.payload
		},
	},
})

const { setCartStore, setProfileStore, setOrdersStore, setVouchersStore } = patientSlice.actions

setCartStore.defaultUrl = ApiUrls.USER.CART
setProfileStore.defaultUrl = ApiUrls.USER.PROFILE

export { setCartStore, setOrdersStore, setProfileStore, setVouchersStore }

export default patientSlice.reducer
