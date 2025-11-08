export const ApiUrls = {
	AUTH: {
		LOGIN: '/auth/login',
		LOGIN_GOOGLE: '/auth/login/google',
		REGISTER: '/auth/register',
		REGISTER_RESEND_LINK: '/auth/register/resend-link',
		REGISTER_VERIFY: '/auth/register/verify',
		REFRESH: '/auth/refresh',
		FORGOT_PASSWORD: '/auth/forgot-password',
		FORGOT_PASSWORD_RESET: '/auth/forgot-password/reset',
		LOGOUT: '/auth/logout',
		CURRENT_ACCOUNT: '/auth/me',
		REFRESH_TOKEN: '/auth/refresh',
		COMPLETE_PROFILE: '/user/complete-profile',
	},
	USER: {
		INDEX: `/user`,
		PROFILE: `/user/profile`,
		CART: `/user/cart`,
	},
	PATIENT: {
		MANAGEMENT: {
			INDEX: `/patient-management`,
			DETAIL: (id) => `/patient-management/${id}`,
			GET_ALL: `/patient-management/all`,
		},
	},
	DOCTOR: {
		INDEX: `/doctor`,
		MANAGEMENT: {
			INDEX: `/doctor-management`,
			GET_ALL: `/doctor-management/all`,
			DETAIL: (id) => `/doctor-management/${id}`,
			DELETE_SELECTED: `/doctor-management/selected`,
		},
	},
	SPECIALTY: {
		INDEX: `/specialty`,
		GET_ALL: `/specialty/all`,
		MANAGEMENT: {
			INDEX: `/specialty-management`,
			GET_ALL: `/specialty-management/all`,
			DETAIL: (id) => `/specialty-management/${id}`,
		},
	},
	MEDICINE: {
		INDEX: `/medicine`,
		GETALL: `/medicine`,
		MANAGEMENT: {
			INDEX: `/medicine-management`,
			GET_ALL: `/medicine-management/all`,
			CREATE: `/medicine-management`,
			UPDATE: (id) => `/medicine-management/${id}`,
			DELETE: (id) => `/medicine-management/${id}`,
		},
	},
	MEDICINE_CATEGORY: {
		INDEX: `/medicine-category`,
		GET_ALL: `/medicine-category/all`,
		CREATE: `/medicine-category`,
		UPDATE: (id) => `/medicine-category/${id}`,
		DELETE: (id) => `/medicine-category/${id}`,
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
	COMPLAINT: {
		MANAGEMENT: {
			INDEX: `/complaint-management`,
			DRAFT: (id) => `/complaint-management/draft/${id}`,
			RESOLVE: (id) => `/complaint-management/resolve/${id}`,
			CLOSE: (id) => `/complaint-management/close/${id}`,
			CLASSIFY: (id) => `/complaint-management/classify/${id}`,
		},
	},
	MEDICAL_HISTORY: {
		INDEX: `/medical-history`,
		CREATE_COMPLAINT: (medicalHistoryId) => `/medical-history/${medicalHistoryId}/complaint`,
		MANAGEMENT: {
			INDEX: `/medical-history-management`,
			DETAIL: (id) => `/medical-history-management/${id}`,
			GET_ALL_BY_CURRENT_DOCTOR: `/medical-history-management/doctor`,
			COMPLETE: (medicalHistoryId) => `/medical-history-management/complete/${medicalHistoryId}`,
			MEDICAL_HISTORY_DETAIL: (medicalHistoryId, medicalServiceId = null) =>
				`/medical-history-management/${medicalHistoryId}/detail${
					medicalServiceId ? `/${medicalServiceId}` : ''
				}`,
			PRESCRIPTION: (medicalHistoryId) =>
				`/medical-history-management/${medicalHistoryId}/prescription`,
		},
	},
	BLOG: {
		INDEX: `/blog`,
		MANAGEMENT: {
			INDEX: `/Blog-Management`,
			DETAIL: (id) => `/Blog-Management/${id}`,
		},
	},
	VOUCHER: {
		COLLECTIBLE: `/voucher/collectible`,
		COLLECT: `/voucher/collect`,
		MY_VOUCHERS: `/voucher/my-vouchers`,
		MANAGEMENT: {
			INDEX: `/voucher-management`,
			DETAIL: (id) => `/voucher-management/${id}`,
		},
	},
	PATIENT_VOUCHER: {
		INDEX: `/patient-voucher`,
		DETAIL: (id) => `/patient-voucher/${id}`,
	},
	DEPARTMENT: {
		INDEX: `/department`,
		MANAGEMENT: {
			INDEX: `/department-management`,
			GET_ALL: `/department-management/all`,
			DETAIL: (id) => `/department-management/${id}`,
		},
	},
}
