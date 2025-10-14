import { Stack, Typography } from '@mui/material'

const InfoRow = ({ label, value }) => {
	return (
		<Stack direction='row' justifyContent='space-between' alignItems='start'>
			<Typography variant='body2' sx={{ color: 'text.secondary' }}>
				{label}
			</Typography>
			<Typography variant='body2' sx={{ ml: 2, textAlign: 'right' }}>
				{value || '-'}
			</Typography>
		</Stack>
	)
}

export default InfoRow
