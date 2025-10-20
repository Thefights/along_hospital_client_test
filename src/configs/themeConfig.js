import { alpha, createTheme } from '@mui/material'
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
		main: '#00897B',
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
		lightBlue: '#E3F2FD',
		lightGray: '#F1F5F9',
	},
	text: {
		primary: '#0F172A',
		secondary: '#475569',
		disabled: '#94A3B8',
		blue: {
			light: '#90CAF9',
			main: '#42A5F5',
			dark: '#1976D2',
		},
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
		background: 'linear-gradient(135deg, #F9FBFD 0%, #F3FFFD 100%)',
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
		lightBlue: '#1E40AF',
		lightGray: '#1E293B',
	},
	text: {
		primary: '#E2E8F0',
		secondary: '#94A3B8',
		disabled: '#64748B',
		blue: {
			light: '#64B5F6',
			main: '#2196F3',
			dark: '#1976D2',
		},
	},
	divider: '#334155',
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
		brand_45deg: 'linear-gradient(45deg, #1565C0 0%, #00897B 100%)',
		brand_135deg: 'linear-gradient(135deg, #1565C0 0%, #00897B 100%)',
		brand_reverse_45deg: 'linear-gradient(45deg, #00897B 0%, #1565C0 100%)',
		brand_reverse_135deg: 'linear-gradient(135deg, #00897B 0%, #1565C0 100%)',
		calm: 'linear-gradient(135deg, #0D1B2A 0%, #122C34 100%)',
		background: 'linear-gradient(135deg, #0A1929 0%, #001E1F 100%)',
	},
}

const customTheme = (palette, otherComponents) => ({
	palette: palette,
	typography: {
		fontFamily: 'lexend, sans-serif',
	},
	shape: { borderRadius: 12 },
	components: {
		MuiCssBaseline: {
			styleOverrides: (theme) => ({
				'::-webkit-scrollbar': {
					width: 8,
				},
				'::-webkit-scrollbar-thumb': {
					backgroundColor: alpha(theme.palette.text.primary, 0.1),
					borderRadius: 4,
				},
				'::-webkit-scrollbar-thumb:hover': {
					backgroundColor: alpha(theme.palette.text.primary, 0.3),
				},
				'::-webkit-scrollbar-corner': {
					background: 'transparent',
				},
			}),
		},
		MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
		MuiButtonBase: { defaultProps: { disableRipple: true } },
		MuiDivider: { styleOverrides: { root: { borderColor: palette.divider } } },
		MuiIconButton: { styleOverrides: { root: { color: palette.text.primary } } },
		MuiFormLabel: {
			styleOverrides: {
				root: {
					color: palette.text.secondary,
					opacity: 0.9,
					'&.Mui-focused': { color: palette.primary.main, opacity: 1 },
					'&.Mui-error': { color: palette.error.main, opacity: 1 },
					'&.Mui-disabled': {
						color: palette.text.secondary,
						opacity: 0.7,
					},
				},
			},
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					'&:has(.MuiOutlinedInput-root input[readonly]) .MuiInputLabel-root': {
						color: palette.info.main,
						opacity: 1,
					},
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					'&.Mui-disabled': {
						opacity: 1,
						backgroundColor:
							palette.action?.disabledBackground || (palette.mode === 'dark' ? '#0F172A' : '#F3F4F6'),
					},
					'&.Mui-disabled .MuiInputBase-input': {
						color: palette.text.secondary,
						WebkitTextFillColor: palette.text.secondary,
					},
				},
				input: {
					'&.Mui-disabled': {
						color: palette.text.secondary,
						WebkitTextFillColor: palette.text.secondary,
					},
					'&[readonly]': {
						backgroundColor: palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
						cursor: 'default',
						caretColor: 'transparent',
					},
				},
			},
		},

		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					'&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
						borderColor: palette.divider,
					},
					'&:has(input[readonly])': {
						backgroundColor: palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFF',
					},
					'&:has(input[readonly]) .MuiOutlinedInput-notchedOutline': {
						borderColor: palette.primary.main,
					},
				},
				input: {
					'&[readonly]': {
						color: palette.text.primary,
					},
				},
			},
		},
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
		MuiTextField: {
			variants: [
				{
					props: { type: 'date' },
					style: {
						'& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' },
					},
				},
				{
					props: { type: 'time' },
					style: {
						'& input::-webkit-calendar-picker-indicator': {
							filter: 'invert(1)',
							opacity: 0.9,
						},
						'& input::-webkit-clear-button': { display: 'none' },
						'& input::-webkit-datetime-edit': { color: 'inherit' },
					},
				},
			],
		},
	}),
})
