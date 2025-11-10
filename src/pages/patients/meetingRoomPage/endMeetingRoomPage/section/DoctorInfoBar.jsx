import { Avatar, Box, Chip, Paper, Stack, Typography } from '@mui/material'

const DoctorInfoBar = ({
	doctorName = 'Dr. Sarah Chen',
	specialty = 'General Practitioner',
	durationText = '28 minutes',
	timeText = 'Today, 2:30 PM',
	avatarUrl = '',
}) => {
	return (
		<Paper variant='outlined' sx={{ p: 2, borderRadius: 2, mb: 2 }}>
			<Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between'>
				<Stack direction='row' spacing={2} alignItems='center'>
					<Avatar src={avatarUrl} alt='doctor' sx={{ width: 48, height: 48 }} />
					<Box>
						<Typography fontWeight={700}>{doctorName}</Typography>
						<Typography variant='body2' color='text.secondary'>
							{specialty}
						</Typography>
					</Box>
				</Stack>
				<Stack direction='row' spacing={1} alignItems='center'>
					<Chip size='small' color='success' label={durationText} />
					<Typography variant='body2' color='text.secondary'>
						{timeText}
					</Typography>
				</Stack>
			</Stack>
		</Paper>
	)
}

export default DoctorInfoBar
