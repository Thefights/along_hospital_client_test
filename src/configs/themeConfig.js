import { createTheme } from '@mui/material'
import { common } from '@mui/material/colors'

const lightPalette = {
	mode: 'light',
	common: { ...common },
	primary: {
		main: '#1E88E5',
		light: '#00bece',
		dark: '#1565C0',
		contrastText: '#FFFFFF',
		softBg: '#E6F2FD',
		softBorder: '#B3DAFF',
	},
	secondary: {
		main: '#00BFA6',
		light: '#4FD1C5',
		dark: '#007C73',
		contrastText: '#FFFFFF',
		softBg: '#E6FAF8',
		softBorder: '#B7EFEA',
	},
	success: {
		main: '#2E7D32',
		light: '#60AD5E',
		dark: '#1B5E20',
		contrastText: '#FFFFFF',
		softBg: '#E8F5E9',
		softBorder: '#C8E6C9',
	},
	warning: {
		main: '#ED6C02',
		light: '#FF9800',
		dark: '#E65100',
		contrastText: '#FFFFFF',
		softBg: '#FFF4E5',
		softBorder: '#FFE0B2',
	},
	error: {
		main: '#D32F2F',
		light: '#EF5350',
		dark: '#C62828',
		contrastText: '#FFFFFF',
		softBg: '#FDECEC',
		softBorder: '#F5C2C0',
	},
	info: {
		main: '#0288D1',
		light: '#03A9F4',
		dark: '#01579B',
		contrastText: '#FFFFFF',
		softBg: '#E5F6FD',
		softBorder: '#B3E5FC',
	},
	background: {
		default: '#F7FAFC',
		paper: '#FFFFFF',
	},
	text: {
		primary: '#0F172A',
		secondary: '#475569',
		disabled: '#94A3B8',
	},
	divider: '#E2E8F0',
	grey: {
		50: '#F8FAFC',
		100: '#F1F5F9',
		200: '#E2E8F0',
		300: '#CBD5E1',
		400: '#94A3B8',
		500: '#64748B',
		600: '#475569',
		700: '#334155',
		800: '#1F2937',
		900: '#0F172A',
	},
	gradients: {
		brand_45deg: 'linear-gradient(45deg, #1E88E5 0%, #00BFA6 100%)',
		brand_135deg: 'linear-gradient(135deg, #1E88E5 0%, #00BFA6 100%)',
		brand_reverse_45deg: 'linear-gradient(45deg, #00BFA6 0%, #1E88E5 100%)',
		brand_reverse_135deg: 'linear-gradient(135deg, #00BFA6 0%, #1E88E5 100%)',
		calm: 'linear-gradient(135deg, #E6F2FD 0%, #E6FAF8 100%)',
	},
}

const darkPalette = {
	mode: 'dark',
	common: { ...common },
	primary: {
		main: '#63B3ED',
		light: '#90CAF9',
		dark: '#2563EB',
		contrastText: '#0B1220',
		softBg: '#0F1A28',
		softBorder: '#1F2D40',
	},
	secondary: {
		main: '#4FD1C5',
		light: '#7EE3D9',
		dark: '#14B8A6',
		contrastText: '#0B1220',
		softBg: '#0F1E1D',
		softBorder: '#1E3A37',
	},
	success: {
		main: '#81C784',
		light: '#A5D6A7',
		dark: '#4CAF50',
		contrastText: '#0B1220',
		softBg: '#102215',
		softBorder: '#1F3B25',
	},
	warning: {
		main: '#FFB74D',
		light: '#FFD180',
		dark: '#FB8C00',
		contrastText: '#0B1220',
		softBg: '#261A08',
		softBorder: '#3F2B0D',
	},
	error: {
		main: '#EF9A9A',
		light: '#FFCDD2',
		dark: '#E57373',
		contrastText: '#0B1220',
		softBg: '#2A1212',
		softBorder: '#431C1C',
	},
	info: {
		main: '#81D4FA',
		light: '#B3E5FC',
		dark: '#4FC3F7',
		contrastText: '#0B1220',
		softBg: '#0E1B26',
		softBorder: '#183145',
	},
	background: {
		default: '#0B1220',
		paper: '#0F172A',
	},
	text: {
		primary: '#E2E8F0',
		secondary: '#94A3B8',
		disabled: '#64748B',
	},
	divider: '#263043',
	grey: {
		50: '#0B1220',
		100: '#0F172A',
		200: '#111827',
		300: '#1F2937',
		400: '#374151',
		500: '#4B5563',
		600: '#6B7280',
		700: '#9CA3AF',
		800: '#D1D5DB',
		900: '#E5E7EB',
	},
	gradients: {
		brand_45deg: 'linear-gradient(45deg, #2563EB 0%, #14B8A6 100%)',
		brand_135deg: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
		brand_reverse_45deg: 'linear-gradient(45deg, #14B8A6 0%, #2563EB 100%)',
		brand_reverse_135deg: 'linear-gradient(135deg, #14B8A6 0%, #2563EB 100%)',
		calm: 'linear-gradient(135deg, #0F1A28 0%, #0F1E1D 100%)',
	},
}

const customTheme = (palette, otherComponents) => ({
	palette: palette,
	typography: {
		fontFamily: 'lexend, sans-serif',
	},
	shape: { borderRadius: 12 },
	components: {
		MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
		MuiButtonBase: { defaultProps: { disableRipple: true } },
		MuiDivider: { styleOverrides: { root: { borderColor: lightPalette.divider } } },
		...otherComponents,
	},
})

export const hospitalLightTheme = createTheme({
	...customTheme(lightPalette, {
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: 'rgba(255,255,255,0.6)',
					backdropFilter: 'saturate(180%) blur(8px)',
					borderBottom: '1px solid',
					borderColor: lightPalette.divider,
					borderRadius: 0,
				},
			},
		},
	}),
})

export const hospitalDarkTheme = createTheme({
	...customTheme(darkPalette, {
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: 'rgba(15,23,42,0.6)',
					backdropFilter: 'saturate(180%) blur(8px)',
					borderBottom: '1px solid',
					borderColor: darkPalette.divider,
					borderRadius: 0,
				},
			},
		},
	}),
})
