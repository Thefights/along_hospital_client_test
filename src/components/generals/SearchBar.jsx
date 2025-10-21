import useTranslation from '@/hooks/useTranslation'
import { Close, Search } from '@mui/icons-material'
import { Autocomplete, IconButton, InputAdornment, TextField } from '@mui/material'

const SearchBar = ({
	widthPercent = 100,
	value,
	setValue,
	placeholder,
	options = [],
	getOptionLabel = (opt) => opt?.label || opt,
	onEnterDown = () => {},
}) => {
	const { t } = useTranslation()
	const isAutocomplete = Array.isArray(options) && options.length > 0

	const commonProps = {
		sx: { width: widthPercent + '%' },
		size: 'small',
		placeholder: placeholder || t('text.search'),
	}

	return isAutocomplete ? (
		<Autocomplete
			freeSolo
			options={options}
			value={value}
			onChange={(_, newValue) => setValue(newValue)}
			getOptionLabel={getOptionLabel}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault()
					onEnterDown?.()
				}
			}}
			sx={{ width: widthPercent + '%' }}
			renderInput={(params) => (
				<TextField
					{...params}
					{...commonProps}
					sx={{ width: '100%' }}
					InputProps={{
						...params.InputProps,
						startAdornment: (
							<InputAdornment position='start' sx={{ ml: 1 }}>
								<Search />
							</InputAdornment>
						),
						disableUnderline: true,
					}}
				/>
			)}
		/>
	) : (
		<TextField
			{...commonProps}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault()
					onEnterDown?.()
				}
			}}
			slotProps={{
				input: {
					startAdornment: (
						<InputAdornment position='start'>
							<Search />
						</InputAdornment>
					),
					endAdornment: value && value !== '' && (
						<InputAdornment position='end'>
							<IconButton size='small' disableTouchRipple onClick={() => setValue('')} sx={{ mr: -1 }}>
								<Close sx={{ fontSize: '1.25rem' }} />
							</IconButton>
						</InputAdornment>
					),
				},
			}}
		/>
	)
}

export default SearchBar

// Usage example:

/*
<SearchBar
	widthPercent={50}
	value={searchTerm}
	setValue={setSearchTerm}
	placeholder="Search items..."
/>
*/
