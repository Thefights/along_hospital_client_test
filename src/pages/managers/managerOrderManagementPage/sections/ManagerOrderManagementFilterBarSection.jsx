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
			orderStatus: filters.orderStatus || '',
			orderDate: filters.orderDate || '',
			deliveryDate: filters.deliveryDate || '',
		}),
		[]
	)

	const { values, handleChange, setField, registerRef, reset } = useForm(initialValues)
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
				key: 'orderStatus',
				title: t('order_management.field.status'),
				type: 'select',
				options: mappedStatusOptions,
				required: false,
			},
			{
				key: 'orderDate',
				title: t('order_management.field.order_date'),
				type: 'date',
				required: false,
			},
			{
				key: 'deliveryDate',
				title: t('order_management.field.delivery_date'),
				type: 'date',
				required: false,
			},
		],
		[mappedStatusOptions, t]
	)

	const handleApplyFilters = () => setFilters(values)

	const handleResetFilters = () => {
		const empty = { orderStatus: '', orderDate: '', deliveryDate: '' }
		reset(empty)
		setFilters(empty)
	}

	return (
		<Stack
			spacing={1.5}
			size={{
				pt: 1,
				pb: 2,
				px: 2,
				borderRadius: 1,
				border: (theme) => `1px solid ${theme.palette.divider}`,
			}}
		>
			<Typography variant='caption'>{t('order_management.title.filters')}</Typography>
			<Grid container spacing={2} alignItems='flex-end'>
				{fieldDefinitions.map((field) => (
					<Grid key={field.key} xs={2}>
						{renderField({
							...field,
							props: { size: { width: 200 } },
						})}
					</Grid>
				))}
				<Grid xs={2}>
					<Stack direction='row' justifyContent='flex-end' spacing={0.5}>
						<FilterButton loading={loading} onFilterClick={handleApplyFilters} />
						<ResetFilterButton loading={loading} onResetFilterClick={handleResetFilters} />
					</Stack>
				</Grid>
			</Grid>
		</Stack>
	)
}

export default ManagerOrderManagementFilterBarSection
