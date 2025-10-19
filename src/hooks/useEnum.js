import useTranslation from './useTranslation'

export default function useEnum() {
	const { t } = useTranslation()
	return {
		bloodTypeOptions: ['O', 'A', 'B', 'AB'],

		genderOptions: [
			{ value: 'Male', label: t('enum.gender.male') },
			{ value: 'Female', label: t('enum.gender.female') },
			{ value: 'Other', label: t('enum.gender.other') },
		],

		severityLevelOptions: [
			{ value: 'Mild', label: t('enum.severity_level.mild') },
			{ value: 'Moderate', label: t('enum.severity_level.moderate') },
			{ value: 'Severe', label: t('enum.severity_level.severe') },
		],

		medicalHistoryStatusOptions: [
			{ value: 'Draft', label: t('enum.medical_history_status.draft') },
			{ value: 'Processed', label: t('enum.medical_history_status.processed') },
			{ value: 'Paid', label: t('enum.medical_history_status.paid') },
		],

		complaintTopicOptions: [
			{ value: 'Service', label: t('enum.complaint_topic.service') },
			{ value: 'Billing', label: t('enum.complaint_topic.billing') },
			{ value: 'Doctor', label: t('enum.complaint_topic.doctor') },
			{ value: 'Medicine', label: t('enum.complaint_topic.medicine') },
			{ value: 'Others', label: t('enum.complaint_topic.others') },
		],

		complaintResolveStatusOptions: [
			{ value: 'Pending', label: t('enum.complaint_resolve_status.pending') },
			{ value: 'Drafted', label: t('enum.complaint_resolve_status.drafted') },
			{ value: 'Resolved', label: t('enum.complaint_resolve_status.resolved') },
			{ value: 'Closed', label: t('enum.complaint_resolve_status.closed') },
		],
	}
}

// Usage Example:

// const _enum = useEnum();
// options: _enum.genderOptions,
// options: _enum.bloodTypeOptions,
// options: _enum.severityLevelOptions,
