export const routeUrls = {
	BASE_ROUTE: {
		AUTH: (route = '') => `/auth${route}`,
		PATIENT: (route = '') => `/patient${route}`,
		DOCTOR: (route = '') => `/doctor${route}`,
		MANAGER: (route = '') => `/admin${route}`,
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
	},
	PATIENT: {
		CART: '/cart',
		PROFILE: '/profile',
		MEDICAL_HISTORY: '/medical-history',
		ORDER_HISTORY: '/order-history',
		APPOINTMENT: {
			INDEX: '/appointments',
			CREATE: '/appointments/create',
		},
	},
}
