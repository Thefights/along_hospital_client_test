import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

const DrawerInfoRow = ({ label, value }) => {
	const renderValue =
		typeof value === 'function'
			? value()
			: React.isValidElement(value)
			? value
			: (value ?? value === 0) && value !== ''
			? String(value)
			: '-'

	return (
		<Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
			<Typography
				variant='body2'
				sx={{ color: 'text.secondary', whiteSpace: 'nowrap', flexShrink: 0 }}
			>
				{label}
			</Typography>
			<Box sx={{ flex: 1, minWidth: 0 }}>
				{typeof renderValue === 'string' ? (
					<Typography
						variant='body2'
						sx={{
							textAlign: 'right',
							wordBreak: 'break-word',
							overflowWrap: 'anywhere',
						}}
					>
						{renderValue}
					</Typography>
				) : (
					<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>{renderValue}</Box>
				)}
			</Box>
		</Stack>
	)
}

export default DrawerInfoRow
