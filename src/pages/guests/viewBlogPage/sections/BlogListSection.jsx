import { GenericPagination } from '@/components/generals/GenericPagination'
import EmptyPage from '@/components/placeholders/EmptyPage'
import { defaultBlogTypeStyle } from '@/configs/defaultStylesConfig'
import { routeUrls } from '@/configs/routeUrls'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { getEnumLabelByValue, stripHtml } from '@/utils/handleStringUtil'
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Skeleton,
	Stack,
	Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const BlogCard = ({ blog = {} }) => {
	const { t } = useTranslation()
	const { blogTypeOptions } = useEnum()
	const navigate = useNavigate()

	const cleanContent = blog.content ? stripHtml(String(blog.content)) : ''
	const contentPreview = cleanContent ? cleanContent.substring(0, 120) + '...' : ''

	const formattedDate = blog.publicationDate
		? new Date(blog.publicationDate).toLocaleDateString()
		: ''

	const blogTypeString =
		getEnumLabelByValue(blogTypeOptions, blog.blogType) || t('blogPage.blogType.Other')
	const blogTypeStyle = (theme) => defaultBlogTypeStyle(theme, blog.blogType)

	const handleCardClick = () => {
		navigate(`${routeUrls.HOME.BLOG}/${blog.id}`)
	}

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
				onClick={handleCardClick}
				sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
			>
				<CardMedia
					component='img'
					height='180'
					image={getImageFromCloud(blog.image) || '/placeholder-image.png'}
					alt={blog.title || t('blogPage.imageAlt')}
					onError={(event) => {
						event.currentTarget.src = '/placeholder-image.png'
					}}
				/>
				<CardContent sx={{ flexGrow: 1 }}>
					<Stack direction='row' justifyContent='space-between' alignItems='center' spacing={1}>
						<Typography
							variant='caption'
							sx={(theme) => ({
								fontWeight: 700,
								color: blogTypeStyle(theme).color,
							})}
						>
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
				<Button size='small' onClick={handleCardClick}>
					{t('blogPage.readMore')}
				</Button>
			</Box>
		</Card>
	)
}

const BlogListSection = ({
	blogs = [],
	loading = false,
	language = 'en',
	totalPages = 1,
	page = 1,
	setPage = () => {},
}) => {
	const { t } = useTranslation()
	const safeBlogs = Array.isArray(blogs) ? blogs : []

	if (loading) {
		return (
			<Grid container spacing={3}>
				{Array.from({ length: 6 }).map((_, index) => (
					<Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
						<Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
							<Skeleton variant='rectangular' height={180} />
							<CardContent sx={{ flexGrow: 1 }}>
								<Stack
									direction='row'
									justifyContent='space-between'
									alignItems='center'
									spacing={1}
									sx={{ mb: 1 }}
								>
									<Skeleton variant='text' width={80} height={20} />
									<Skeleton variant='text' width={60} height={20} />
								</Stack>
								<Skeleton variant='text' width='100%' height={32} sx={{ mb: 0.5 }} />
								<Skeleton variant='text' width='90%' height={32} sx={{ mb: 1 }} />
								<Skeleton variant='text' width='100%' height={16} />
								<Skeleton variant='text' width='85%' height={16} />
								<Skeleton variant='text' width='70%' height={16} />
							</CardContent>
							<Box sx={{ p: 2, pt: 0 }}>
								<Skeleton variant='rectangular' width={100} height={36} />
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>
		)
	}

	if (safeBlogs.length === 0) {
		return (
			<EmptyPage
				title={t('blogPage.noPosts')}
				subtitle={t('blogPage.noPostsSubtitle')}
				showButton={false}
			/>
		)
	}

	return (
		<Stack spacing={4} alignItems='stretch' sx={{ flexGrow: 1 }}>
			<Box sx={{ flexGrow: 1 }}>
				<Grid container spacing={3} sx={{ height: '100%' }}>
					{safeBlogs.map((b, index) => (
						<Grid size={{ xs: 12, sm: 6, md: 4 }} key={b.id ?? b.blogId ?? index}>
							<BlogCard blog={b} language={language} />
						</Grid>
					))}
				</Grid>
			</Box>
			<Stack alignItems='center' sx={{ mt: 4 }}>
				<GenericPagination totalPages={totalPages} page={page} setPage={setPage} loading={loading} />
			</Stack>
		</Stack>
	)
}

export default BlogListSection
