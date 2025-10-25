export const routeUrls = {
	BASE_ROUTE: {
		AUTH: (route = '') => `/auth${route}`,
		PATIENT: (route = '') => `/patient${route}`,
		DOCTOR: (route = '') => `/doctor${route}`,
		MANAGER: (route = '') => `/manager${route}`,
	},
	HOME: {
		INDEX: '/',
		MEDICAL_SERVICE: '/medical-service',
		MEDICINE: '/medicine',
		SPECIALTY: '/specialty',
		DOCTOR: '/doctor',
		BLOG: '/blog',
		ABOUT_US: '/about-us',
		CONTACT: '/contact',
		TERMS_OF_SERVICE: '/terms-of-service',
		PRIVACY_POLICY: '/privacy-policy',
		CAREER: '/career',
		FAQ: '/faq',
	},
	AUTH: {
		LOGIN: '/login',
		REGISTER: '/register',
		CHANGE_PASSWORD: '/change-password',
		FORGOT_PASSWORD: '/forgot-password',
		VERIFY: '/verify',
		RESEND_LINK: '/resend-link',
		RESET_PASSWORD: '/reset-password',
		COMPLETE_PROFILE: '/complete-profile',
	},
	PATIENT: {
		CART: '/cart',
		PROFILE: '/profile',
		MEDICAL_HISTORY: {
			INDEX: '/medical-history',
			DETAIL: (id) => `/medical-history/${id}`,
		},
		ORDER_HISTORY: '/order-history',
		APPOINTMENT: {
			INDEX: '/appointment',
			CREATE: '/appointment/create',
		},
	},
	DOCTOR: {
		DASHBOARD: '/',
		APPOINTMENT_MANAGEMENT: '/appointment',
		MEDICAL_HISTORY: {
			INDEX: '/medical-history',
			CREATE: '/medical-history/create',
			DETAIL: (id) => `/medical-history/${id}`,
		},
	},
	MANAGER: {
		DASHBOARD: '/',
		APPOINTMENT_MANAGEMENT: '/appointment',
		MEDICAL_HISTORY: {
			INDEX: '/medical-history',
			DETAIL: (id) => `/medical-history/${id}`,
		},
		COMPLAINT_MANAGEMENT: '/complaint',
	},
}
