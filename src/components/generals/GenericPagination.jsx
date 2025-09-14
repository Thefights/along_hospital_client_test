import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Pagination, PaginationItem } from '@mui/material'

const GenericPagination = ({
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

export default GenericPagination
