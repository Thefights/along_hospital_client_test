import { useLocalStorage } from '@/hooks/useStorage'
import { DarkMode, LightMode } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'

const ThemeSwitcher = () => {
	const [theme, setTheme] = useLocalStorage('theme', 'light')

	return (
		<Tooltip title={`Change to ${theme === 'light' ? 'dark' : 'light'} mode`}>
			<IconButton
				onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
				sx={{ borderRadius: 2, color: 'text.primary' }}
			>
				{theme === 'light' ? <LightMode /> : <DarkMode />}
			</IconButton>
		</Tooltip>
	)
}

export default ThemeSwitcher
