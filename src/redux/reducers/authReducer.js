const initialState = {
	isAuthenticated: false,
	role: null,
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
