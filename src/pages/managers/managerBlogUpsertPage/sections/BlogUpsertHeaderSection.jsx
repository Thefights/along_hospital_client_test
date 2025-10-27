import { ArrowBack } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'

const BlogUpsertHeaderSection = ({ title, backLabel, onBack, disabled }) => {
	return (
		<Stack direction='row' alignItems='center' spacing={2} mb={3}>
			<Button startIcon={<ArrowBack />} onClick={onBack} variant='outlined' disabled={disabled}>
				{backLabel}
			</Button>
			<Typography variant='h5' fontWeight='bold'>
				{title}
			</Typography>
		</Stack>
	)
}

export default BlogUpsertHeaderSection
