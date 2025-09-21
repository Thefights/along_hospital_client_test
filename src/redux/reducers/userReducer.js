import { createSlice } from '@reduxjs/toolkit'

const initState = {
	cart: {},
	profile: {},
	orders: [],
	vouchers: [],
	appointments: [],
	medicalHistories: [],
}

const userSlice = createSlice({
	name: 'user',
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
		setAppointmentsStore: (state, action) => {
			state.appointments = action.payload
		},
		setMedicalHistoriesStore: (state, action) => {
			state.medicalHistories = action.payload
		},
	},
})

export const { setCartStore, setProfileStore } = userSlice.actions
export default userSlice.reducer
