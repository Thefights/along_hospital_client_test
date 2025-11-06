import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import useTranslation from '@/hooks/useTranslation'

const ReportFeedbackDialog = ({ open, onClose, onSubmit, initialReason = '' }) => {
	const { t } = useTranslation()

	return (
		<GenericFormDialog
			open={!!open}
			onClose={onClose}
			title={t('feedback.report_title')}
			initialValues={{ reason: initialReason || '' }}
			fields={[
				{
					key: 'reason',
					title: t('feedback.report_reason'),
					multiple: 1,
					required: true,
				},
			]}
			submitLabel={t('button.report')}
			submitButtonColor='warning'
			onSubmit={async ({ values, closeDialog }) => {
				const result = await onSubmit?.(values.reason)
				if (result) closeDialog()
			}}
		/>
	)
}

export default ReportFeedbackDialog
