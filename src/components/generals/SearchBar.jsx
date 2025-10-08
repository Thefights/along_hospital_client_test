import useTranslation from '@/hooks/useTranslation'
import { Search } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'

const SearchBar = ({ widthPercent = 100, value, setValue, placeholder }) => {
	const { t } = useTranslation()

	return (
		<TextField
			sx={{ width: widthPercent + '%' }}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			size='small'
			placeholder={placeholder || t('text.search')}
			slotProps={{
				input: {
					startAdornment: (
						<InputAdornment position='start'>
							<Search />
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
