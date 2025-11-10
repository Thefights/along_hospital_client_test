// TEST-ONLY: Quick local media preview for dev. Remove when integrating real call flow.
import useWebRtcPeer from '@/hooks/useWebRtcPeer'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useRef } from 'react'

const LocalMediaTest = () => {
	const localRef = useRef(null)

	const onLocalStream = (stream) => {
		if (localRef.current) localRef.current.srcObject = stream
	}

	const { toggleAudio, toggleVideo, hangUp, isAudioEnabled, isVideoEnabled } = useWebRtcPeer({
		iceServers: [],
		onLocalStream,
		onRemoteStream: () => {},
		onIceCandidate: () => {},
	})

	return (
		<Box sx={{ mt: 3 }}>
			<Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
				TEST ONLY: Local camera/mic preview (remove later)
			</Typography>
			<Paper variant='outlined' sx={{ p: 1.5, borderRadius: 2 }}>
				<video ref={localRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: 8 }} />
				<Stack direction='row' spacing={1} sx={{ mt: 1 }}>
					<Button variant='outlined' onClick={toggleAudio}>
						{isAudioEnabled ? 'Mute' : 'Unmute'}
					</Button>
					<Button variant='outlined' onClick={toggleVideo}>
						{isVideoEnabled ? 'Disable Video' : 'Enable Video'}
					</Button>
					<Button variant='outlined' color='error' onClick={hangUp}>
						Stop
					</Button>
				</Stack>
			</Paper>
		</Box>
	)
}

export default LocalMediaTest
