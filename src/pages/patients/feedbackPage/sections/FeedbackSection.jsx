import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import { ApiUrls } from '@/configs/apiUrls'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { maxLen, numberRange } from '@/utils/validateUtil'
import { Box, Grid, Rating, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import FilterSection from './FilterSection'
import ListSection from './ListSection'
import SummarySection from './SummarySection'

const FeedbackSection = ({
	feedbacks,
	loading = false,
	hasMore: hasMoreProp = false,
	onLoadMore,
}) => {
	const { t } = useTranslation()
	const { auth } = useAuth()
	const confirm = useConfirm()

	const [selectedStar, setSelectedStar] = useState(null)
	const [reviews, setReviews] = useState([])
	const [openCreate, setOpenCreate] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [editingItem, setEditingItem] = useState(null)

	const createFeedback = useAxiosSubmit({ url: ApiUrls.FEEDBACK.INDEX, method: 'POST' })
	const updateFeedback = useAxiosSubmit({
		url: ApiUrls.FEEDBACK.DETAIL(editingItem?.id),
		method: 'PUT',
	})
	const deleteFeedback = useAxiosSubmit({ url: ApiUrls.FEEDBACK.DETAIL(0), method: 'DELETE' })

	const getFeedbacksByMedicine = useFetch(ApiUrls.FEEDBACK.GET_FEEDBACK_BY_MEDICINE(1))

	useEffect(() => {
		if (Array.isArray(feedbacks)) {
			setReviews(feedbacks)
			return
		}
		const res = getFeedbacksByMedicine.data
		if (!res) return
		const items = Array.isArray(res) ? res : Array.isArray(res?.collection) ? res.collection : []
		setReviews(items)
	}, [feedbacks, getFeedbacksByMedicine.data])

	const distribution = useMemo(() => {
		const d = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
		reviews.forEach((r) => {
			const key = Number(r?.rating) || 0
			if (key >= 1 && key <= 5) d[key] = (d[key] || 0) + 1
		})
		return d
	}, [reviews])

	const total = reviews.length
	const average = useMemo(() => {
		if (!total) return 0
		const sum = reviews.reduce((acc, r) => acc + (Number(r?.rating) || 0), 0)
		return sum / total
	}, [total, reviews])

	const filtered = useMemo(() => {
		return selectedStar ? reviews.filter((r) => r.rating === selectedStar) : reviews
	}, [selectedStar, reviews])

	const visibleItems = filtered

	const summary = { total, average, distribution }

	const ratingLabels = useMemo(
		() => ({ 1: 'Bad', 2: 'Poor', 3: 'Average', 4: 'Good', 5: 'Excellent' }),
		[]
	)

	const StarRatingInput = ({ value, onChange, title }) => {
		const [hover, setHover] = useState(-1)
		const show = hover !== -1 ? hover : Number(value) || 0
		return (
			<Box
				sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, width: '100%' }}
			>
				{title ? (
					<Typography variant='h6' align='center' sx={{ mb: 0.75, fontWeight: 600 }}>
						{title}
					</Typography>
				) : null}
				<Rating
					name='rating'
					value={Number(value) || 0}
					max={5}
					precision={1}
					size='large'
					sx={{ '& .MuiRating-icon': { fontSize: 34 } }}
					onChange={(_, newValue) => onChange(newValue)}
					onChangeActive={(_, newHover) => setHover(newHover)}
				/>
				<Typography variant='body2' color='text.secondary' align='center'>
					{ratingLabels[show] || ''}
				</Typography>
			</Box>
		)
	}

	return (
		<>
			<Typography variant='h5' fontWeight={700} my={2}>
				{t('feedback.title')}
			</Typography>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12 }}>
					<SummarySection summary={summary} onOpenReview={() => setOpenCreate(true)} />
				</Grid>
				<Grid size={{ xs: 12 }}>
					<FilterSection
						selected={selectedStar}
						counts={distribution}
						onChange={(v) => {
							setSelectedStar(v)
						}}
					/>
				</Grid>
				<Grid size={{ xs: 12 }}>
					<ListSection
						items={visibleItems}
						hasMore={!!hasMoreProp}
						loading={!!loading}
						currentUserId={auth?.userId}
						onLoadMore={onLoadMore || (() => {})}
						canModify={(rv) => String(rv?.patientId ?? '') === String(auth?.userId ?? '')}
						onEdit={(rv) => {
							setEditingItem(rv)
							setOpenEdit(true)
						}}
						onDelete={async (rv) => {
							const ok = await confirm({
								title: t('feedback.title'),
								description: t('text.confirm_delete'),
								confirmText: t('button.delete'),
								confirmColor: 'error',
							})
							if (!ok) return
							const res = await deleteFeedback.submit(null, {
								overrideUrl: ApiUrls.FEEDBACK.DETAIL(rv.id),
							})
							if (res != null) setReviews((arr) => arr.filter((x) => x.id !== rv.id))
						}}
					/>
				</Grid>
			</Grid>

			<GenericFormDialog
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				fields={[
					{
						key: 'rating',
						title: 'Rating',
						type: 'custom',
						validate: [numberRange(1, 5)],
						required: true,
						render: ({ value, onChange }) => <StarRatingInput value={value} onChange={onChange} />,
					},
					{
						key: 'content',
						title: t('feedback.content'),
						validate: [maxLen(1000)],
						required: false,
						props: { placeholder: t('feedback.content_placeholder') },
					},
				]}
				initialValues={{ rating: 5, content: '' }}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				title={t('feedback.submit_review')}
				onSubmit={async ({ values, closeDialog }) => {
					const payload = {
						content: values.content,
						rating: Number(values.rating),
						patientId: auth?.userId,
						medicineId: 1,
					}
					const res = await createFeedback.submit(payload)
					if (res) {
						const item = {
							id: res?.id ?? Date.now(),
							userName: 'You',
							rating: payload.rating,
							content: payload.content,
							createdAt: new Date().toISOString(),
						}
						setReviews((arr) => [item, ...arr])
						closeDialog()
					}
				}}
			/>

			<GenericFormDialog
				open={openEdit}
				onClose={() => setOpenEdit(false)}
				fields={[
					{
						key: 'rating',
						title: 'Rating',
						type: 'custom',
						validate: [numberRange(1, 5)],
						required: true,
						render: ({ value, onChange }) => <StarRatingInput value={value} onChange={onChange} />,
					},
					{
						key: 'content',
						title: t('feedback.content'),
						validate: [maxLen(1000)],
						required: false,
						props: { placeholder: t('feedback.content_placeholder') },
					},
				]}
				initialValues={{ rating: editingItem?.rating ?? 5, content: editingItem?.content ?? '' }}
				submitLabel={t('button.update')}
				submitButtonColor='success'
				title={t('button.edit')}
				onSubmit={async ({ values, closeDialog }) => {
					if (!editingItem?.id) return
					const payload = {
						content: values.content,
						rating: Number(values.rating),
						patientId: auth?.userId,
						medicineId: 1,
					}
					const res = await updateFeedback.submit(payload)
					if (res) {
						setReviews((arr) =>
							arr.map((x) =>
								x.id === editingItem.id ? { ...x, rating: payload.rating, content: payload.content } : x
							)
						)
						closeDialog()
					}
				}}
			/>
		</>
	)
}

export default FeedbackSection
