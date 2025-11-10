import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Button, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'

const ManagerMedicineCategoryManagementFilterSection = ({
	filters,
	loading = false,
	onFilterClick = () => {},
	onResetFilterClick = () => {},
	setOpenCreateDialog,
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

	const fields = [
		{
			key: 'name',
			title: t('text.search'),
			type: 'search',
			required: false,
		},
	]

	useEffect(() => {
		reset(filters)
	}, [filters, reset])

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
			<Typography variant='caption'>{t('medicine_category.title.filter')}</Typography>

			<Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between'>
				<Stack direction='row' spacing={2} alignItems='center' flex={0.75}>
					{fields.map(renderField)}

					<FilterButton
						onFilterClick={() => onFilterClick(values)}
						loading={loading}
						sx={{ minWidth: 100 }}
					/>
					<ResetFilterButton
						loading={loading}
						onResetFilterClick={onResetFilterClick}
						sx={{ minWidth: 180 }}
					/>
				</Stack>

				<Button
					variant='contained'
					color='success'
					onClick={() => setOpenCreateDialog(true)}
					sx={{ minWidth: 120 }}
				>
					{t('button.create')}
				</Button>
			</Stack>
		</Stack>
	)
}

export default ManagerMedicineCategoryManagementFilterSection
