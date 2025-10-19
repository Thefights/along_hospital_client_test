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

		complaintTopicOptions: [
			{ value: 'Service', label: t('enum.complaint_topic.service') },
			{ value: 'Billing', label: t('enum.complaint_topic.billing') },
			{ value: 'Doctor', label: t('enum.complaint_topic.doctor') },
			{ value: 'Medicine', label: t('enum.complaint_topic.medicine') },
			{ value: 'Others', label: t('enum.complaint_topic.others') },
		],
	}
}

// Usage Example:

// const _enum = useEnum();
// options: _enum.genderOptions,
// options: _enum.bloodTypeOptions,
// options: _enum.severityLevelOptions,
