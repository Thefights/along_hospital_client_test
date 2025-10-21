import SkeletonBox from '@/components/skeletons/SkeletonBox'
import { EnumConfig } from '@/configs/enumConfig'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { Button, Paper, Stack, Typography } from '@mui/material'

const MedicalHistoryDetailComplaintSection = ({
	complaint,
	role,
	loading = false,
	onClickCreateComplaint,
	onClickRespondComplaint,
}) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const hasComplaint = Boolean(complaint)

	const isPatientRole = role === EnumConfig.Role.Patient
	const isManagerRole = role === EnumConfig.Role.Manager

	const isResolvedStatus =
		complaint?.complaintResolveStatus === EnumConfig.ComplaintResolveStatus.Resolved
	const isDraftStatus = complaint?.complaintResolveStatus === EnumConfig.ComplaintResolveStatus.Draft
	const isClosedStatus =
		complaint?.complaintResolveStatus === EnumConfig.ComplaintResolveStatus.Closed

	if (loading) {
		return (
			<Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
				<Typography variant='h6' gutterBottom>
					{t('medical_history.title.complaint')}
				</Typography>
				<SkeletonBox numberOfBoxes={5} heights={[30, 30, 30, 30, 30]} />
			</Paper>
		)
	}

	return (
		<Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
			<Typography variant='h6' gutterBottom>
				{t('medical_history.title.complaint')}
			</Typography>
			{!hasComplaint ? (
				<Stack alignItems='center' justifyContent='center' spacing={2} sx={{ py: 4 }}>
					<Typography color='text.secondary'>{t('medical_history.placeholder.no_complaint')}</Typography>
					{isPatientRole && (
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
						{t('medical_history.field.complaint.content')}: {complaint?.content}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.complaint.response')}:{' '}
						{isResolvedStatus ? complaint?.response : '-'}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.complaint.type')}: {complaint?.complaintType}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.complaint.resolve_status')}:{' '}
						{isDraftStatus
							? getEnumLabelByValue(_enum.complaintResolveStatusOptions, 'Pending')
							: getEnumLabelByValue(
									_enum.complaintResolveStatusOptions,
									complaint?.complaintResolveStatus
							  )}
					</Typography>
					{isManagerRole && !isResolvedStatus && !isClosedStatus && (
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
