import { Delete, Save } from '@mui/icons-material'
import {
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	FormControl,
	FormHelperText,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from '@mui/material'

const BlogUpsertFormSection = ({
	isEditMode,
	detailLoading,
	t,
	onSubmit,
	formData,
	errors,
	onInputChange,
	onImageChange,
	onRemoveImage,
	blogTypeOptions,
	imagePreview,
	submitButtonLabel,
	isFormDisabled,
	editorRef,
	onBack,
	backLabel,
	isSubmitting,
	canRemoveImage,
}) => {
	return (
		<Card>
			<CardContent>
				{isEditMode && detailLoading && (
					<Stack direction='row' spacing={1.5} alignItems='center' sx={{ mb: 2 }}>
						<CircularProgress size={20} />
						<Typography variant='body2' color='text.secondary'>
							{t('text.loading')}
						</Typography>
					</Stack>
				)}
				<Box
					component='form'
					onSubmit={onSubmit}
					sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
				>
					<TextField
						label={t('blogPage.titleLabel')}
						value={formData.title}
						onChange={(e) => onInputChange('title', e.target.value)}
						error={!!errors.title}
						helperText={errors.title}
						fullWidth
						required
						disabled={isFormDisabled}
					/>

					<Box>
						<Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
							{t('blogPage.contentLabel')} *
						</Typography>
						<textarea
							ref={editorRef}
							id='content-editor'
							value={formData.content}
							onChange={(e) => onInputChange('content', e.target.value)}
							style={{ display: 'none' }}
						/>
						{errors.content && (
							<FormHelperText error sx={{ mt: 1 }}>
								{errors.content}
							</FormHelperText>
						)}
					</Box>

					<FormControl fullWidth error={!!errors.blogType} required disabled={isFormDisabled}>
						<InputLabel>{t('blogPage.typeLabel')}</InputLabel>
						<Select
							value={formData.blogType}
							onChange={(e) => onInputChange('blogType', e.target.value)}
							label={t('blogPage.typeLabel')}
							disabled={isFormDisabled}
						>
							<MenuItem value='' disabled>
								{t('blogPage.selectTypePlaceholder')}
							</MenuItem>
							{blogTypeOptions.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</Select>
						{errors.blogType && <FormHelperText>{errors.blogType}</FormHelperText>}
					</FormControl>

					<Box>
						<Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
							{t('blogPage.coverImage')}
						</Typography>
						<input
							accept='image/*'
							style={{ display: 'none' }}
							id='image-upload'
							type='file'
							onChange={onImageChange}
							disabled={isFormDisabled}
						/>
						<label htmlFor='image-upload'>
							<Button variant='outlined' component='span' fullWidth disabled={isFormDisabled}>
								{t('blogPage.chooseImage')}
							</Button>
						</label>
						{imagePreview && (
							<Box sx={{ position: 'relative', display: 'inline-block', mt: 2 }}>
								<Box
									component='img'
									src={imagePreview}
									alt={t('blogPage.coverImage')}
									sx={{
										width: '100%',
										maxWidth: 400,
										height: 200,
										objectFit: 'cover',
										borderRadius: 1,
										border: '1px solid',
										borderColor: 'divider',
									}}
								/>
								<IconButton
									size='small'
									color='error'
									onClick={onRemoveImage}
									disabled={!canRemoveImage || isFormDisabled}
									aria-label={t('blogPage.removeImage')}
									sx={{
										position: 'absolute',
										top: 8,
										right: 8,
										bgcolor: 'background.paper',
										boxShadow: 1,
										'&:hover': {
											bgcolor: 'error.main',
											color: 'common.white',
										},
									}}
								>
									<Delete fontSize='small' />
								</IconButton>
							</Box>
						)}
					</Box>

					<Stack direction='row' justifyContent='space-between' sx={{ mt: 2 }}>
						<Button variant='outlined' onClick={onBack} disabled={isSubmitting}>
							{backLabel}
						</Button>
						<Button
							type='submit'
							variant='contained'
							color='success'
							startIcon={<Save />}
							disabled={isFormDisabled}
						>
							{submitButtonLabel}
						</Button>
					</Stack>
				</Box>
			</CardContent>
		</Card>
	)
}

export default BlogUpsertFormSection
