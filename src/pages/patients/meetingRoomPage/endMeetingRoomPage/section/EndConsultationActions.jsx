import { routeUrls } from '@/configs/routeUrls'
import useTranslation from '@/hooks/useTranslation'
import { Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const EndConsultationActions = ({ onScheduleFollowUp }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	return (
		<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
			<Button variant='outlined' fullWidth onClick={onScheduleFollowUp}>
				{t('meeting_room.schedule_follow_up')}
			</Button>
			<Button
				variant='contained'
				color='success'
				fullWidth
				onClick={() => navigate(routeUrls.HOME.INDEX)}
			>
				{t('meeting_room.back_to_home')}
			</Button>
		</Stack>
	)
}

export default EndConsultationActions
