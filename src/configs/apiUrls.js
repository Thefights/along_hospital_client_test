export const ApiUrls = {
	AUTH: {
		CURRENT_ACCOUNT: '/auth/current-account',
	},
	USER: {
		INDEX: `/user`,
		PROFILE: `/user/profile`,
		CART: `/user/cart`,
	},
	SPECIALTY: {
		INDEX: `/specialty`,
	},
	APPOINTMENT: {
		INDEX: `/appointment`,
		CANCEL: (id) => `/appointment/cancel/${id}`,
		BASE_MANAGEMENT: `/appointment-management`,
		GET_ALL_BY_DOCTOR_ID: (id) => `/appointment-management/doctor/${id}`,
		ASSIGN_DOCTOR: (appointmentId, doctorId) =>
			`/appointment-management/assign/${appointmentId}/doctor/${doctorId}`,
		DENY_ASSIGNMENT: (appointmentId) => `/appointment-management/deny-assignment/${appointmentId}`,
		CONFIRM: (id) => `/appointment-management/confirm/${id}`,
		COMPLETE: (id) => `/appointment-management/complete/${id}`,
		REFUSE: (id) => `/appointment-management/refuse/${id}`,
	},
}
