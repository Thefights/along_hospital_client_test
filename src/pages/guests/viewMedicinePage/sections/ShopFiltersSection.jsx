import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { Box, Stack } from '@mui/material'

const ShopFilters = ({ filters, categories = [], loading, onFilterChange, onResetClick }) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const handleChange = (key, value) => {
		onFilterChange?.({ [key]: value })
	}

	const filterFields = [
		{
			key: 'medicineCategoryId',
			title: t('medicine.filter.category'),
			type: 'select',
			options: [
				{ value: '', label: t('text.all') },
				...(categories?.map((c) => ({ value: c.id, label: c.name })) || []),
			],
		},
		{
			key: 'medicineUnit',
			title: t('medicine.filter.unit'),
			type: 'select',
			options: [
				{ value: '', label: t('text.all') },
				...(_enum.medicineUnitOptions?.map((u) => ({ value: u.value, label: u.label })) || []),
			],
		},
	]

	return (
		<Stack spacing={2}>
			<ValidationTextField
				fullWidth
				size='small'
				label={t('medicine.filter.searchPlaceholder')}
				value={filters.name}
				onChange={(e) => handleChange('name', e.target.value)}
			/>

			{filterFields.map((field) => (
				<ValidationTextField
					key={field.key}
					fullWidth
					select
					size='small'
					label={field.title}
					value={filters[field.key]}
					onChange={(e) => handleChange(field.key, e.target.value)}
				>
					{field.options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</ValidationTextField>
			))}

			<Box sx={{ display: 'flex', gap: 1 }}>
				<FilterButton
					fullWidth
					size='large'
					onClick={() => onFilterChange?.(filters)}
					loading={loading}
				>
					{t('button.filter')}
				</FilterButton>
				<ResetFilterButton fullWidth size='large' onClick={onResetClick} loading={loading}>
					{t('button.reset')}
				</ResetFilterButton>
			</Box>
		</Stack>
	)
}

export default ShopFilters
