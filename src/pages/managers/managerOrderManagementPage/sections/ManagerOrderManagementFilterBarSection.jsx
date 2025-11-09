import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import useEnum from '@/hooks/useEnum'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Grid, Stack, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'

const ManagerOrderManagementFilterBarSection = ({ filters, setFilters, loading = false }) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const initialValues = useMemo(
		() => ({
			OrderStatus: filters.orderStatus || '',
			OrderDate: filters.orderDate || '',
			DeliveryDate: filters.deliveryDate || '',
		}),
		[]
	)

	const { reset, values, handleChange, setField, registerRef } = useForm(initialValues)
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
		reset(initialValues)
	}, [initialValues, reset])

	const mappedStatusOptions = useMemo(
		() => [{ value: '', label: t('text.all') }, ..._enum.orderStatusOptions],
		[_enum, t]
	)

	const fieldDefinitions = useMemo(
		() => [
			{
				key: 'OrderStatus',
				title: t('order_management.field.status'),
				type: 'select',
				options: mappedStatusOptions,
				required: false,
			},
			{
				key: 'OrderDate',
				title: t('order_management.field.order_date'),
				type: 'date',
				required: false,
				props: { InputLabelProps: { shrink: true } },
			},
			{
				key: 'DeliveryDate',
				title: t('order_management.field.delivery_date'),
				type: 'date',
				required: false,
				props: { InputLabelProps: { shrink: true } },
			},
		],
		[mappedStatusOptions, t]
	)

	const handleApplyFilters = () => {
		setFilters({
			orderStatus: values.OrderStatus || '',
			orderDate: values.OrderDate || '',
			deliveryDate: values.DeliveryDate || '',
		})
	}

	const handleResetFilters = () => {
		setFilters({ orderStatus: '', orderDate: '', deliveryDate: '' })
		reset({ OrderStatus: '', OrderDate: '', DeliveryDate: '' })
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
			<Typography variant='caption'>{t('order_management.title.filters')}</Typography>
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

export default ManagerOrderManagementFilterBarSection
