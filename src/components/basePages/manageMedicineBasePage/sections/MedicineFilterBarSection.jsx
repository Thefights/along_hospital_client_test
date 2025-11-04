import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import useEnum from '@/hooks/useEnum'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Stack, Typography } from '@mui/material'

const MedicineFilterBarSection = ({
	filters,
	categories = [],
	loading = false,
	onFilterClick = () => {},
	onResetFilterClick = () => {},
}) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const { values, handleChange, setField, registerRef } = useForm(filters)
	const { renderField } = useFieldRenderer(
		values,
		setField,
		handleChange,
		registerRef,
		false,
		'outlined',
		'small'
	)

	const fields1st = [
		{
			key: 'medicineCategoryId',
			title: t('medicine.filter.category'),
			type: 'select',
			options: [
				{ value: '', label: t('text.all') },
				...(categories?.map((c) => ({ value: c.value, label: c.label })) || []),
			],
			required: false,
		},
		{
			key: 'medicineUnit',
			title: t('medicine.filter.unit'),
			type: 'select',
			options: [
				{ value: '', label: t('text.all') },
				...(_enum.medicineUnitOptions?.map((u) => ({ value: u.value, label: u.label })) || []),
			],
			required: false,
		},
	]

	const fields2nd = [
		{
			key: 'name',
			title: t('medicine.filter.searchPlaceholder'),
			type: 'search',
			required: false,
		},
	]

	return (
		<Stack
			spacing={1.5}
			sx={{
				pt: 1,
				pb: 2,
				px: 2,
				bgcolor: 'background.paper',
				border: (theme) => `1px solid ${theme.palette.divider}`,
				borderRadius: 1,
			}}
		>
			<Typography variant='caption'>{t('medicine.filter.title')}</Typography>

			<Stack direction='row' spacing={2} alignItems='center'>
				{fields1st.map(renderField)}
			</Stack>

			<Stack direction='row' spacing={2} alignItems='center'>
				{fields2nd.map(renderField)}
				<FilterButton onFilterClick={() => onFilterClick(values)} loading={loading} />
				<ResetFilterButton
					loading={loading}
					onResetFilterClick={onResetFilterClick}
					sx={{ minWidth: 180 }}
				/>
			</Stack>
		</Stack>
	)
}

export default MedicineFilterBarSection
