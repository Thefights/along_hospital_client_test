import ConfirmationButton from '@/components/generals/ConfirmationButton'
import { GenericPagination } from '@/components/generals/GenericPagination'
import EmptyPage from '@/components/placeholders/EmptyPage'
import SkeletonBox from '@/components/skeletons/SkeletonBox'
import useEnum from '@/hooks/useEnum'
import useFetch from '@/hooks/useFetch'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import SearchIcon from '@mui/icons-material/Search'
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Paper,
	Stack,
	Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

const PAGE_SIZE = 6

const BlogFilterBar = ({ onApply = () => {}, form }) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const fields = useMemo(
		() => [
			{ key: 'title', title: t('blogPage.titleLabel'), required: false },
			{
				key: 'blogType',
				title: t('blogPage.typeLabel'),
				type: 'select',
				options: _enum.blogTypeOptions,
			},
			{
				key: 'PublicationDate',
				title: t('Date'),
				type: 'date',
				required: false,
			},
		],
		[t, _enum.blogTypeOptions]
	)

	const { renderField } = useFieldRenderer(
		form.values,
		form.setField,
		form.handleChange,
		form.registerRef,
		false,
		'outlined',
		'small'
	)

	return (
		<Paper elevation={0} sx={{ borderRadius: 2, bgcolor: 'background.lightGray' }}>
			<Grid container spacing={2} alignItems='center'>
				{fields.map((f) => (
					<Grid size={{ xs: 12, md: 3 }}>{renderField(f)}</Grid>
				))}
				<Grid size={{ xs: 12, md: 3 }}>
					<ConfirmationButton
						confirmationTitle={t('blogPage.applyConfirmTitle')}
						confirmationDescription={t('blogPage.applyConfirmDescription')}
						confirmButtonText={t('blogPage.apply')}
						confirmButtonColor='primary'
						onConfirm={() => onApply(form.values)}
						fullWidth
					>
						<Stack
							direction='row'
							alignItems='center'
							justifyContent='center'
							spacing={1}
							sx={{ py: 0.5 }}
						>
							<SearchIcon fontSize='small' />
							<Typography variant='button'>{t('blogPage.apply')}</Typography>
						</Stack>
					</ConfirmationButton>
				</Grid>
			</Grid>
		</Paper>
	)
}

const BlogCard = ({ blog = {}, language = 'en' }) => {
	const { t } = useTranslation()
	const _enum = useEnum()
	const contentPreview = blog.content ? String(blog.content).substring(0, 120) + '...' : ''
	const formattedDate = blog.publicationDate
		? new Date(blog.publicationDate).toLocaleDateString()
		: ''
	const getBlogTypeString = (blogType) => {
		const typeMap = {
			0: 'Health',
			1: 'News',
			2: 'Promotion',
			3: 'Guide',
			4: 'Other',
		}
		const mappedValue = typeMap[blogType] || blogType || 'Other'
		return getEnumLabelByValue(_enum.blogTypeOptions, mappedValue) || mappedValue
	}

	const blogTypeString = getBlogTypeString(blog.blogType)

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				transition: '0.24s',
				'&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
			}}
		>
			<CardActionArea
				sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
			>
				<CardMedia
					component='img'
					height='180'
					image={blog.image || '/placeholder-image.png'}
					alt={blog.title || t('blogPage.imageAlt')}
				/>
				<CardContent sx={{ flexGrow: 1 }}>
					<Stack direction='row' justifyContent='space-between' alignItems='center' spacing={1}>
						<Typography variant='caption' color='primary.main' sx={{ fontWeight: 700 }}>
							{blogTypeString}
						</Typography>
						<Typography variant='caption' color='text.secondary'>
							{formattedDate}
						</Typography>
					</Stack>
					<Typography
						gutterBottom
						variant='h6'
						component='div'
						sx={{
							mt: 1,
							fontWeight: 600,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							lineHeight: 1.3,
						}}
					>
						{blog.title || t('blogPage.untitled')}
					</Typography>
					<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
						{contentPreview}
					</Typography>
				</CardContent>
			</CardActionArea>
			<Box sx={{ p: 2, pt: 0 }}>
				<Button size='small'>{t('blogPage.readMore')}</Button>
			</Box>
		</Card>
	)
}

const BlogList = ({ blogs = [], loading = false, language = 'en' }) => {
	const { t } = useTranslation()
	const [page, setPage] = useState(1)

	const currentBlogs = useMemo(() => {
		const startIndex = (page - 1) * PAGE_SIZE
		return (blogs || []).slice(startIndex, startIndex + PAGE_SIZE)
	}, [blogs, page])

	if (loading) {
		return <SkeletonBox numberOfBoxes={3} heights={[250, 250, 250]} rounded />
	}

	if (!blogs || blogs.length === 0) {
		return (
			<EmptyPage
				title={t('blogPage.noPosts')}
				subtitle={t('blogPage.noPostsSubtitle')}
				showButton={false}
			/>
		)
	}

	return (
		<Stack spacing={4} alignItems='stretch'>
			<Grid container spacing={3}>
				{currentBlogs.map((b) => (
					<Grid size={{ xs: 12, sm: 6, md: 4 }} key={b.id || Math.random()}>
						<BlogCard blog={b} language={language} />
					</Grid>
				))}
			</Grid>
		</Stack>
	)
}

export default function BlogPage() {
	const { t, language } = useTranslation()

	const initialValues = { title: '', blogType: '', date: null }
	const form = useForm(initialValues)
	const fieldRenderer = useFieldRenderer(
		form.values,
		form.setField,
		form.handleChange,
		form.registerRef,
		false,
		'outlined',
		'small'
	)

	const [filterParams, setFilterParams] = useState({})
	const { data: blogsRaw, loading } = useFetch('/Blog', filterParams, [filterParams])
	const safeBlogs = Array.isArray(blogsRaw?.collection) ? blogsRaw.collection : []

	return (
		<Box
			sx={{
				bgcolor: 'background.default',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				py: 2,
			}}
		>
			<Stack spacing={4} sx={{ width: '100%', flex: '1 1 auto' }}>
				<BlogFilterBar
					onApply={setFilterParams}
					form={{ ...form, renderField: fieldRenderer.renderField }}
				/>
				<BlogList blogs={safeBlogs} loading={loading} language={language} />
				<Stack alignItems='center'>
					<GenericPagination
						totalPages={blogsRaw?.totalPage}
						page={1}
						setPage={() => {}}
						loading={loading}
					/>
				</Stack>
			</Stack>
		</Box>
	)
}
