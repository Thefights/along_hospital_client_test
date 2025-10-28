import useTranslation from '@/hooks/useTranslation'
import { ArrowBack, LocalHospital } from '@mui/icons-material'
import { Box, Button, CardMedia, Chip, Paper, Stack } from '@mui/material'

const IMAGE_ERROR_HANDLER = (event) => {
	event.currentTarget.onerror = null
	event.currentTarget.src = '/placeholder-image.png'
}

const IMAGE_STYLES = {
	cover: { width: '100%', height: { xs: 240, sm: 320, md: 420 }, objectFit: 'cover' },
	placeholder: {
		width: '100%',
		height: { xs: 240, sm: 320, md: 420 },
		bgcolor: 'primary.softBg',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
}

const PAPER_STYLES = {
	borderRadius: 3,
	boxShadow: 6,
	overflow: 'hidden',
	width: '100%',
	maxWidth: '100%',
	boxSizing: 'border-box',
}

const BLOG_CONTENT_SX = {
	maxWidth: 960,
	mx: 'auto',
	width: '100%',
	overflowWrap: 'break-word',
	wordBreak: 'break-word',
	position: 'relative',
	'&::after': {
		content: '""',
		display: 'block',
		clear: 'both',
	},
	'& *': {
		maxWidth: '100% !important',
	},
	'& p': { mb: 2, lineHeight: 1.8, wordBreak: 'break-word' },
	'& h1, & h2, & h3, & h4, & h5, & h6': {
		mt: 2,
		mb: 1.5,
		fontWeight: 600,
		wordBreak: 'break-word',
		'&:first-child': { mt: 0 },
	},
	'& h2': { mt: 3, mb: 2 },
	'& h3': { mt: 2, mb: 1.5 },
	'& ul, & ol': { mb: 2, pl: 3 },
	'& li': { mb: 0.5, wordBreak: 'break-word' },
	'& img': {
		maxWidth: '100% !important',
		width: '100% !important',
		height: 'auto !important',
		borderRadius: 1,
		my: 2,
		display: 'block',
	},
	'& table': {
		width: '100% !important',
		maxWidth: '100% !important',
		display: 'block !important',
		overflowX: 'auto',
		borderCollapse: 'collapse',
		mb: 3,
	},
	'& table td, & table th': {
		border: '1px solid',
		borderColor: 'divider',
		p: 1,
		textAlign: 'left',
		wordBreak: 'break-word',
	},
	'& iframe, & video, & embed, & object': {
		width: '100% !important',
		maxWidth: '100% !important',
		height: 'auto',
	},
	'& figure': {
		maxWidth: '100% !important',
		width: '100% !important',
		m: 0,
		'& img': {
			maxWidth: '100% !important',
			width: '100% !important',
		},
	},
	'& a': { color: 'primary.main', textDecoration: 'none', wordBreak: 'break-all' },
	'& blockquote': {
		borderLeft: 4,
		borderColor: 'primary.main',
		pl: 2,
		py: 1,
		my: 2,
		fontStyle: 'italic',
		wordBreak: 'break-word',
	},
	'& div': {
		maxWidth: '100% !important',
		width: '100% !important',
		boxSizing: 'border-box !important',
	},
	'& span': {
		wordBreak: 'break-word',
	},
	'& pre': {
		overflowX: 'auto',
		whiteSpace: 'pre-wrap',
		wordBreak: 'break-word',
	},
}

const BlogContentSection = ({
	title = '',
	blogTypeLabel,
	formattedDate = '',
	content = '',
	onBack,
	showImage,
	coverImage = '',
}) => {
	const { t } = useTranslation()
	const fallbackTitle = t('blog.title.untitled')
	return (
		<Paper sx={PAPER_STYLES}>
			<Box sx={{ p: { xs: 3, md: 4 }, borderBottom: 1, borderColor: 'divider' }}>
				<Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
					<Chip label={blogTypeLabel} color='primary' size='small' />
					{formattedDate && <Chip label={formattedDate} variant='outlined' size='small' />}
				</Stack>
			</Box>

			{showImage ? (
				<CardMedia
					component='img'
					image={coverImage}
					alt={title || fallbackTitle}
					sx={IMAGE_STYLES.cover}
					onError={IMAGE_ERROR_HANDLER}
				/>
			) : (
				<Box sx={IMAGE_STYLES.placeholder}>
					<LocalHospital sx={{ fontSize: 88, color: 'primary.main', opacity: 0.3 }} />
				</Box>
			)}

			<Box sx={{ p: { xs: 3, md: 4 }, overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
				<Stack spacing={3} sx={{ width: '100%', maxWidth: '100%' }}>
					<Box
						className='blog-content-wrapper'
						sx={BLOG_CONTENT_SX}
						dangerouslySetInnerHTML={{ __html: content || '' }}
					/>
					<Button
						variant='outlined'
						startIcon={<ArrowBack />}
						onClick={onBack}
						sx={{ alignSelf: 'flex-start' }}
					>
						{t('button.back')}
					</Button>
				</Stack>
			</Box>
		</Paper>
	)
}

export default BlogContentSection
