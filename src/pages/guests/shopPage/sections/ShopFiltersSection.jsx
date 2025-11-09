import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import useEnum from '@/hooks/useEnum'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Box, Stack } from '@mui/material'
import { useEffect } from 'react'

const ShopFilters = ({
	filters,
	categories = [],
	loading = false,
	onFilterClick,
	onResetFilterClick,
}) => {
	const { t } = useTranslation()
	const { reset, values, handleChange, setField, registerRef } = useForm(filters)
	const { renderField } = useFieldRenderer(values, setField, handleChange, registerRef)

	const _enum = useEnum()

	const fields = [
		{ key: 'name', title: t('text.search'), type: 'search' },
		{
			key: 'medicineCategoryId',
			title: t('medicine.filter.category'),
			type: 'select',
			options: [
				{ value: '', label: t('text.all') },
				...categories.map((c) => ({ value: c.id, label: c.name })),
			],
			require: false,
		},
		{
			key: 'medicineUnit',
			title: t('medicine.filter.unit'),
			type: 'select',
			options: [{ value: '', label: t('text.all') }, ...(_enum.medicineUnitOptions || [])],
			require: false,
		},
	]

	useEffect(() => {
		reset(filters)
	}, [filters, reset])

	return (
		<Stack spacing={2} alignItems='left' flexWrap='wrap'>
			{fields.map((field, index) => (
				<Box key={index} sx={{ flex: 1, minWidth: 150 }}>
					{renderField(field)}
				</Box>
			))}

			<FilterButton
				onFilterClick={() => onFilterClick(values)}
				loading={loading}
				sx={{ minWidth: 100 }}
			>
				{t('button.filter')}
			</FilterButton>
			<ResetFilterButton
				onResetFilterClick={onResetFilterClick}
				loading={loading}
				sx={{ minWidth: 100 }}
			>
				{t('button.reset')}
			</ResetFilterButton>
		</Stack>
	)
}

export default ShopFilters
