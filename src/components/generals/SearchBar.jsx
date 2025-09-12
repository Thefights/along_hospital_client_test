import { Search } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'

const SearchBar = ({ widthPercent = 100, value, setValue, placeholder = 'Search...' }) => {
  return (
    <TextField
      sx={{ width: widthPercent + '%' }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size='small'
      placeholder={placeholder}
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
