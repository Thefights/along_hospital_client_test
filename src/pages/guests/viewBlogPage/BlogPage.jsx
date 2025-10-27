import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import BlogFilterBarSection from './sections/BlogFilterBarSection'
import BlogListSection from './sections/BlogListSection'
import BlogTabsSection from './sections/BlogTabsSection'

export default function BlogPage() {
	const { t, language } = useTranslation()
	const [filters, setFilters] = useState({
		title: '',
		blogType: '',
		publicationDate: '',
		page: 1,
		pageSize: 6,
	})

	const [filterBarValues, setFilterBarValues] = useState({
		title: '',
		blogType: '',
		publicationDate: '',
	})

	const [filterBarInputs, setFilterBarInputs] = useState({
		title: '',
		blogType: '',
		publicationDate: '',
	})

	const getApiParams = () => {
		const params = {}

		if (filterBarValues.title && filterBarValues.title.trim()) {
			params.Title = filterBarValues.title.trim()
		}
		if (filterBarValues.publicationDate) {
			if (filterBarValues.publicationDate instanceof Date) {
				const year = filterBarValues.publicationDate.getFullYear()
				const month = String(filterBarValues.publicationDate.getMonth() + 1).padStart(2, '0')
				const day = String(filterBarValues.publicationDate.getDate()).padStart(2, '0')
				params.PublicationDate = `${year}-${month}-${day}`
			} else {
				params.PublicationDate = filterBarValues.publicationDate
			}
		}

		const blogTypeFromFilters = filters.blogType
		const blogTypeFromBar = filterBarValues.blogType
		const blogTypeToUse =
			blogTypeFromFilters !== undefined && blogTypeFromFilters !== null
				? blogTypeFromFilters
				: blogTypeFromBar

		if (blogTypeToUse !== '' && blogTypeToUse !== null && blogTypeToUse !== undefined) {
			params.BlogType = blogTypeToUse
		}

		params.Page = filters.page || 1
		params.PageSize = filters.pageSize || 6

		return params
	}

	const { data: blogsRaw, loading } = useFetch('/Blog', getApiParams(), [
		filterBarValues.title,
		filterBarValues.publicationDate,
		filterBarValues.blogType,
		filters.blogType,
		filters.page,
		filters.pageSize,
	])

	const safeBlogs = Array.isArray(blogsRaw?.collection) ? blogsRaw.collection : []

	const onFilterClick = async () => {
		setFilterBarValues({
			title: filterBarInputs.title,
			blogType: filterBarInputs.blogType,
			publicationDate: filterBarInputs.publicationDate,
		})
		setFilters((prev) => ({
			...prev,
			blogType: filterBarInputs.blogType || '',
			page: 1,
		}))
	}

	const onResetFilterClick = async () => {
		setFilterBarInputs({ title: '', blogType: '', publicationDate: '' })
		setFilterBarValues({ title: '', blogType: '', publicationDate: '' })
		setFilters((prev) => ({ ...prev, blogType: '', page: 1 }))
	}

	const handlePageChange = (page) => {
		setFilters((prev) => ({ ...prev, page }))
	}

	return (
		<Box
			sx={{
				bgcolor: 'background.default',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				py: 4,
				px: 2,
			}}
		>
			<Paper sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
				<Stack spacing={3} sx={{ flex: 1 }}>
					<Stack
						direction='row'
						alignItems='center'
						justifyContent='space-between'
						flexWrap='wrap'
						rowGap={1}
					>
						<Typography variant='h5'>{t('blogPage.title')}</Typography>
					</Stack>

					<BlogFilterBarSection
						filters={filterBarInputs}
						setFilters={setFilterBarInputs}
						onFilterClick={onFilterClick}
						onResetFilterClick={onResetFilterClick}
						loading={loading}
					/>

					<Stack spacing={3} sx={{ width: '100%', flex: 1 }}>
						<BlogTabsSection filters={filters} setFilters={setFilters} loading={loading} />

						<BlogListSection
							blogs={safeBlogs}
							loading={loading}
							language={language}
							totalPages={blogsRaw?.totalPage || 1}
							page={filters.page}
							setPage={handlePageChange}
						/>
					</Stack>
				</Stack>
			</Paper>
		</Box>
	)
}
