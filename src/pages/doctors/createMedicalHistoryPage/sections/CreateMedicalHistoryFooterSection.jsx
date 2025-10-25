import { Button, Stack, Toolbar, Typography } from '@mui/material'

const CreateMedicalHistoryFooterSection = ({ selectedPatient }) => {
	return (
		<Toolbar
			sx={{
				position: 'sticky',
				bottom: 0,
				mt: 2,
				bgcolor: 'background.paper',
				borderTop: '1px solid',
				borderColor: 'divider',
				borderRadius: 2,
				boxShadow: 1,
				zIndex: 1,
			}}
		>
			<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ width: '100%' }}>
				<Typography variant='body2' color='text.secondary'>
					{selectedPatient ? `Đã chọn: ${selectedPatient.name}` : 'Chưa chọn bệnh nhân'}
				</Typography>
				<Stack direction='row' spacing={1}>
					<Button variant='contained' disabled={!selectedPatient}>
						Tạo Medical History
					</Button>
					<Button variant='text'>Hủy</Button>
				</Stack>
			</Stack>
		</Toolbar>
	)
}

export default CreateMedicalHistoryFooterSection
