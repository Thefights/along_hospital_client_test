import useTransalation from '@/hooks/useTranslation'
import { Camera } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'

const VideoConsultantButton = ({ onClick }) => {
	const t = useTransalation()

	return (
		<Tooltip title={t('tooltip.video_consultation')}>
			<IconButton onClick={onClick}>
				<Camera />
			</IconButton>
		</Tooltip>
	)
}

export default VideoConsultantButton
