import { Paper, Stack, TextField, Typography } from '@mui/material'

const CreateMedicalHistoryPreviewSection = () => {
	return (
		<Paper variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
			<Typography variant='subtitle1' sx={{ mb: 1.5 }}>
				Thông tin hồ sơ (sẽ điền sau khi tạo)
			</Typography>
			<Stack spacing={1.5}>
				<TextField fullWidth label='Chẩn đoán' disabled multiline minRows={2} />
				<Stack direction='row' spacing={1.5}>
					<TextField fullWidth label='Ngày hẹn tái khám' disabled />
					<TextField fullWidth label='Trạng thái hồ sơ' disabled />
				</Stack>
			</Stack>
			<Typography variant='caption' sx={{ mt: 1.5, display: 'block', color: 'text.secondary' }}>
				Sau khi tạo, mở trang chi tiết để cập nhật các trường này.
			</Typography>
		</Paper>
	)
}

export default CreateMedicalHistoryPreviewSection
