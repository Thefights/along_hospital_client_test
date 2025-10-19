import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { Button, Paper, Stack, Typography } from '@mui/material'

const MedicalHistoryDetailComplaintSection = ({
	complaint,
	role,
	onClickCreateComplaint,
	onClickRespondComplaint,
}) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const hasComplaint = Boolean(complaint)
	const isComplaintDone = complaint?.complaintResolveStatus === 'Resolved'

	return (
		<Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
			<Typography variant='h6' gutterBottom>
				{t('medical_history.title.complaint')}
			</Typography>
			{!hasComplaint ? (
				<Stack alignItems='center' justifyContent='center' spacing={2} sx={{ py: 4 }}>
					<Typography color='text.secondary'>{t('medical_history.placeholder.no_complaint')}</Typography>
					{role === 'Patient' && (
						<Button variant='contained' onClick={onClickCreateComplaint}>
							{t('medical_history.button.create_complaint')}
						</Button>
					)}
				</Stack>
			) : (
				<Stack spacing={1}>
					<Typography variant='body2'>
						{t('medical_history.field.complaint.topic')}: {complaint?.complaintTopic}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.complaint.content')}: {complaint?.Content}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.complaint.response')}: {isComplaintDone ? complaint?.response : '-'}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.complaint.type')}: {complaint?.complaintType}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.complaint.resolve_status')}:{' '}
						{complaint?.complaintResolveStatus === 'Drafted'
							? getEnumLabelByValue(_enum.complaintResolveStatusOptions, 'Pending')
							: getEnumLabelByValue(
									_enum.complaintResolveStatusOptions,
									complaint?.complaintResolveStatus
							  )}
					</Typography>
					{role === 'Manager' && !isComplaintDone && complaint?.complaintResolveStatus !== 'Closed' && (
						<Button variant='contained' sx={{ mt: 2 }} onClick={onClickRespondComplaint}>
							{t('medical_history.button.respond_complaint')}
						</Button>
					)}
				</Stack>
			)}
		</Paper>
	)
}

export default MedicalHistoryDetailComplaintSection
