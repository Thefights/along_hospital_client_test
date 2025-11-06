import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from '@mui/material'

const DoctorCard = ({ doctor = {} }) => {
	const { t } = useTranslation()

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
					alt={doctor.name || t('doctor.field.image')}
					onError={(e) => (e.currentTarget.src = '/placeholder-image.png')}
				/>
				<CardContent sx={{ flexGrow: 1 }}>
					<Stack spacing={1}>
						<Typography variant='h6' sx={{ fontWeight: 700 }}>
							{doctor.name || '---'}
						</Typography>
						{doctor.specialtyName && (
							<Typography variant='body2' color='text.secondary'>
								{t('doctor.field.specialty')}: {doctor.specialtyName}
							</Typography>
						)}
						{doctor.departmentName && (
							<Typography variant='body2' color='text.secondary'>
								{t('doctor.field.department')}: {doctor.departmentName}
							</Typography>
						)}

						{doctor.qualification && (
							<Typography variant='body2' color='text.secondary'>
								{t('doctor.field.qualification')}: {doctor.qualification}
							</Typography>
						)}
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

export default DoctorCard
