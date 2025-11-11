import useTranslation from '@/hooks/useTranslation'
import { Close } from '@mui/icons-material'
import {
	Box,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material'

const ChatSidebar = ({ show, messages, chatInput, setShow, setChatInput, onSend }) => {
	const { t } = useTranslation()
	if (!show) return null
	return (
		<Paper
			variant='outlined'
			sx={{
				borderRadius: 3,
				width: { xs: '100%', md: 340 },
				height: { xs: 360, md: 520 },
				display: { xs: 'none', md: 'flex' },
				flexDirection: 'column',
				overflow: 'hidden',
			}}
		>
			<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ p: 1.5 }}>
				<Typography fontWeight={700}>{t('meeting_room.chat_title')}</Typography>
				<IconButton onClick={() => setShow(false)}>
					<Close />
				</IconButton>
			</Stack>
			<Divider />
			<Box sx={{ flex: 1, overflow: 'auto', p: 1.5 }}>
				{messages.length === 0 ? (
					<Typography variant='body2' color='text.secondary'>
						{t('meeting_room.no_messages')}
					</Typography>
				) : (
					<List dense>
						{messages.map((m, idx) => (
							<ListItem key={idx} sx={{ justifyContent: m.me ? 'flex-end' : 'flex-start' }}>
								<Paper
									sx={{
										px: 1.25,
										py: 0.75,
										borderRadius: 2,
										bgcolor: m.me ? 'primary.softBg' : 'background.default',
									}}
								>
									<ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={m.text} />
								</Paper>
							</ListItem>
						))}
					</List>
				)}
			</Box>
			<Divider />
			<Stack direction='row' spacing={1} sx={{ p: 1.5 }}>
				<TextField
					size='small'
					fullWidth
					placeholder={t('meeting_room.chat_input_placeholder')}
					value={chatInput}
					onChange={(e) => setChatInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && chatInput.trim()) onSend()
					}}
				/>
			</Stack>
		</Paper>
	)
}

export default ChatSidebar
