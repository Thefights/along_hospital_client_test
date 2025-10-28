import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import SearchBar from '@/components/generals/SearchBar'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Grid, Paper } from '@mui/material'
import { useMemo } from 'react'

const BlogFilterBarSection = ({
	filters = {},
	setFilters = () => {},
	onResetFilterClick = () => {},
	loading = false,
}) => {
	const { t } = useTranslation()

	const { values, setField, handleChange } = useForm(filters)

	const fields = useMemo(() => {
		return [
			{
				key: 'publicationDate',
				title: t('text.date'),
				type: 'date',
				required: false,
			},
		]
	}, [t])

	const { renderField } = useFieldRenderer(
		values,
		setField,
		handleChange,
		() => {},
		false,
		'outlined',
		'small'
	)

	return (
		<Paper elevation={0} sx={{ borderRadius: 2, bgcolor: 'background.lightGray' }}>
			<Grid container spacing={2} alignItems='center'>
				<Grid size={{ xs: 12, md: 4 }}>
					<SearchBar
						widthPercent={100}
						value={values.title || ''}
						setValue={(value) => setField('title', value)}
						placeholder={t('text.search')}
						onEnterDown={() => setFilters(values)}
					/>
				</Grid>
				{fields.map((f) => (
					<Grid size={{ xs: 12, md: 2 }} key={f.key}>
						{renderField(f)}
					</Grid>
				))}
				<Grid size={{ xs: 12, md: 2 }}>
					<FilterButton
						onFilterClick={() => {
							setFilters(values)
						}}
						loading={loading}
						fullWidth
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 2 }}>
					<ResetFilterButton onResetFilterClick={onResetFilterClick} loading={loading} />
				</Grid>
			</Grid>
		</Paper>
	)
}

export default BlogFilterBarSection
