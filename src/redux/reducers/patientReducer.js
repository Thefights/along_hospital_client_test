import { ApiUrls } from '@/configs/apiUrls'
import { createSlice } from '@reduxjs/toolkit'

const initState = {
	cart: {},
	profile: {},
	orders: [],
	vouchers: [],
	doctors: [],
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
		setDoctorsStore: (state, action) => {
			state.doctors = action.payload || []
		},
	},
})

const { setCartStore, setProfileStore, setOrdersStore, setVouchersStore, setDoctorsStore } =
	patientSlice.actions

setCartStore.defaultUrl = ApiUrls.USER.CART
setProfileStore.defaultUrl = ApiUrls.USER.PROFILE
setDoctorsStore.defaultUrl = ApiUrls.DOCTOR.GET_ALL

export { setCartStore, setDoctorsStore, setOrdersStore, setProfileStore, setVouchersStore }

export default patientSlice.reducer
