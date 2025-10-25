import SearchBar from '@/components/generals/SearchBar'
import { PersonAdd } from '@mui/icons-material'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'

const CreateMedicalHistorySearchPatientSection = () => {
	return (
		<Paper variant='outlined' sx={{ p: 2, borderRadius: 2, mb: 2 }}>
			<Typography variant='subtitle1' sx={{ mb: 1.5 }}>
				Chọn bệnh nhân
			</Typography>
			<Stack direction='row' spacing={2} alignItems='center'>
				<Box sx={{ flex: 1 }}>
					<SearchBar />
				</Box>
				<Button variant='outlined' startIcon={<PersonAdd />}>
					Tạo bệnh nhân mới
				</Button>
			</Stack>
		</Paper>
	)
}

export default CreateMedicalHistorySearchPatientSection
