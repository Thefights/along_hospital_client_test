import { Box, Paper, Stack, Typography } from '@mui/material'

const CreateMedicalHistoryHeaderSection = () => {
	return (
		<Paper sx={{ p: 2.5, mb: 2, borderRadius: 2, bgcolor: 'background.lightBlue' }}>
			<Stack
				direction='row'
				alignItems='center'
				justifyContent='space-between'
				flexWrap='wrap'
				spacing={1.5}
			>
				<Box>
					<Typography variant='h5'>Tạo Medical History</Typography>
					<Typography variant='body2' color='text.secondary'>
						Bước 1/1 — Chọn bệnh nhân
					</Typography>
				</Box>
			</Stack>
		</Paper>
	)
}

export default CreateMedicalHistoryHeaderSection
