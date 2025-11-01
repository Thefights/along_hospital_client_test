import EmptyPage from '@/components/placeholders/EmptyPage'
import { defaultBlogTypeStyle, defaultLineClampStyle } from '@/configs/defaultStylesConfig'
import { routeUrls } from '@/configs/routeUrls'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
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

	const formattedDate = blog.publicationDate
		? new Date(blog.publicationDate).toLocaleDateString()
		: ''

	const blogTypeString =
		getEnumLabelByValue(blogTypeOptions, blog.blogType) || t('enum.blog_type.other')
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
					alt={blog.title || t('blog.text.image_alt')}
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
						sx={{ ...defaultLineClampStyle(3), mt: 1, fontWeight: 600 }}
					>
						{blog.title || t('blog.title.untitled')}
					</Typography>
				</CardContent>
			</CardActionArea>
			<Box sx={{ p: 2, pt: 0 }}>
				<Button size='small' onClick={handleCardClick}>
					{t('blog.text.read_more')}
				</Button>
			</Box>
		</Card>
	)
}

const BlogListSection = ({ blogs = [], loading = false }) => {
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
				title={t('blog.text.no_posts')}
				subtitle={t('blog.text.no_posts_subtitle')}
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
							<BlogCard blog={b} />
						</Grid>
					))}
				</Grid>
			</Box>
		</Stack>
	)
}

export default BlogListSection
