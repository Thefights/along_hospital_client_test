import EmptyPage from '@/components/placeholders/EmptyPage'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setDoctorsStore } from '@/redux/reducers/patientReducer'
import { Box, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material'
import DoctorCardSection from './sections/DoctorCardSection'

export default function DoctorPage() {
	const { t } = useTranslation()

	const doctorStore = useReduxStore({
		selector: (state) => state.patient.doctors,
		setStore: setDoctorsStore,
	})

	return (
		<Box sx={{ p: 2 }}>
			<Stack spacing={1} sx={{ mb: 3 }}>
				<Typography variant='h4' sx={{ fontWeight: 700 }}>
					{t('doctor.title.team')}
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					{t('doctor.text.description')}
				</Typography>
			</Stack>
			{doctorStore.loading ? (
				<Grid container spacing={3}>
					{Array.from({ length: 6 }).map((_, index) => (
						<Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
							<Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
								<Skeleton variant='rectangular' height={180} />
								<CardContent sx={{ flexGrow: 1 }}>
									<Skeleton variant='text' width='60%' height={28} sx={{ mb: 1 }} />
									<Skeleton variant='text' width='40%' height={20} sx={{ mb: 0.5 }} />
									<Skeleton variant='text' width='80%' height={20} />
								</CardContent>
								<Box sx={{ p: 2, pt: 0 }}>
									<Skeleton variant='rectangular' width={100} height={36} />
								</Box>
							</Card>
						</Grid>
					))}
				</Grid>
			) : doctorStore.data.length === 0 ? (
				<EmptyPage title={t('doctor.placeholder.no_doctors')} showButton={false} />
			) : (
				<Grid container spacing={3} sx={{ height: '100%' }}>
					{doctorStore.data.map((d, idx) => (
						<Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.id ?? idx}>
							<DoctorCardSection doctor={d} />
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	)
}
