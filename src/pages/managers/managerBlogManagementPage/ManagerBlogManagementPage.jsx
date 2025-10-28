import ActionMenu from '@/components/generals/ActionMenu'
import ConfirmationButton from '@/components/generals/ConfirmationButton'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTabs from '@/components/generals/GenericTabs'
import SearchBar from '@/components/generals/SearchBar'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import axiosConfig from '@/configs/axiosConfig'
import { defaultBlogTypeStyle } from '@/configs/defaultStylesConfig'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useEnum from '@/hooks/useEnum'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { formatDateToDDMMYYYY } from '@/utils/formatDateUtil'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { DeleteOutline, Edit } from '@mui/icons-material'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const getPlainText = (content) => {
	const cleaned = stripHtml(String(content ?? ''))
		.replace(/\s+/g, ' ')
		.trim()
}

const SORT_FIELD_MAP = {
	id: 'Id',
	title: 'Title',
	blogType: 'BlogType',
	publicationDate: 'PublicationDate',
}

const ManagerBlogManagementPage = () => {
	const { t } = useTranslation()
	const confirm = useConfirm()
	const navigate = useNavigate()
	const { blogTypeOptions } = useEnum()

	const [sort, setSort] = useState({ key: 'id', direction: 'asc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [currentTypeTab, setCurrentTypeTab] = useState('all')
	const [selectedIds, setSelectedIds] = useState([])
	const [deleteId, setDeleteId] = useState(null)
	const [pendingDelete, setPendingDelete] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const [keyword, setKeyword] = useState('')
	const trimmedKeyword = useMemo(() => keyword.trim(), [keyword])
	const filterExpression = useMemo(() => {
		if (!trimmedKeyword) return null
		return /^\d+$/.test(trimmedKeyword) ? `Id==${trimmedKeyword}` : `Title@=${trimmedKeyword}`
	}, [trimmedKeyword])
	const sortField = useMemo(() => SORT_FIELD_MAP[sort.key] ?? null, [sort.key])

	useEffect(() => {
		if (searchValue === '') {
			setKeyword('')
			setPage(1)
		}
	}, [searchValue])

	const queryParams = useMemo(() => {
		const params = {
			Page: page,
			PageSize: pageSize,
		}
		if (sortField) {
			params.Sort = `${sortField} ${sort.direction === 'desc' ? 'desc' : 'asc'}`
		}
		if (filterExpression) {
			params.Filter = filterExpression
		}
		if (currentTypeTab && currentTypeTab !== 'all') params.BlogType = currentTypeTab
		return params
	}, [page, pageSize, sortField, sort.direction, filterExpression, currentTypeTab])

	const { loading, data, fetch } = useFetch(ApiUrls.BLOG.MANAGEMENT.INDEX, queryParams, [
		page,
		pageSize,
		sortField,
		sort.direction,
		filterExpression,
		currentTypeTab,
	])

	const blogs = useMemo(() => (Array.isArray(data?.collection) ? data.collection : []), [data])
	const totalItems = data?.totalCount ?? data?.totalItems ?? 0

	useEffect(() => {
		setSelectedIds([])
	}, [blogs])

	const statusTabs = useMemo(() => {
		return [
			{ key: 'all', title: t('text.all') },
			...blogTypeOptions.map((option) => ({ key: option.value, title: option.label })),
		]
	}, [blogTypeOptions, t])

	const { submit: submitDelete } = useAxiosSubmit({
		url: deleteId ? ApiUrls.BLOG.MANAGEMENT.DETAIL(deleteId) : '',
		method: 'DELETE',
		onSuccess: async () => {
			await fetch()
			setDeleteId(null)
		},
	})

	useEffect(() => {
		if (!pendingDelete || !deleteId) return
		submitDelete().finally(() => setPendingDelete(false))
	}, [pendingDelete, deleteId, submitDelete])

	const tableFields = useMemo(
		() => [
			{ key: 'id', title: 'ID', width: 8, sortable: true, fixedColumn: true },
			{ key: 'title', title: t('blogPage.titleLabel'), width: 28, sortable: true },
			{
				key: 'blogType',
				title: t('blogPage.typeLabel'),
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
				title: t('blogPage.previewColumn'),
				width: 32,
				render: (value) => (
					<Typography variant='body2' sx={{ color: 'text.secondary' }}>
						{getPlainText(value) || 'N/A'}
					</Typography>
				),
			},
			{
				key: 'image',
				title: t('blogPage.imageColumn'),
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
							{
								title: t('button.delete'),
								icon: <DeleteOutline fontSize='small' />,
								onClick: async () => {
									const confirmed = await confirm({
										confirmText: t('button.delete'),
										confirmColor: 'error',
										title: t('button.delete') + ' blog?',
										description: row?.title ? `"${row.title}"` : undefined,
									})

									if (!confirmed || !row?.id) {
										setDeleteId(null)
										return
									}

									setDeleteId(row.id)
									setPendingDelete(true)
								},
							},
						]}
					/>
				),
			},
		],
		[blogTypeOptions, confirm, navigate, t]
	)

	const handleBulkDelete = async () => {
		if (selectedIds.length === 0) return
		const confirmed = await confirm({
			confirmText: t('button.delete'),
			confirmColor: 'error',
			title: t('button.delete') + ` (${selectedIds.length})`,
		})
		if (!confirmed) return

		try {
			await Promise.all(
				selectedIds.map((id) => axiosConfig.delete(ApiUrls.BLOG.MANAGEMENT.DETAIL(id)))
			)
			setSelectedIds([])
			await fetch()
		} catch (error) {}
	}

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
						setCurrentTypeTab(tab?.key ?? 'all')
						setPage(1)
					}}
				/>
			</Stack>
			<Stack direction='row' justifyContent='space-between' alignItems='center' my={2}>
				<SearchBar
					widthPercent={30}
					value={searchValue}
					setValue={setSearchValue}
					onEnterDown={() => {
						setKeyword(searchValue.trim())
						setPage(1)
					}}
				/>
				<Stack spacing={2} direction='row' alignItems='center'>
					<Button
						variant='contained'
						color='primary'
						onClick={() => navigate(routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.BLOG.CREATE))}
					>
						{t('button.create')} Blog
					</Button>
					<ConfirmationButton
						confirmButtonColor='error'
						confirmButtonText={t('button.delete')}
						confirmationTitle={t('button.delete') + ' blog(s)?'}
						confirmationDescription={t('done_care_about_this.delete_description', {
							number: selectedIds.length,
						})}
						onConfirm={handleBulkDelete}
						color='error'
						variant='outlined'
						disabled={selectedIds.length === 0}
					>
						{t('done_care_about_this.delete_selected', { number: selectedIds.length })}
					</ConfirmationButton>
				</Stack>
			</Stack>
			<GenericTable
				data={blogs}
				fields={tableFields}
				sort={sort}
				setSort={setSort}
				rowKey='id'
				canSelectRows
				selectedRows={selectedIds}
				setSelectedRows={setSelectedIds}
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
