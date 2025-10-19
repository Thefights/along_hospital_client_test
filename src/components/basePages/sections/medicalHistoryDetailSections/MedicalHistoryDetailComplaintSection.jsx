import { Button, Paper, Stack, Typography } from '@mui/material'

const MedicalHistoryDetailComplaintSection = ({
	complaint,
	role,
	onClickCreateComplaint,
	onClickRespondComplaint,
}) => {
	const hasComplaint = Boolean(complaint)

	const isComplaintDone = complaint?.complaintResolveStatus === 'Resolved'

	return (
		<Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
			<Typography variant='h6' gutterBottom>
				Complaint
			</Typography>
			{!hasComplaint ? (
				<Stack alignItems='center' justifyContent='center' spacing={2} sx={{ py: 4 }}>
					<Typography color='text.secondary'>No complaint yet</Typography>
					{role === 'Patient' && (
						<Button variant='contained' onClick={onClickCreateComplaint}>
							Create Complaint
						</Button>
					)}
				</Stack>
			) : (
				<Stack spacing={1}>
					<Typography variant='body2'>Topic: {complaint?.complaintTopic}</Typography>
					<Typography variant='body2'>Content: {complaint?.Content}</Typography>
					<Typography variant='body2'>
						Response: {isComplaintDone ? complaint?.response : '-'}
					</Typography>
					<Typography variant='body2'>Type: {complaint?.complaintType}</Typography>
					<Typography variant='body2'>
						Status:{' '}
						{complaint?.complaintResolveStatus === 'Drafted'
							? 'Pending'
							: complaint?.complaintResolveStatus}
					</Typography>
					{role === 'Manager' && !isComplaintDone && complaint?.complaintResolveStatus !== 'Closed' && (
						<Button variant='contained' sx={{ mt: 2 }} onClick={onClickRespondComplaint}>
							Respond
						</Button>
					)}
				</Stack>
			)}
		</Paper>
	)
}

export default MedicalHistoryDetailComplaintSection
