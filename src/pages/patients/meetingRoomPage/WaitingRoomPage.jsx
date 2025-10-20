import useTranslation from '@/hooks/useTranslation'
import { Circle } from '@mui/icons-material'
import { Avatar, Box, Container, Paper, Stack, Typography } from '@mui/material'

const WaitingRoomPage = () => {
	const { t } = useTranslation()

	return (
		<Box
			sx={{
				py: { xs: 4, md: 8 },
				background: (theme) =>
					`linear-gradient(180deg, ${theme.palette.background.default} 0%, ${
						theme.palette.success.softBg || theme.palette.background.paper
					} 100%)`,
				minHeight: 'calc(100vh - 72px - 200px)',
			}}
		>
			<Container maxWidth='sm'>
				<Paper
					elevation={0}
					sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
				>
					<Stack alignItems='center' spacing={2.5}>
						<Avatar
							src={t('meeting_room.doctor_avatar_url', '')}
							alt='Doctor'
							sx={{ width: 96, height: 96 }}
						/>
						<Box sx={{ textAlign: 'center' }}>
							<Typography variant='h5' fontWeight={700}>
								Doctor Name (Var)
							</Typography>
							<Typography color='text.secondary'>Doctor Specialty (Var)</Typography>
						</Box>

						<Stack direction='row' alignItems='center' spacing={1}>
							<Circle color='success' sx={{ fontSize: 12 }} />
							<Typography color='text.secondary'>
								{t('meeting_room.message.waiting_for_doctor')}
							</Typography>
						</Stack>

						<Box sx={{ alignSelf: 'stretch', mt: 2 }}>
							<Stack direction='row' justifyContent='space-between' sx={{ mb: 1 }}>
								<Typography color='text.secondary'>{t('meeting_room.title.appointment_time')}</Typography>
								<Typography>2:30 PM (var)</Typography>
							</Stack>
							<Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
								<Typography color='text.secondary'>{t('meeting_room.title.duration')}</Typography>
								<Typography>30 minutes (var)</Typography>
							</Stack>
						</Box>

						<Typography variant='caption' color='text.secondary' sx={{ mt: 1, textAlign: 'center' }}>
							{t('meeting_room.title.note')}
						</Typography>
					</Stack>
				</Paper>
			</Container>
		</Box>
	)
}

export default WaitingRoomPage
