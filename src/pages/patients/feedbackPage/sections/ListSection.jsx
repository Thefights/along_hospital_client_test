import ReportFeedbackDialog from '@/components/dialogs/feedback/ReportFeedbackDialog'
import { ApiUrls } from '@/configs/apiUrls'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useTranslation from '@/hooks/useTranslation'
import { formatDatetimeToDDMMYYYY } from '@/utils/formatDateUtil'
import { Avatar, Box, Button, Paper, Rating, Stack, Typography } from '@mui/material'
import { useState } from 'react'

const ListSection = ({
	items,
	hasMore = false,
	onLoadMore = () => {},
	loading = false,
	onEdit = () => {},
	onDelete = () => {},
	canModify = () => false,
	currentUserId = null,
}) => {
	const { t } = useTranslation()
	const { auth } = useAuth()

	const reportSubmit = useAxiosSubmit({ url: ApiUrls.FEEDBACK_REPORT.INDEX, method: 'POST' })
	const [reportDialog, setReportDialog] = useState({ open: false, feedbackId: null })

	const Item = ({ review }) => {
		const isMe = String(review?.patientId ?? '') === String(currentUserId ?? '')
		const name = isMe ? t('commons.text.me') : review?.patientName
		const initials = name
			?.split(' ')
			.map((s) => s[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
		const canAct = !!canModify(review)
		return (
			<Stack direction='row' spacing={2} py={2} borderBottom={(t) => `1px solid ${t.palette.divider}`}>
				<Avatar>{initials}</Avatar>
				<Box flex={1}>
					<Stack direction='row' alignItems='center' spacing={1}>
						<Typography fontWeight={600}>{name}</Typography>
						<Rating size='small' value={review?.rating || 0} readOnly />
						<Box flex={1} />
						{canAct && (
							<Stack direction='row' spacing={1}>
								<Button size='small' variant='text' onClick={() => onEdit(review)}>
									{t('button.edit')}
								</Button>
								<Button size='small' variant='text' color='error' onClick={() => onDelete(review)}>
									{t('button.delete')}
								</Button>
							</Stack>
						)}

						{!isMe && (
							<Button
								size='small'
								variant='text'
								color='warning'
								onClick={() => {
									setReportDialog({ open: true, feedbackId: review?.id })
								}}
							>
								{t('button.report')}
							</Button>
						)}
					</Stack>
					{review?.content && <Typography sx={{ mt: 0.5 }}>{review?.content}</Typography>}
					<Typography variant='caption' color='text.secondary' sx={{ mt: 0.5 }}>
						{formatDatetimeToDDMMYYYY(review?.createdAt)}
					</Typography>
				</Box>
			</Stack>
		)
	}

	return (
		<>
			<Paper sx={{ p: 2, borderRadius: 2 }}>
				{items?.length === 0 && (
					<Typography color='text.secondary' py={3} textAlign='center'>
						{t('feedback.empty')}
					</Typography>
				)}

				{items?.map((rv) => (
					<Item key={rv.id} review={rv} />
				))}

				{hasMore && (
					<Box display='flex' justifyContent='center' mt={2}>
						<Button variant='outlined' onClick={onLoadMore} disabled={loading}>
							{t('button.load_more')}
						</Button>
					</Box>
				)}
			</Paper>

			<ReportFeedbackDialog
				open={!!reportDialog.open}
				onClose={() => setReportDialog({ open: false, feedbackId: null })}
				onSubmit={async (reason) => {
					if (!reportDialog.feedbackId) return
					const target = items?.find((x) => x.id === reportDialog.feedbackId)
					const isSelf = String(target?.patientId ?? '') === String(currentUserId ?? '')
					if (isSelf) return
					const payload = {
						feedbackId: reportDialog.feedbackId,
						reason: reason,
						reporterId: auth?.userId,
					}
					await reportSubmit.submit(payload)
				}}
			/>
		</>
	)
}

export default ListSection
