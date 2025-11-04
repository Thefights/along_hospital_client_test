// Section bọc danh sách đánh giá
import { GenericPagination } from '@/components/generals/GenericPagination'
import useTranslation from '@/hooks/useTranslation'
import { formatDatetimeToDDMMYYYY } from '@/utils/formatDateUtil'
import { Avatar, Box, Paper, Rating, Stack, Typography } from '@mui/material'

const ListSection = ({ items, page, pageSize, total, onPageChange }) => {
	const { t } = useTranslation()

	// Component con nhỏ để hiển thị từng đánh giá
	const Item = ({ review }) => {
		const name = review?.userName || 'User'
		const initials = name
			?.split(' ')
			.map((s) => s[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
		return (
			<Stack direction='row' spacing={2} py={2} borderBottom={(t) => `1px solid ${t.palette.divider}`}>
				<Avatar>{initials}</Avatar>
				<Box flex={1}>
					<Stack direction='row' alignItems='center' spacing={1}>
						<Typography fontWeight={600}>{name}</Typography>
						<Rating size='small' value={review?.rating || 0} readOnly />
					</Stack>
					{review?.comment && <Typography sx={{ mt: 0.5 }}>{review.comment}</Typography>}
					<Typography variant='caption' color='text.secondary' sx={{ mt: 0.5 }}>
						{formatDatetimeToDDMMYYYY(review?.createdAt)}
					</Typography>
				</Box>
			</Stack>
		)
	}

	return (
		<Paper sx={{ p: 2, borderRadius: 2 }}>
			{/* Rỗng -> hiện thông báo; có dữ liệu -> render danh sách + phân trang */}
			{items?.length === 0 && (
				<Typography color='text.secondary' py={3} textAlign='center'>
					{t('feedback.empty')}
				</Typography>
			)}

			{items?.map((rv) => (
				<Item key={rv.id} review={rv} />
			))}

			<Box display='flex' justifyContent='center' mt={2}>
				<GenericPagination
					totalPage={Math.max(Math.ceil(total / Math.max(pageSize, 1)), 1)}
					page={page}
					setPage={onPageChange}
				/>
			</Box>
		</Paper>
	)
}

export default ListSection
