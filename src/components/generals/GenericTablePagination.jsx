import { MenuItem, Select, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import GenericPagination from './GenericPagination'

const GenericTablePagination = ({
	count = 1,
	page = 1,
	setPage = () => {},
	rowsPerPage,
	setRowsPerPage = () => {},
	rowsPerPageOptions = [5, 10, 25],
}) => {
	const rowsPerPageNum = useMemo(
		() => parseInt(rowsPerPage || rowsPerPageOptions?.[0] || 5, 10),
		[rowsPerPage]
	)

	return (
		<Stack
			direction='row'
			justifyContent='space-between'
			alignItems='center'
			flexWrap={'wrap'}
			marginX={4}
			marginY={2}
		>
			<Stack spacing={1} direction='row' alignItems='center'>
				<Typography>Rows per page:</Typography>
				<Select size='small' value={rowsPerPageNum} onChange={(e) => setRowsPerPage(e.target.value)}>
					{rowsPerPageOptions.map((option) => (
						<MenuItem key={option} value={option}>
							{option}
						</MenuItem>
					))}
				</Select>
			</Stack>
			<GenericPagination
				count={count}
				page={page}
				setPage={setPage}
				siblingCount={1}
				boundaryCount={2}
			/>
		</Stack>
	)
}

export default GenericTablePagination
