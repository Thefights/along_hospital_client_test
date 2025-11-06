import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setDoctorsStore } from '@/redux/reducers/patientReducer'
import { getImageFromCloud } from '@/utils/commons'
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Paper,
	Stack,
	Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

const SHOW_STEP = 12

// removed server pagination helpers

const DocCard = ({ doc }) => {
	const name = doc?.name || doc?.fullName || doc?.doctorName || 'Doctor'
	const qualification = doc?.qualification || doc?.degree || doc?.title || ''
	const specialty =
		doc?.specialty?.name || doc?.specialtyName || doc?.department?.name || doc?.departmentName || ''
	const image = doc?.avatar || doc?.imageUrl || doc?.image || ''
	const imgSrc = image ? getImageFromCloud(image) : '/placeholder-image.png'
	return (
		<Card variant='outlined' sx={{ height: '100%' }}>
			<CardActionArea sx={{ height: '100%' }}>
				<CardMedia component='img' height={180} image={imgSrc} alt={name} />
				<CardContent>
					<Stack spacing={0.5}>
						<Typography variant='subtitle1' fontWeight={700} noWrap>
							{name}
						</Typography>
						{qualification ? (
							<Typography variant='body2' color='text.secondary' noWrap>
								{qualification}
							</Typography>
						) : null}
						{specialty ? (
							<Typography variant='body2' color='text.secondary' noWrap>
								{specialty}
							</Typography>
						) : null}
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

const DoctorPage = () => {
	const { t } = useTranslation()
	const [visible, setVisible] = useState(SHOW_STEP)

	// Ensure translation result is string; otherwise use fallback
	const tt = (key, fallback) => {
		const v = t(key)
		return typeof v === 'string' ? v : fallback
	}

	const store = useReduxStore({
		selector: (s) => s.patient.doctors,
		setStore: setDoctorsStore,
	})

	const doctors = useMemo(() => store.data || [], [store.data])
	const visibleDoctors = useMemo(() => doctors.slice(0, visible), [doctors, visible])
	const HAS_MORE = visible < doctors.length

	return (
		<Stack spacing={2} my={2}>
			{/* Page Header Section */}
			<Paper sx={{ p: 3, borderRadius: 2 }}>
				<Typography variant='h4' fontWeight={800} gutterBottom>
					{tt('doctor.title', 'Bác sĩ của chúng tôi')}
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					{tt(
						'doctor.subtitle',
						'Đội ngũ bác sĩ của chúng tôi quy tụ các chuyên gia đầu ngành với trình độ chuyên môn cao, luôn tận tâm vì sức khỏe người bệnh.'
					)}
				</Typography>
			</Paper>

			{/* Doctor Listing Section */}
			<Paper sx={{ p: 2, borderRadius: 2 }}>
				<Grid container spacing={2}>
					{visibleDoctors.map((doc) => (
						<Grid key={doc.id ?? doc.doctorId ?? Math.random()} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
							<DocCard doc={doc} />
						</Grid>
					))}
				</Grid>

				<Box display='flex' justifyContent='center' mt={2}>
					<Button
						variant='outlined'
						disabled={!HAS_MORE}
						onClick={() => setVisible((v) => v + SHOW_STEP)}
					>
						{tt('button.load_more', 'Tải thêm')}
					</Button>
				</Box>
			</Paper>
		</Stack>
	)
}

export default DoctorPage
