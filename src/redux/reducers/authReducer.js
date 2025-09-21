import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	isAuthenticated: false,
	userId: 0,
	role: null,
	refreshToken: null,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthStore: (state, action) => {
			return { ...state, ...action.payload, isAuthenticated: true }
		},
		resetAuthStore: (state, action) => {
			state = initialState
		},
	},
})

export const { setAuthStore, resetAuthStore } = authSlice.actions
export default authSlice.reducer
