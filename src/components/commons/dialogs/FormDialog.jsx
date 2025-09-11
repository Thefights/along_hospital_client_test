import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useForm } from '@/hooks/useForm'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useCallback, useMemo } from 'react'
import ValidationTextField from '../textFields/ValidationTextField'

const FormDialog = ({
	open,
	onClose,
	title = 'Form',
	fields = [],
	initialValues = {},
	submitUrl = '',
	method = 'POST',
	params = {},
	submitLabel = 'Submit',
	submitButtonColor = 'primary',
	onSuccess,
	onError,
}) => {
	const startValues = useMemo(() => {
		const v = { ...initialValues }
		for (const field of fields)
			if (v[field.key] === undefined)
				v[field.key] =
					field.defaultValue ??
					(field.type === 'image' && (field.imageInput ?? 'file') === 'file' ? null : '')
		return v
	}, [fields, initialValues])

	const { values, handleChange, setField, reset, registerRef, validateAll } = useForm(startValues)
	const { loading, error, response, submit } = useAxiosSubmit(submitUrl, method, values, params)

	const handleClose = useCallback(() => {
		reset(startValues)
		onClose?.()
	}, [onClose, reset, startValues])

	const handleSubmit = useCallback(async () => {
		try {
			const ok = validateAll()
			if (!ok) return
			const res = await submit()
			onSuccess?.(res)
			handleClose()
		} catch (e) {
			onError?.(e)
		}
	}, [handleClose, onError, onSuccess, submit, validateAll, values])

	const renderStandard = (field) => (
		<ValidationTextField
			key={field.key}
			ref={registerRef(field.key)}
			name={field.key}
			label={field.title}
			type={field.type ?? 'text'}
			value={values[field.key] ?? ''}
			onChange={handleChange}
			validate={field.validate}
			multiline={!!field.multiline}
			rows={field.multiline ? field.rows || 4 : undefined}
			{...(field.props || {})}
		/>
	)

	const renderSelect = (field) => {
		const normalizedOptions = field.options.map((opt) =>
			typeof opt === 'object' && opt !== null && 'value' in opt
				? opt
				: { label: String(opt), value: opt }
		)

		return (
			<ValidationTextField
				key={field.key}
				ref={registerRef(field.key)}
				name={field.key}
				label={field.title}
				value={values[field.key]}
				onChange={handleChange}
				validate={field.validate}
				select
				{...(field.props || {})}>
				{normalizedOptions.map((opt) => (
					<MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
						{opt.label}
					</MenuItem>
				))}
			</ValidationTextField>
		)
	}

	const renderImage = (field) => {
		const file = values[field.key]
		const preview = file instanceof File ? URL.createObjectURL(file) : ''

		return (
			<Box key={field.key}>
				<ValidationTextField
					ref={registerRef(field.key)}
					name={field.key}
					label={field.title}
					type='file'
					value={undefined}
					onChange={(e) => {
						const file = e?.target?.files?.[0] || null
						setField(field.key, file)
					}}
					validate={field.validate}
					slotProps={{ input: { inputProps: { accept: 'image/*' } } }}
					{...(field.props || {})}
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
							sx={{ width: '100%', maxHeight: 240, objectFit: 'contain', borderRadius: 2, boxShadow: 1 }}
							onLoad={() => URL.revokeObjectURL(preview)}
						/>
					</Box>
				)}
			</Box>
		)
	}

	return (
		<Dialog open={!!open} onClose={handleClose} fullWidth maxWidth='sm'>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>
				<Stack spacing={2.25}>
					{fields.map((field) => {
						if (field.type === 'image') return renderImage(field)
						if (field.type === 'select') return renderSelect(field)
						return renderStandard(field)
					})}
					{error && (
						<Typography variant='body2' color='error'>
							{error?.message || String(error)}
						</Typography>
					)}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color='secondary' disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} color={submitButtonColor} variant='contained' disabled={loading}>
					{loading ? 'Submitting...' : submitLabel}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default FormDialog

// Usage Example
/*
const fields = [
    // Normal field
    { key: 'name', title: 'Name', validate: [maxLen(255)] }, 

    // Changed type to 'email'
    { key: 'email', title: 'Email', type: 'email', validate: [maxLen(255)] },

    // Multiline field
    { key: 'description', title: 'Description', multiline: 4, validate: [maxLen(1000)] }, 

    // Number field with numberRange validation
    { key: 'age', title: 'Age', type: 'number', validate: [numberRange(0, 100)] },

    // Image upload field
    { key: 'avatar', title: 'Avatar', type: 'image' },

	// Select field with options
	{ key: 'role', title: 'Role', type: 'select', options: ['User', 'Admin', { label: 'Super Admin', value: 'superadmin', disabled: true }] },
]

const initialValues = { name: '', email: '', description: '', age: '', avatar: '', role: '' }

<FormDialog
    open={createDialogOpen}
    onClose={() => setCreateDialogOpen(false)}
    fields={fields}
    initialValues={initialValues}
    submitUrl={submitUrl}
    method='PUT'
    params={1} // This is Id 1
    submitLabel={submitLabel}
    submitButtonColor={submitButtonColor}
    onSuccess={(res) => handleSuccess(res)}
    onError={(e) => handleError(e)}
/>

*/
