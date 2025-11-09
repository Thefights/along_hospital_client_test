import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Grid, Stack, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'

const OrderManagementFilterSection = ({
	filters,
	setFilters,
	loading = false,
	statusOptions = [],
}) => {
	const { t } = useTranslation()

	const { reset, values, handleChange, setField, registerRef } = useForm(filters)
	const { renderField } = useFieldRenderer(
		values,
		setField,
		handleChange,
		registerRef,
		false,
		'outlined',
		'small'
	)

	useEffect(() => {
		reset(filters)
	}, [filters, reset])

	const mappedStatusOptions = useMemo(
		() => [{ value: '', label: t('text.all') }, ...statusOptions],
		[statusOptions, t]
	)

	const fieldDefinitions = useMemo(
		() => [
			{
				key: 'status',
				title: t('order.field.status'),
				type: 'select',
				options: mappedStatusOptions,
				required: false,
			},
			{
				key: 'orderDate',
				title: t('order.field.order_date'),
				type: 'date',
				required: false,
				props: { InputLabelProps: { shrink: true } },
			},
			{
				key: 'deliveryDate',
				title: t('order.field.delivery_date'),
				type: 'date',
				required: false,
				props: { InputLabelProps: { shrink: true } },
			},
		],
		[mappedStatusOptions, t]
	)

	const handleApplyFilters = () => {
		const payload = {
			status: values.status || '',
			orderDate: values.orderDate || '',
			deliveryDate: values.deliveryDate || '',
		}
		setFilters(payload)
	}

	const handleResetFilters = () => {
		setFilters({ status: '', orderDate: '', deliveryDate: '' })
	}

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
			<Typography variant='caption'>{t('order.title.filters')}</Typography>

			<Grid container spacing={2} alignItems='flex-end'>
				{fieldDefinitions.map((field, index) => (
					<Grid key={field.key} size={index === 0 ? 2 : 3}>
						{renderField(field)}
					</Grid>
				))}
				<Grid
					size={4}
					sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.25 }}
				>
					<FilterButton sx={{ minWidth: 110 }} loading={loading} onFilterClick={handleApplyFilters} />
					<ResetFilterButton
						sx={{ minWidth: 140 }}
						loading={loading}
						onResetFilterClick={handleResetFilters}
					/>
				</Grid>
			</Grid>
		</Stack>
	)
}

export default OrderManagementFilterSection
