import EmptyPage from '@/components/placeholders/EmptyPage'
import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, Button, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import DoctorCard from './sections/DoctorCard'

export default function DoctorPage() {
	const { t } = useTranslation()
	const { loading, data } = useFetch(ApiUrls.DOCTOR.GET_ALL)
	const [visibleCount, setVisibleCount] = useState(6)

	const doctors = Array.isArray(data) ? data : Array.isArray(data?.collection) ? data.collection : []

	const handleLoadMore = () => {
		setVisibleCount((v) => v + 6)
	}

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
			{loading ? (
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
			) : doctors.length === 0 ? (
				<EmptyPage title={t('doctor.text.no_doctors')} showButton={false} />
			) : (
				<Stack spacing={4} alignItems='stretch'>
					<Grid container spacing={3} sx={{ height: '100%' }}>
						{doctors.slice(0, visibleCount).map((d, idx) => (
							<Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.id ?? idx}>
								<DoctorCard doctor={d} />
							</Grid>
						))}
					</Grid>

					{visibleCount < doctors.length && (
						<Stack alignItems='center'>
							<Button variant='outlined' onClick={handleLoadMore} sx={{ borderRadius: 3 }}>
								{t('doctor.button.load_more')}
							</Button>
						</Stack>
					)}
				</Stack>
			)}
		</Box>
	)
}
