import GenericTabs from '@/components/generals/GenericTabs'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { Stack, Typography } from '@mui/material'

const BlogTabsSection = ({
	filters = {},
	setFilters = () => {},
	loading = false,
	setPage = () => {},
}) => {
	const { t } = useTranslation()
	const { blogTypeOptions } = useEnum()

	const tabs = blogTypeOptions.map((opt) => ({ key: opt.value, title: opt.label }))

	const currentTab = tabs.find((t) => t.key === filters.blogType)

	const setCurrentTab = (tab) => {
		const nextType = filters.blogType === tab?.key ? '' : tab?.key || ''
		setFilters({ ...filters, blogType: nextType })
		setPage(1)
	}

	return (
		<Stack spacing={2}>
			<Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
				{t('blog.field.type')}
			</Typography>
			<GenericTabs
				tabs={tabs}
				currentTab={currentTab}
				setCurrentTab={setCurrentTab}
				loading={loading}
			/>
		</Stack>
	)
}

export default BlogTabsSection
