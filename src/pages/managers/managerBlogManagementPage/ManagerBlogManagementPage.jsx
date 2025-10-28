import ActionMenu from '@/components/generals/ActionMenu'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTabs from '@/components/generals/GenericTabs'
import SearchBar from '@/components/generals/SearchBar'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { defaultBlogTypeStyle } from '@/configs/defaultStylesConfig'
import { routeUrls } from '@/configs/routeUrls'
import useEnum from '@/hooks/useEnum'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { formatDateToDDMMYYYY } from '@/utils/formatDateUtil'
import { getEnumLabelByValue, stripHtml } from '@/utils/handleStringUtil'
import { Edit } from '@mui/icons-material'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const getPlainText = (content) => {
	return (
		stripHtml(String(content ?? ''))
			.replace(/\s+/g, ' ')
			.trim()
			.substring(0, 120) + '...'
	)
}

const ManagerBlogManagementPage = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { blogTypeOptions } = useEnum()

	const [sort, setSort] = useState({ key: 'id', direction: 'asc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [currentTypeTab, setCurrentTypeTab] = useState('')

	const { loading, data, fetch } = useFetch(
		ApiUrls.BLOG.MANAGEMENT.INDEX,
		{
			Page: page,
			PageSize: pageSize,
			Sort: `${sort.key} ${sort.direction}`,
			...(currentTypeTab && { BlogType: currentTypeTab }),
		},
		[page, pageSize, sort, currentTypeTab]
	)

	const blogs = useMemo(() => (Array.isArray(data?.collection) ? data.collection : []), [data])
	const totalItems = data?.totalCount ?? 0

	const statusTabs = useMemo(() => {
		return [
			{ key: '', title: t('text.all') },
			...blogTypeOptions.map((option) => ({ key: option.value, title: option.label })),
		]
	}, [blogTypeOptions, t])

	const tableFields = useMemo(
		() => [
			{ key: 'id', title: 'ID', width: 8, sortable: true, fixedColumn: true },
			{ key: 'title', title: t('blog.field.title'), width: 28, sortable: true },
			{
				key: 'blogType',
				title: t('blog.field.type'),
				width: 16,
				sortable: true,
				render: (value) => {
					const label = getEnumLabelByValue(blogTypeOptions, value) || value || 'N/A'
					return (
						<Typography
							variant='body2'
							sx={(theme) => ({
								fontWeight: 600,
								color: defaultBlogTypeStyle(theme, value).color,
							})}
						>
							{label}
						</Typography>
					)
				},
			},
			{
				key: 'content',
				title: t('blog.field.preview'),
				width: 32,
				render: (value) => (
					<Typography variant='body2' sx={{ color: 'text.secondary' }}>
						{getPlainText(value) || 'N/A'}
					</Typography>
				),
			},
			{
				key: 'image',
				title: t('blog.field.image'),
				width: 12,
				render: (value, row) => {
					const imageUrl = getImageFromCloud(row?.image)
					return imageUrl ? (
						<Box
							component='img'
							src={imageUrl}
							alt={row?.title || 'blog-image'}
							sx={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 1 }}
							onError={(event) => {
								event.currentTarget.onerror = null
								event.currentTarget.src = '/placeholder-image.png'
							}}
						/>
					) : (
						<Typography variant='caption' color='text.disabled'>
							{t('blogDetail.untitled')}
						</Typography>
					)
				},
			},
			{
				key: 'publicationDate',
				title: t('text.date'),
				width: 14,
				sortable: true,
				render: (value) => formatDateToDDMMYYYY(value) || 'N/A',
			},
			{
				key: 'actions',
				title: '',
				width: 8,
				render: (_, row) => (
					<ActionMenu
						actions={[
							{
								title: t('button.update'),
								icon: <Edit fontSize='small' />,
								onClick: () =>
									navigate(routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.BLOG.UPDATE(row?.id))),
							},
						]}
					/>
				),
			},
		],
		[blogTypeOptions, navigate, t]
	)

	return (
		<Paper sx={{ py: 1, px: 2, mt: 2 }}>
			<Stack direction='column' spacing={1} my={2}>
				<Typography fontWeight='bold' flexGrow={1}>
					{t('blogDetail.headerTitle')}:
				</Typography>
				<GenericTabs
					tabs={statusTabs}
					currentTab={currentTypeTab}
					setCurrentTab={(tab) => {
						setCurrentTypeTab(tab?.key ?? '')
						setPage(1)
					}}
				/>
			</Stack>
			<Stack direction='row' justifyContent='space-between' alignItems='center' my={2}>
				<SearchBar widthPercent={30} />
				<Button
					variant='contained'
					color='primary'
					onClick={() => navigate(routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.BLOG.CREATE))}
				>
					{t('button.create')} Blog
				</Button>
			</Stack>
			<GenericTable
				data={blogs}
				fields={tableFields}
				sort={sort}
				setSort={setSort}
				rowKey='id'
				loading={loading}
			/>
			<GenericTablePagination
				totalItems={totalItems}
				page={page}
				setPage={setPage}
				pageSize={pageSize}
				setPageSize={setPageSize}
			/>
		</Paper>
	)
}

export default ManagerBlogManagementPage
