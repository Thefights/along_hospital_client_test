import PatientInfoRow from '@/components/infoRows/PatientInfoRow'
import { EnumConfig } from '@/configs/enumConfig'
import { Email, Female, Male, Phone, Transgender } from '@mui/icons-material'
import {
	Avatar,
	Box,
	Card,
	CardActionArea,
	CardContent,
	Chip,
	Stack,
	Typography,
} from '@mui/material'

const CreateMedicalHistoryCardSection = ({ item, selected, onSelect }) => {
	const genderIcon =
		item.gender === EnumConfig.Gender.Male ? (
			<Male fontSize='small' color='primary' />
		) : item.gender === EnumConfig.Gender.Female ? (
			<Female fontSize='small' color='error' />
		) : (
			<Transgender fontSize='small' color='warning' />
		)

	return (
		<Card
			variant='outlined'
			sx={{ borderRadius: 2, bgcolor: selected ? 'secondary.softBg' : 'background.paper' }}
		>
			<CardActionArea onClick={onSelect}>
				<CardContent sx={{ p: 1.5 }}>
					<Stack direction='row' spacing={1.5} alignItems='center'>
						<Avatar src={item.image} sx={{ width: 44, height: 44 }} />
						<Box sx={{ flex: 1, minWidth: 0 }}>
							<Stack direction='row' spacing={1} alignItems='center'>
								<Typography variant='subtitle1' noWrap>
									{item.name}
								</Typography>
								{!!item.medicalNumber && (
									<Chip size='small' label={item.medicalNumber} sx={{ bgcolor: 'background.lightBlue' }} />
								)}
							</Stack>
							<PatientInfoRow
								icon={<Phone fontSize='inherit' />}
								value={item.phone || 'Chưa có số'}
								spacing={1}
							/>
							<PatientInfoRow
								icon={<Email fontSize='inherit' />}
								value={item.email || 'Chưa có email'}
								spacing={1}
							/>
						</Box>

						<Chip size='small' variant='outlined' icon={genderIcon} label={item.gender || '—'} />
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

export default CreateMedicalHistoryCardSection
