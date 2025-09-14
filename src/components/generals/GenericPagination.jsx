import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { MenuItem, Pagination, PaginationItem, Select, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'

export const GenericPagination = ({
	count = 1,
	page = 1,
	setPage = () => {},
	siblingCount = 2,
	boundaryCount = 1,
}) => {
	return (
		<Pagination
			count={Math.max(count, 1)}
			page={page}
			onChange={(event, value) => setPage(value)}
			showFirstButton
			showLastButton
			shape='rounded'
			color='primary'
			siblingCount={siblingCount}
			boundaryCount={boundaryCount}
			renderItem={(item) => (
				<PaginationItem slots={{ previous: ArrowBack, next: ArrowForward }} {...item} />
			)}
		/>
	)
}

export const GenericTablePagination = ({
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
		<Stack direction='row' justifyContent='space-between' alignItems='center' flexWrap={'wrap'} m={2}>
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
				count={count ? Math.ceil(count / rowsPerPageNum) : 1}
				page={page}
				setPage={setPage}
				siblingCount={1}
				boundaryCount={2}
			/>
		</Stack>
	)
}
