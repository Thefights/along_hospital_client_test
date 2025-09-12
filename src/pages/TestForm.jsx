import GenericFormDialog from '@/components/dialogs/GenericFormDialog'
import { maxLen, numberRange } from '@/utils/validateUtil'
import { useState } from 'react'

const TestForm = () => {
	const [createDialogOpen, setCreateDialogOpen] = useState(true)

	const fields = [
		// Normal field
		{ key: 'name', title: 'Name', validate: [maxLen(255)] },

		// Changed type to 'email'
		{ key: 'email', title: 'Email', type: 'email', validate: [maxLen(255)] },

		// Multiline field
		{ key: 'description', title: 'Description', multiple: 4, validate: [maxLen(1000)] },

		// Number field with numberRange validation
		{ key: 'age', title: 'Age', type: 'number', validate: [numberRange(0, 100)] },

		// Image upload field
		{
			key: 'avatar',
			title: 'Avatar',
			type: 'image',
			required: false,
			imagePreview: 'https://example.com/avatar.jpg',
		},

		// Select field with options
		{
			key: 'role',
			title: 'Role',
			type: 'select',
			options: ['User', 'Admin', { label: 'Super Admin', value: 'superadmin', disabled: true }],
		},

		// Object field with nested fields
		{
			key: 'address',
			title: 'Address',
			type: 'object',
			of: [
				{ key: 'street', title: 'Street' },
				{ key: 'city', title: 'City' },
				{ key: 'zip', title: 'ZIP Code', validate: [maxLen(10)] },
			],
		},

		// Array field with nested fields
		{
			key: 'contacts',
			title: 'Contacts',
			type: 'array',
			of: [
				{ key: 'type', title: 'Type', type: 'select', options: ['Phone', 'Email'] },
				{ key: 'value', title: 'Value', validate: [maxLen(255)] },
			],
		},
	]

	const initialValues = {
		name: 'DuyLP',
		email: 'DuyLPCE181153@fpt.edu.vn',
		description: 'Toi ten la DuyLP',
		age: 21,
		avatar: '',
		role: 'Admin',
		address: { street: 'Chu Van An', city: 'An Giang', zip: '900000' },
		contacts: [],
	}

	return (
		<GenericFormDialog
			open={createDialogOpen}
			onClose={() => setCreateDialogOpen(false)}
			fields={fields}
			initialValues={initialValues}
			submitUrl={'/user'}
			method='PUT'
			params={1} // This is Id 1
			submitLabel={'Update'}
			submitButtonColor={'success'}
		/>
	)
}

export default TestForm
