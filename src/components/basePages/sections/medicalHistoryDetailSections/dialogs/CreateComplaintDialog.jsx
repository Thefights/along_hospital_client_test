import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'

const CreateComplaintDialog = ({ open, onClose, onSubmit = () => {} }) => {
	const { t } = useTranslation()
	const { complaintTopicOptions } = useEnum()

	const fields = [
		{
			key: 'complaintTopic',
			title: 'Complaint Topic',
			type: 'select',
			options: complaintTopicOptions,
		},
		{ key: 'content', title: 'Complaint Content', type: 'textArea', multiple: 3 },
	]

	return (
		<GenericFormDialog
			open={open}
			onClose={onClose}
			fields={fields}
			title='Create Complaint'
			submitLabel={t('button.create')}
			submitButtonColor='primary'
			onSubmit={onSubmit}
		/>
	)
}

export default CreateComplaintDialog
