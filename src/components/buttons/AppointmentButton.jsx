import { EventAvailable } from '@mui/icons-material'
import { IconButton } from '@mui/material'

const AppointmentButton = ({ onClick }) => {
	return (
		<IconButton onClick={onClick}>
			<EventAvailable sx={{ color: 'common.black' }} />
		</IconButton>
	)
}

export default AppointmentButton
