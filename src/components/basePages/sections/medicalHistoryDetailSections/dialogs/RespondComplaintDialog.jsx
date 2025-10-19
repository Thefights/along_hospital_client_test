import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import useTranslation from '@/hooks/useTranslation'

const RespondComplaintDialog = ({
	open,
	onClose,
	initialResponse,
	onSaveDraft = (values) => {},
	onReject = () => {},
	onSubmit = (values) => {},
}) => {
	const { t } = useTranslation()
	const fields = [{ key: 'response', title: 'Response Content', multiple: 2 }]

	return (
		<GenericFormDialog
			open={open}
			onClose={onClose}
			fields={fields}
			title='Respond to Complaint'
			initialValues={{ response: initialResponse }}
			submitButtonColor='primary'
			submitLabel={t('button.submit')}
			onSubmit={({ values }) => onSubmit(values)}
			additionalButtons={[
				{
					label: 'Save as draft',
					color: 'info',
					variant: 'outlined',
					onClick: ({ values }) => onSaveDraft(values),
				},
				{
					label: 'Close Complaint',
					color: 'error',
					variant: 'outlined',
					onClick: onReject,
				},
			]}
		/>
	)
}

export default RespondComplaintDialog
