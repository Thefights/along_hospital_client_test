import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import useTranslation from '@/hooks/useTranslation'

const UpdateMedicalHistoryDialog = ({
	open,
	onClose,
	medicalHistory = {},
	onSubmit = (values) => {},
}) => {
	const { t } = useTranslation()

	const fields = [
		{ key: 'diagnosis', title: t('medical_history.field.diagnosis'), multiple: 2 },
		{
			key: 'followUpAppointmentDate',
			title: t('medical_history.field.follow_up_appointment_date'),
			type: 'date',
			required: false,
		},
	]

	return (
		<GenericFormDialog
			open={open}
			onClose={onClose}
			fields={fields}
			initialValues={medicalHistory}
			title={t('medical_history.dialog.title.update_medical_history')}
			submitButtonColor='success'
			submitLabel={t('button.update')}
			onSubmit={({ values }) => onSubmit(values)}
		/>
	)
}

export default UpdateMedicalHistoryDialog
