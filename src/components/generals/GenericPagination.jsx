import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { MenuItem, Pagination, PaginationItem, Select, Stack, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'

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
			page={Math.max(page, 1)}
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

	const totalPages = useMemo(() => {
		return Math.max(Math.ceil((count || 0) / rowsPerPageNum), 1)
	}, [count, rowsPerPageNum])

	useEffect(() => {
		setPage(1)
	}, [rowsPerPageNum, setPage])

	useEffect(() => {
		if (page > totalPages) setPage(totalPages)
	}, [page, totalPages])

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
				count={totalPages}
				page={page}
				setPage={setPage}
				siblingCount={1}
				boundaryCount={2}
			/>
		</Stack>
	)
}
