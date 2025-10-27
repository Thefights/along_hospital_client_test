import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import SearchBar from '@/components/generals/SearchBar'
import useEnum from '@/hooks/useEnum'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import useTranslation from '@/hooks/useTranslation'
import { Grid, Paper } from '@mui/material'
import { useMemo } from 'react'

const BlogFilterBarSection = ({
	filters = {},
	setFilters = () => {},
	onFilterClick = () => {},
	onResetFilterClick = () => {},
	loading = false,
}) => {
	const { t } = useTranslation()
	const { blogTypeOptions } = useEnum()

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

	const setField = (key, value) => {
		setFilters({ ...filters, [key]: value })
	}

	const handleChange = (e) => {
		const { name, value } = e.target || {}
		if (!name) return
		setFilters({ ...filters, [name]: value })
	}

	const { renderField } = useFieldRenderer(
		filters,
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
						value={filters.title || ''}
						setValue={(value) => setFilters({ ...filters, title: value })}
						placeholder={t('blogPage.titleLabel')}
						onEnterDown={() => onFilterClick()}
					/>
				</Grid>
				{fields.map((f) => (
					<Grid size={{ xs: 12, md: 2 }} key={f.key}>
						{renderField(f)}
					</Grid>
				))}
				<Grid size={{ xs: 12, md: 2 }}>
					<FilterButton onFilterClick={onFilterClick} loading={loading} fullWidth />
				</Grid>
				<Grid size={{ xs: 12, md: 2 }}>
					<ResetFilterButton onResetFilterClick={onResetFilterClick} loading={loading} />
				</Grid>
			</Grid>
		</Paper>
	)
}

export default BlogFilterBarSection
