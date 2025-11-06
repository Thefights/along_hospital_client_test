import EmptyPage from '@/components/placeholders/EmptyPage'
import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Skeleton,
	Stack,
	Typography,
} from '@mui/material'
import { useState } from 'react'

const DoctorCard = ({ doctor = {} }) => {
	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				transition: '0.24s',
				'&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
			}}
		>
			<CardActionArea
				sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
			>
				<CardMedia
					component='img'
					height='180'
					image={getImageFromCloud(doctor.image) || '/placeholder-image.png'}
					alt={doctor.name || 'Ảnh bác sĩ'}
					onError={(e) => (e.currentTarget.src = '/placeholder-image.png')}
				/>
				<CardContent sx={{ flexGrow: 1 }}>
					<Stack spacing={1}>
						<Typography variant='h6' sx={{ fontWeight: 700 }}>
							{doctor.name || '---'}
						</Typography>
						{doctor.specialtyName && (
							<Typography variant='body2' color='text.secondary'>
								Specialty: {doctor.specialtyName}
							</Typography>
						)}
						{doctor.departmentName && (
							<Typography variant='body2' color='text.secondary'>
								Department: {doctor.departmentName}
							</Typography>
						)}

						{doctor.qualification && (
							<Typography variant='body2' color='text.secondary'>
								Qualification: {doctor.qualification}
							</Typography>
						)}
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

export default function DoctorPage() {
	const { t } = useTranslation()
	const { loading, data } = useFetch(ApiUrls.DOCTOR.GET_ALL)
	const [visibleCount, setVisibleCount] = useState(6)

	const doctors = Array.isArray(data) ? data : Array.isArray(data?.collection) ? data.collection : []

	const safeDoctors = doctors || []

	const handleLoadMore = () => {
		setVisibleCount((v) => v + 6)
	}

	return (
		<Box sx={{ p: 2 }}>
			{/* Page header */}
			<Stack spacing={1} sx={{ mb: 3 }}>
				<Typography variant='h4' sx={{ fontWeight: 700 }}>
					{t('doctor.title.team')}
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					{t('doctor.text.description')}
				</Typography>
			</Stack>

			{/* Doctor list */}
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
			) : safeDoctors.length === 0 ? (
				<EmptyPage title={t('doctor.text.no_doctors')} showButton={false} />
			) : (
				<Stack spacing={4} alignItems='stretch'>
					<Grid container spacing={3} sx={{ height: '100%' }}>
						{safeDoctors.slice(0, visibleCount).map((d, idx) => (
							<Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.id ?? idx}>
								<DoctorCard doctor={d} />
							</Grid>
						))}
					</Grid>

					{visibleCount < safeDoctors.length && (
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
