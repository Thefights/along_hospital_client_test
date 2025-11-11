import useTranslation from '@/hooks/useTranslation'
import { Box, Paper, Typography } from '@mui/material'

const VideoStage = ({ remoteName = 'Dr. Sarah Chen' }) => {
	const { t } = useTranslation()
	return (
		<Paper
			variant='outlined'
			sx={{
				borderRadius: 3,
				height: { xs: 360, md: 520 },
				position: 'relative',
				bgcolor: (t) => t.palette.background.paper,
				overflow: 'hidden',
				flex: 1,
			}}
		>
			{/* Remote feed placeholder */}
			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					bgcolor: 'action.hover',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: 'text.disabled',
				}}
			>
				<Typography variant='h6' color='text.disabled'>
					{t('meeting_room.remote_placeholder')}
				</Typography>
			</Box>

			{/* Remote name chip */}
			<Box sx={{ position: 'absolute', left: 16, bottom: 16 }}>
				<Paper elevation={2} sx={{ px: 1.25, py: 0.5, borderRadius: 2 }}>
					<Typography variant='body2'>{remoteName}</Typography>
				</Paper>
			</Box>

			{/* Local preview */}
			<Paper
				elevation={3}
				sx={{
					position: 'absolute',
					right: 16,
					bottom: 16,
					width: { xs: 140, md: 200 },
					height: { xs: 90, md: 120 },
					borderRadius: 2,
					overflow: 'hidden',
					bgcolor: 'action.hover',
				}}
			>
				<Box sx={{ position: 'absolute', left: 8, bottom: 8 }}>
					<Paper elevation={1} sx={{ px: 1, py: 0.25, borderRadius: 2 }}>
						<Typography variant='caption'>You</Typography>
					</Paper>
				</Box>
			</Paper>
		</Paper>
	)
}

export default VideoStage
