export const ApiUrls = {
	AUTH: {
		// Auth service endpoints
		LOGIN: '/auth/login',
		LOGIN_GOOGLE: '/auth/login/google',
		REGISTER: '/auth/register',
		REGISTER_RESEND_LINK: '/auth/register/resend-link',
		REGISTER_VERIFY: '/auth/register/verify', // POST with ?token=...
		REFRESH: '/auth/refresh',
		FORGOT_PASSWORD: '/auth/forgot-password',
		FORGOT_PASSWORD_RESET: '/auth/forgot-password/reset', // POST with ?token=...
		LOGOUT: '/auth/logout',
		CURRENT_ACCOUNT: '/auth/me',
		COMPLETE_PROFILE: '/user/complete-profile',
	},
	USER: {
		INDEX: `/user`,
		PROFILE: `/user/profile`,
		CART: `/user/cart`,
	},
	DOCTOR: {
		INDEX: `/doctor`,
		MANAGEMENT: {
			INDEX: `/doctor-management`,
			GET_ALL: `/doctor-management/all`,
		},
	},
	SPECIALTY: {
		INDEX: `/specialty`,
		GET_ALL: `/specialty/all`,
	},
	MEDICINE: {
		INDEX: `/medicine`,
		MANAGEMENT: {
			INDEX: `/medicine-management`,
			GET_ALL: `/medicine-management/all`,
		},
	},
	MEDICAL_SERVICE: {
		INDEX: `/medical-service`,
		MANAGEMENT: {
			INDEX: `/medical-service-management`,
			GET_ALL: `/medical-service-management/all`,
		},
	},
	APPOINTMENT: {
		INDEX: `/appointment`,
		CANCEL: (id) => `/appointment/cancel/${id}`,
		MANAGEMENT: {
			INDEX: `/appointment-management`,
			GET_ALL_BY_CURRENT_DOCTOR: `/appointment-management/doctor`,
			ASSIGN_DOCTOR: (appointmentId, doctorId) =>
				`/appointment-management/assign/${appointmentId}/doctor/${doctorId}`,
			DENY_ASSIGNMENT: (appointmentId) => `/appointment-management/deny-assignment/${appointmentId}`,
			CONFIRM: (id) => `/appointment-management/confirm/${id}`,
			COMPLETE: (id) => `/appointment-management/complete/${id}`,
			REFUSE: (id) => `/appointment-management/refuse/${id}`,
		},
	},
	MEDICAL_HISTORY: {
		INDEX: `/medical-history`,
		CREATE_COMPLAINT: (medicalHistoryId) => `/medical-history/${medicalHistoryId}/complaint`,
		MANAGEMENT: {
			INDEX: `/medical-history-management`,
			GET_ALL_BY_CURRENT_DOCTOR: `/medical-history-management/doctor`,
			COMPLETE: (medicalHistoryId) => `/medical-history-management/complete/${medicalHistoryId}`,
			MEDICAL_HISTORY_DETAIL: (medicalHistoryId, medicalServiceId = null) =>
				`/medical-history-management/${medicalHistoryId}/detail${
					medicalServiceId ? `/${medicalServiceId}` : ''
				}`,
			PRESCRIPTION: (medicalHistoryId) =>
				`/medical-history-management/${medicalHistoryId}/prescription`,
			COMPLAINT: {
				DRAFT: (medicalHistoryId) => `/medical-history-management/${medicalHistoryId}/complaint/draft`,
				RESOLVE: (medicalHistoryId) =>
					`/medical-history-management/${medicalHistoryId}/complaint/resolve`,
				CLOSE: (medicalHistoryId) => `/medical-history-management/${medicalHistoryId}/complaint/close`,
				CLASSIFY: (medicalHistoryId) =>
					`/medical-history-management/${medicalHistoryId}/complaint/classify`,
			},
		},
	},
}
