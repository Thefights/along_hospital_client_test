import axiosConfig from '@/configs/axiosConfig'
import useMeetingSignalR from '@/hooks/useMeetingSignalR'
import useWebRtcPeer from '@/hooks/useWebRtcPeer'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * TeleSessionCall
 * High-level component to orchestrate SignalR signaling + WebRTC peer for a tele-session call.
 *
 * Props: { transactionId: string, accessToken: string, role: 'Doctor'|'Patient' }
 */
const TeleSessionCall = ({ transactionId, accessToken, role }) => {
	const localVideoRef = useRef(null)
	const remoteVideoRef = useRef(null)
	const [error, setError] = useState('')
	const [participants, setParticipants] = useState([])
	const [session, setSession] = useState(null)
	const isCaller = role === 'Patient'

	// fetch session credential/state
	useEffect(() => {
		if (!transactionId || !accessToken) return
		let cancelled = false
		;(async () => {
			try {
				const res = await axiosConfig.get(`/tele-session/${transactionId}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				})
				if (!cancelled) setSession(res?.data || res)
			} catch {
				if (!cancelled) setError('Phiên chưa sẵn sàng')
			}
		})()
		return () => {
			cancelled = true
		}
	}, [transactionId, accessToken])

	const iceServers = useMemo(() => session?.iceServers || [], [session])

	const onLocalStream = (stream) => {
		if (localVideoRef.current) localVideoRef.current.srcObject = stream
	}
	const onRemoteStream = (stream) => {
		if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream
	}

	const {
		createOffer,
		createAnswer,
		setRemoteDescription,
		addIceCandidate,
		toggleAudio,
		toggleVideo,
		hangUp,
	} = useWebRtcPeer({
		iceServers,
		onLocalStream,
		onRemoteStream,
		onIceCandidate: (c) => sendIceCandidate(c),
	})

	const { sendOffer, sendAnswer, sendIceCandidate, leaveSession, startConnection, stopConnection } =
		useMeetingSignalR({
			transactionId,
			accessToken,
			onJoinSucceeded: () => {
				// patient initiates offer on successful join
				if (isCaller) {
					;(async () => {
						const offer = await createOffer()
						await sendOffer(offer)
					})()
				}
			},
			onJoinFailed: (err) => {
				setError('Phiên chưa sẵn sàng')
				console.error('JoinFailed', err)
			},
			onParticipantJoined: (p) => setParticipants((prev) => [...prev.filter((x) => x.id !== p.id), p]),
			onParticipantLeft: (id) => setParticipants((prev) => prev.filter((x) => x.id !== id)),
			onOffer: async ({ offer }) => {
				await setRemoteDescription(offer)
				const answer = await createAnswer()
				await sendAnswer(answer)
			},
			onAnswer: async ({ answer }) => {
				await setRemoteDescription(answer)
			},
			onIceCandidate: async ({ candidate }) => {
				await addIceCandidate(candidate)
			},
			onStateUpdated: (state) => {
				// optional: reflect external state changes
				console.info('state updated', state)
			},
		})

	useEffect(() => {
		// auto start signaling if session is valid
		if (!session) return
		if (session?.status && !['Scheduled', 'InProgress'].includes(session.status)) {
			setError('Phiên chưa sẵn sàng')
			return
		}
		startConnection()
		return () => stopConnection()
	}, [session, startConnection, stopConnection])

	if (error) {
		return (
			<Paper variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
				<Typography color='error'>{error}</Typography>
			</Paper>
		)
	}

	return (
		<Box>
			<Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
				<Paper variant='outlined' sx={{ p: 1, flex: 1, borderRadius: 2 }}>
					<video
						ref={localVideoRef}
						autoPlay
						playsInline
						muted
						style={{ width: '100%', borderRadius: 8 }}
					/>
				</Paper>
				<Paper variant='outlined' sx={{ p: 1, flex: 1, borderRadius: 2 }}>
					<video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 8 }} />
				</Paper>
			</Stack>

			<Stack direction='row' spacing={1} sx={{ mt: 2 }}>
				<Button variant='contained' onClick={startConnection}>
					Start Call
				</Button>
				<Button
					variant='outlined'
					color='error'
					onClick={() => {
						hangUp()
						leaveSession()
					}}
				>
					Hang Up
				</Button>
				<Button variant='outlined' onClick={toggleAudio}>
					Mute/Unmute
				</Button>
				<Button variant='outlined' onClick={toggleVideo}>
					Toggle Video
				</Button>
			</Stack>

			<Paper variant='outlined' sx={{ p: 1.5, mt: 2, borderRadius: 2 }}>
				<Typography variant='subtitle2' sx={{ mb: 1 }}>
					Participants
				</Typography>
				{participants.length === 0 ? (
					<Typography variant='body2' color='text.secondary'>
						No participants
					</Typography>
				) : (
					<ul style={{ margin: 0, paddingLeft: 16 }}>
						{participants.map((p) => (
							<li key={p.id}>
								<Typography variant='body2'>{p.displayName || p.id}</Typography>
							</li>
						))}
					</ul>
				)}
			</Paper>
		</Box>
	)
}

export default TeleSessionCall
