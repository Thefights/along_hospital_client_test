import { Skeleton, Stack } from '@mui/material'

const SkeletonBox = ({ numberOfBoxes = 3, heights = [100, 200, 300] }) => {
	return (
		<Stack spacing={2}>
			{Array.from({ length: numberOfBoxes }).map((_, index) => (
				<Skeleton
					key={index}
					variant='rectangular'
					width='100%'
					height={heights[index % heights.length] || 200}
				/>
			))}
		</Stack>
	)
}

export default SkeletonBox
