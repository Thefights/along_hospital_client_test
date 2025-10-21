import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	authId: 0,
	userId: 0,
	role: null,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthStore: (state, action) => {
			return { ...state, ...action.payload }
		},
		resetAuthStore: () => initialState,
	},
})

export const { setAuthStore, resetAuthStore } = authSlice.actions
export default authSlice.reducer
