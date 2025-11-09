import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Stack, Typography } from '@mui/material'
import { useEffect } from 'react'

const ManagerMedicalServiceManagementFilterBarSection = ({
	filters,
	loading = false,
	onFilterClick = () => {},
	onResetFilterClick = () => {},
}) => {
	const { t } = useTranslation()
	const { values, handleChange, setField, registerRef, reset } = useForm(filters)
	const { renderField } = useFieldRenderer(
		values,
		setField,
		handleChange,
		registerRef,
		false,
		'outlined',
		'small'
	)

	const fields = [{ key: 'name', title: t('text.search'), type: 'search', required: false }]

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
			<Typography variant='caption'>{t('department.title.filter')}</Typography>
			<Stack direction='row' spacing={2} alignItems='center'>
				{fields.map(renderField)}
				<FilterButton onFilterClick={() => onFilterClick(values)} loading={loading} />
				<ResetFilterButton
					loading={loading}
					onResetFilterClick={() => onResetFilterClick(reset)}
					sx={{ minWidth: 180 }}
				/>
			</Stack>
		</Stack>
	)
}

export default ManagerMedicalServiceManagementFilterBarSection
