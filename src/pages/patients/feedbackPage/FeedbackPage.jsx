// Trang Feedback cho Patient: tổng quan, filter, danh sách đánh giá
import useTranslation from '@/hooks/useTranslation'
import { Grid, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import FilterSection from './sections/FilterSection'
import ListSection from './sections/ListSection'
import SummarySection from './sections/SummarySection'

// Dữ liệu tạm thời (mock); sẽ thay bằng API sau
const MOCK_REVIEWS = Array.from({ length: 12 }).map((_, i) => ({
	id: i + 1,
	userName: i === 0 ? 'Chị Nhiều' : `User ${i + 1}`,
	rating: i % 5 === 0 ? 5 : (i % 5) + 1,
	comment: i === 0 ? 'thuốc rất tốt' : 'Service was good and staff were friendly.',
	createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}))

const FeedbackPage = () => {
	const { t } = useTranslation()

	const [selectedStar, setSelectedStar] = useState(null)
	const [page, setPage] = useState(1)
	const pageSize = 5

	// Tính phân bố số lượng đánh giá theo sao (5→1)
	const distribution = useMemo(() => {
		const d = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
		MOCK_REVIEWS.forEach((r) => {
			d[r.rating] = (d[r.rating] || 0) + 1
		})
		return d
	}, [])

	const total = MOCK_REVIEWS.length
	// Điểm trung bình = tổng sao / tổng lượt
	const average = useMemo(() => {
		if (!total) return 0
		const sum = MOCK_REVIEWS.reduce((acc, r) => acc + (r.rating || 0), 0)
		return sum / total
	}, [total])

	// Lọc theo số sao được chọn; null = lấy tất cả
	const filtered = useMemo(() => {
		return selectedStar ? MOCK_REVIEWS.filter((r) => r.rating === selectedStar) : MOCK_REVIEWS
	}, [selectedStar])

	// Cắt dữ liệu theo trang hiện tại
	const paginated = useMemo(() => {
		const start = (page - 1) * pageSize
		return filtered.slice(start, start + pageSize)
	}, [filtered, page])

	const summary = { total, average, distribution }

	return (
		<>
			<Typography variant='h5' fontWeight={700} my={2}>
				{t('feedback.title')}
			</Typography>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12 }}>
					<SummarySection
						summary={summary}
						onOpenReview={() => {
							/* để trống: sẽ gắn mở dialog gửi đánh giá sau */
						}}
					/>
				</Grid>
				<Grid size={{ xs: 12 }}>
					<FilterSection
						selected={selectedStar}
						counts={distribution}
						onChange={(v) => {
							setSelectedStar(v)
							setPage(1)
						}}
					/>
				</Grid>
				<Grid size={{ xs: 12 }}>
					<ListSection
						items={paginated}
						page={page}
						pageSize={pageSize}
						total={filtered.length}
						onPageChange={setPage}
					/>
				</Grid>
			</Grid>
		</>
	)
}

export default FeedbackPage
