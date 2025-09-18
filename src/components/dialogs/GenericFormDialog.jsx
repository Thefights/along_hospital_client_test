import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'

const GenericFormDialog = ({
	open,
	onClose,
	title = 'Form',
	fields = [],
	initialValues = {},
	submitUrl = '',
	method = 'POST',
	params = {},
	submitLabel,
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

	const [submitted, setSubmitted] = useState(false)
	const { t } = useTranslation()
	const { values, handleChange, setField, reset, registerRef, validateAll } = useForm(startValues)
	const { loading, submit } = useAxiosSubmit(submitUrl, method, values, params)
	const { renderField, hasRequiredMissing } = useFieldRenderer(
		values,
		setField,
		handleChange,
		registerRef,
		submitted,
		'standard'
	)

	useEffect(() => {
		if (open) {
			setSubmitted(false)
			reset(startValues)
		}
	}, [open])

	const handleClose = useCallback(() => {
		reset(startValues)
		onClose?.()
	}, [onClose, reset, startValues])

	const handleSubmit = useCallback(async () => {
		setSubmitted(true)
		const ok = validateAll()
		const missingField = hasRequiredMissing(fields)
		if (missingField || !ok) return

		try {
			const res = await submit()
			onSuccess?.(res)
			handleClose()
		} catch (e) {
			onError?.(e)
		}
	}, [handleClose, onError, onSuccess, submit, validateAll, values])

	return (
		<Dialog open={!!open} onClose={handleClose} fullWidth maxWidth='sm'>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>
				<Stack spacing={2.25}>{fields.map(renderField)}</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color='secondary' disabled={loading}>
					{t('button.cancel')}
				</Button>
				<Button onClick={handleSubmit} color={submitButtonColor} variant='contained' disabled={loading}>
					{loading ? t('button.submitting') + '...' : submitLabel ?? t('button.submit')}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default GenericFormDialog

// Usage Example
/*
const fields = [
    // Normal field
    { key: 'name', title: 'Name', validate: [maxLen(255)] }, 

    // Changed type to 'email'
    { key: 'email', title: 'Email', type: 'email', validate: [maxLen(255)] },

    // Multiline field
    { key: 'description', title: 'Description', multiple: 4, validate: [maxLen(1000)] }, 

    // Number field with numberRange validation
    { key: 'age', title: 'Age', type: 'number', validate: [numberRange(0, 100)] },

    // Image upload field with required false
    { key: 'avatar', title: 'Avatar', type: 'image', required: false, imagePreview: 'https://example.com/avatar.jpg' },

	{ key: 'images', title: 'Images', type: 'image', required:true, multiple: 5 },

	// Select field with options
	{ key: 'role', title: 'Role', type: 'select', options: ['User', 'Admin', { label: 'Super Admin', value: 'superadmin', disabled: true }] },

	// Object field with nested fields
	{ key: 'address', title: 'Address', type: 'object', of: [
		{ key: 'street', title: 'Street' },
		{ key: 'city', title: 'City' },
		{ key: 'zip', title: 'ZIP Code', validate: [maxLen(10)] },
	]},

	// Array field with nested fields
	{ key: 'contacts', title: 'Contacts', type: 'array', of: [
		{ key: 'type', title: 'Type', type: 'select', options: ['Phone', 'Email'] },
		{ key: 'value', title: 'Value', validate: [maxLen(255)] },
	]},
]

const initialValues = { 
	name: 'Doe',
 	email: 'Doe@example.com',
	description: 'Description here',
	age: '25',
   	avatar: '/avatar.jpg',
	images: ['/image1.jpg', '/image2.jpg'],
   	role: 'User',
   	address: { street: 'Street Name', city: 'City Name', zip: '12345' },
	contacts: [ { type: 'Phone', value: '123-456-7890' }, { type: 'Email', value: 'Doe@example.com' }],
}

<GenericFormDialog
    open={createDialogOpen}
    onClose={() => setCreateDialogOpen(false)}
    fields={fields}
    submitUrl={submitUrl}
    method='PUT'
    params={1} // This is Id 1
    submitLabel={submitLabel}
    submitButtonColor={submitButtonColor}
    onSuccess={(res) => handleSuccess(res)}
    onError={(e) => handleError(e)}
/>

*/
