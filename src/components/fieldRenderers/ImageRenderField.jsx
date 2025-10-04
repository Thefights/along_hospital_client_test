import { Box, TextField, Typography } from '@mui/material'

const ImageRenderField = ({ field, textFieldVariant, setField, required, showError, preview }) => {
	return (
		<Box key={field.key}>
			<TextField
				name={field.key}
				variant={textFieldVariant}
				label={field.title}
				type='file'
				value={undefined}
				onChange={(e) => {
					const f = e?.target?.files?.[0] || null
					setField(field.key, f)
				}}
				required={required}
				error={showError}
				helperText={showError ? 'This field is required' : ''}
				fullWidth
				slotProps={{
					input: { inputProps: { accept: 'image/*' } },
					inputLabel: { shrink: true },
				}}
			/>
			{preview && (
				<Box sx={{ mt: 1.5 }}>
					<Typography variant='caption' sx={{ display: 'block', mb: 0.5 }}>
						Image Preview
					</Typography>
					<Box
						component='img'
						src={preview}
						alt={field.title}
						sx={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 2, boxShadow: 1 }}
						onLoad={() => URL.revokeObjectURL(preview)}
					/>
				</Box>
			)}
		</Box>
	)
}

export default ImageRenderField
