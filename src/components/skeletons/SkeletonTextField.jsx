import { Skeleton, Stack } from '@mui/material'

const SkeletonTextField = ({ numberOfRow = 3 }) => {
	return (
		<Stack spacing={2}>
			{Array.from({ length: numberOfRow }).map((_, i) => (
				<Skeleton key={i} variant='rounded' height={50} animation='wave' />
			))}
		</Stack>
	)
}

export default SkeletonTextField
