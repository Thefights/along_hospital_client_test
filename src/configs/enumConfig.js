import { getTranslation } from '@/hooks/useTranslation'

const bloodTypeOptions = ['O', 'A', 'B', 'AB']

const genderOptions = [
	{ value: 'Male', label: getTranslation('enum.gender.male') },
	{ value: 'Female', label: getTranslation('enum.gender.female') },
	{ value: 'Other', label: getTranslation('enum.gender.other') },
]

const severityLevelOptions = [
	{ value: 'Mild', label: getTranslation('enum.severity_level.mild') },
	{ value: 'Moderate', label: getTranslation('enum.severity_level.moderate') },
	{ value: 'Severe', label: getTranslation('enum.severity_level.severe') },
]

export const EnumConfig = {
	bloodTypeOptions,
	genderOptions,
	severityLevelOptions,
}
