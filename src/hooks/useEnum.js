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
	}
}

// Usage Example:

// const _enum = useEnum();
// options: _enum.genderOptions,
// options: _enum.bloodTypeOptions,
// options: _enum.severityLevelOptions,
