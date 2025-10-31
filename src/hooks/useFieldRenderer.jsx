/* eslint-disable react-hooks/exhaustive-deps */
import AddTileRenderField from '@/components/fieldRenderers/AddTileRenderField'
import ChildFieldRenderField from '@/components/fieldRenderers/ChildFieldRenderField'
import ImageRenderField from '@/components/fieldRenderers/ImageRenderField'
import ImageTileRenderField from '@/components/fieldRenderers/ImageTileRenderField'
import SearchBar from '@/components/generals/SearchBar'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import { getImageFromCloud } from '@/utils/commons'
import { isStringArray } from '@/utils/handleBooleanUtil'
import { getObjectValueFromStringPath, normalizeOptions } from '@/utils/handleObjectUtil'
import { Delete } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { useCallback, useEffect, useRef } from 'react'
import useFileUrls from './helpers/useFileUrls'
import useTranslation from './useTranslation'

/**
 * @typedef {Object} FieldDefinition
 * @property {string} key
 * @property {string} title
 * @property {"text" | "search" | "date" | "number" | "email" | "select" | "image" | "object" | "array"} [type='text']
 * @property {boolean} [required=true]
 * @property {number} [multiple=undefined]
 * @property {Array<string|Object>} [options]
 * @property {function(string|number, {value: string|number, label: string, disabled?: boolean}):JSX.Element} [renderOption]
 * @property {Array<FieldDefinition>} [of]
 * @property {Array<function(string):string>} [validate]
 * @property {import('@mui/material').TextFieldProps} [props]
 */

/**
 * @returns {{ renderField: function(FieldDefinition):JSX.Element, hasRequiredMissing: function(Array<FieldDefinition>):boolean }}
 */
export default function useFieldRenderer(
	values,
	setField,
	handleChange = () => {},
	registerRef = () => {},
	submitted,
	textFieldVariant = 'standard',
	textFieldSize = 'medium'
) {
	const normalizedImageKeysRef = useRef(new Set())
	const { getUrlForFile, revokeUrlForFile } = useFileUrls()
	const { t } = useTranslation()

	useEffect(() => {
		normalizedImageKeysRef.current.clear()
	}, [values])

	const getImageKeyNames = (fieldKey) => {
		const base = String(fieldKey).split('.').pop() || ''
		const cap = base ? base.charAt(0).toUpperCase() + base.slice(1) : ''
		return {
			remainKey: `remain${cap}`,
			newKey: `new${cap}`,
			removeKey: `remove${cap}`,
		}
	}

	const getImageCount = (f) => {
		const { remainKey, newKey } = getImageKeyNames(f.key)
		const v = values[f.key]

		const remain = Array.isArray(values[remainKey])
			? values[remainKey]
			: v && typeof v === 'object' && Array.isArray(v[remainKey])
			? v[remainKey]
			: []

		const news = Array.isArray(values[newKey])
			? values[newKey]
			: v && typeof v === 'object' && Array.isArray(v[newKey])
			? v[newKey]
			: Array.isArray(v)
			? v
			: []

		return (remain?.length || 0) + (news?.length || 0)
	}

	const hasRequiredMissing = useCallback(
		(fields) => {
			const checkField = (f, v) => {
				if (f.required !== undefined && !f.required) return false

				if (f.type === 'image') {
					const max = Number.isFinite(f.multiple) ? Math.max(1, Number(f.multiple)) : 1
					if (max === 1) {
						return !v
					}

					return getImageCount(f) === 0
				}

				if (f.type === 'array') return !Array.isArray(v) || v.length === 0
				if (f.type === 'object') {
					const obj = v || {}
					const children = f.of || []
					return children.some((c) => obj[c.key] === '' || obj[c.key] == null)
				}

				return v == null || v === ''
			}
			return fields.some((f) => checkField(f, values[f.key]))
		},
		[values]
	)

	const renderStandard = (field) => {
		const opts = normalizeOptions(field.options || [])

		return (
			<ValidationTextField
				key={field.key}
				variant={textFieldVariant}
				ref={registerRef(field.key)}
				name={field.key}
				label={field.title}
				required={field.required ?? true}
				type={field.type || 'text'}
				options={opts}
				renderOption={field.renderOption}
				value={getObjectValueFromStringPath(values, field.key) || ''}
				onChange={handleChange}
				validate={field.validate}
				multiline={!!field.multiple}
				minRows={field.multiple}
				size={textFieldSize}
				{...(field.props || {})}
			/>
		)
	}

	const renderSearch = (field) => {
		const value = getObjectValueFromStringPath(values, field.key) ?? ''
		const setValue = (val) => setField(field.key, val)
		const renderOption = field.renderOption

		const getOptionLabel = renderOption
			? (opt) => {
					try {
						return renderOption(opt)?.props?.children || renderOption(opt) || ''
					} catch {
						return opt?.label || String(opt)
					}
			  }
			: (opt) => opt?.label || String(opt)

		return (
			<SearchBar
				key={field.key}
				widthPercent={field.widthPercent ?? 0}
				value={value}
				setValue={setValue}
				placeholder={field.title}
				options={field.options || []}
				getOptionLabel={getOptionLabel}
				onEnterDown={field.onEnterDown}
			/>
		)
	}

	const renderImageSingle = (field) => {
		const file = values[field.key]
		const required = field.required ?? true
		const showError = submitted && required && !file

		let preview = ''
		if (file instanceof File) {
			preview = URL.createObjectURL(file)
		} else if (typeof file === 'string') {
			preview = getImageFromCloud(file)
		}

		return (
			<ImageRenderField
				key={field.key}
				field={field}
				textFieldVariant={textFieldVariant}
				setField={setField}
				showError={showError}
				preview={preview}
			/>
		)
	}

	const renderImageMultiple = (field) => {
		const key = field.key
		const { remainKey, newKey, removeKey } = getImageKeyNames(key)
		const required = field.required ?? true
		const max = Math.max(1, Number(field.multiple) || 1)

		const toPreviewSrc = (val) => {
			if (val instanceof File) return getUrlForFile(val)
			if (typeof val === 'string') return getImageFromCloud(val)
			return ''
		}

		const legacyVal = values[key]
		if (isStringArray(legacyVal) && !normalizedImageKeysRef.current.has(key)) {
			normalizedImageKeysRef.current.add(key)
			const initialRemain = legacyVal.filter(Boolean).slice()
			setField(remainKey, initialRemain)
			setField(newKey, [])
			setField(removeKey, [])
			setField(key, undefined)
		}

		const remain = Array.isArray(values[remainKey]) ? values[remainKey] : []
		const news = Array.isArray(values[newKey]) ? values[newKey] : []
		const removedList = Array.isArray(values[removeKey]) ? values[removeKey] : []

		const total = remain.length + news.length
		const capacityLeft = Math.max(0, max - total)
		const showError = submitted && required && total === 0

		const addFiles = (filesList) => {
			if (!filesList?.length || capacityLeft <= 0) return
			const picked = Array.from(filesList).slice(0, capacityLeft)
			setField(newKey, [...news, ...picked])
		}

		const removeRemain = (idx) => {
			if (idx < 0 || idx >= remain.length) return
			const nextRemain = remain.slice()
			const removed = nextRemain.splice(idx, 1)[0]
			setField(remainKey, nextRemain)
			setField(removeKey, [...removedList, removed])
		}

		const removeNew = (idx) => {
			if (idx < 0 || idx >= news.length) return
			const nextNew = news.slice()
			const removed = nextNew.splice(idx, 1)[0]
			setField(newKey, nextNew)
			if (removed instanceof File) revokeUrlForFile(removed)
		}

		const inputId = `${key}__picker`

		return (
			<Stack key={key} spacing={1.25}>
				<Typography variant='subtitle2'>
					{field.title} ({total}/{max})
				</Typography>
				<input
					id={inputId}
					type='file'
					accept='image/*'
					multiple
					style={{ display: 'none' }}
					onChange={(e) => {
						addFiles(e.target.files)
						e.target.value = ''
					}}
				/>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
					{remain.map((url, i) => (
						<ImageTileRenderField
							key={`remain-${i}`}
							src={toPreviewSrc(url)}
							alt={`${field.title}-remain-${i}`}
							onRemove={() => removeRemain(i)}
						/>
					))}

					{news.map((file, i) => {
						const fileKey = (f) => `${f.name}_${f.size}_${f.lastModified}_${i}`
						return (
							<ImageTileRenderField
								key={`new-${fileKey(file)}`}
								src={toPreviewSrc(file)}
								alt={`${field.title}-new-${fileKey(file)}`}
								onRemove={() => removeNew(i)}
							/>
						)
					})}
					{capacityLeft > 0 && <AddTileRenderField remaining={capacityLeft} inputId={inputId} />}
				</Box>

				{showError && (
					<Typography variant='caption' color='error'>
						{t('error.required')}
					</Typography>
				)}
			</Stack>
		)
	}

	const renderObject = (field) => {
		const obj = values[field.key] || {}
		const children = field.of || []

		const updateChild = (childKey, nextVal) => setField(field.key, { ...obj, [childKey]: nextVal })

		const renderChild = (child) => {
			const joinPath = (parent, child) => (parent ? `${parent}.${child}` : child)
			const name = joinPath(field.key, child.key)
			const v = obj[child.key] ?? ''
			return (
				<ChildFieldRenderField
					key={name}
					child={child}
					name={name}
					value={v}
					onChange={(e) => updateChild(child.key, e.target.value)}
					registerRef={registerRef}
					textFieldVariant={textFieldVariant}
					textFieldSize={textFieldSize}
				/>
			)
		}

		return (
			<Stack key={field.key} spacing={1.25}>
				<Typography variant='subtitle2'>{field.title}</Typography>
				<Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap' }}>
					{children.map(renderChild)}
				</Stack>
			</Stack>
		)
	}

	const renderArray = (field) => {
		const rows = values[field.key] || []
		const required = field.required ?? true
		const showListError = submitted && required && rows.length === 0
		const childFields = field.of || []

		const makeDefaultOf = (children = []) => {
			const o = {}
			for (const f of children) o[f.key] = f.defaultValue ?? (f.type === 'image' ? null : '')
			return o
		}

		const addRow = () => setField(field.key, [...rows, makeDefaultOf(childFields)])
		const removeRow = (idx) =>
			setField(
				field.key,
				rows.filter((_, i) => i !== idx)
			)

		const updateCell = (idx, childKey, nextVal) => {
			const next = rows.slice()
			next[idx] = { ...next[idx], [childKey]: nextVal }
			setField(field.key, next)
		}

		const renderChild = (child, idx) => {
			const name = `${field.key}[${idx}].${child.key}`
			const v = rows[idx]?.[child.key] ?? ''
			return (
				<ChildFieldRenderField
					key={name}
					child={child}
					name={name}
					value={v}
					onChange={(e) => updateCell(idx, child.key, e.target.value)}
					registerRef={registerRef}
					textFieldVariant={textFieldVariant}
					textFieldSize={textFieldSize}
				/>
			)
		}

		return (
			<Stack key={field.key} spacing={1.25}>
				<Typography variant='subtitle2'>{field.title}</Typography>
				<Stack spacing={2}>
					{rows.map((_, idx) => (
						<Stack key={idx} direction='row' spacing={1} alignItems='center'>
							<Stack direction='row' spacing={1} sx={{ flex: 1, flexWrap: 'wrap' }}>
								{childFields.map((child) => renderChild(child, idx))}
							</Stack>
							<IconButton variant='outlined' color='error' onClick={() => removeRow(idx)}>
								<Delete />
							</IconButton>
						</Stack>
					))}
				</Stack>
				{showListError && (
					<Typography variant='caption' color='error'>
						{t('error.required')}
					</Typography>
				)}
				<Button variant='outlined' onClick={addRow} sx={{ width: 'min(50%, 200px)' }}>
					+ {t('button.add_row')}
				</Button>
			</Stack>
		)
	}

	const renderImage = (field) => {
		const max = Number.isFinite(field.multiple) ? Math.max(1, Number(field.multiple)) : 1
		return max > 1 ? renderImageMultiple(field) : renderImageSingle(field)
	}

	const map = {
		text: renderStandard,
		search: renderSearch,
		number: renderStandard,
		email: renderStandard,
		select: renderStandard,
		image: renderImage,
		object: renderObject,
		array: renderArray,
		_default: renderStandard,
	}

	const renderField = useCallback(
		(field) => {
			if (!field || !field.key) {
				return null
			}
			const type = field.type || 'text'
			const fn = map[type] || map._default
			return fn(field)
		},
		[map]
	)

	return { renderField, hasRequiredMissing }
}

// Usage Example
////// JUST USE 'require = false' IF THE FIELD IS NOT REQUIRED, OR ELSE THE FIELD IS ALWAYS REQUIRED //////
/*
const fields = [
	// Normal field
	{ key: 'name', title: 'Name', validate: [maxLen(255)] },
	// Changed type to 'email' and some customize props
	{ key: 'email', title: 'Email', type: 'email', validate: [maxLen(255)], props: { variant: 'outlined', slotProps: { input: { readOnly: true } } } },
	// Multiline field
	{ key: 'description', title: 'Description', multiple: 4, validate: [maxLen(1000)] },
	// Number field with numberRange validation
	{ key: 'age', title: 'Age', type: 'number', validate: [numberRange(0, 100)] },
	// Select field with options
	{ key: 'role', title: 'Role', type: 'select', options: ['Admin', 'User', { label: 'Guest', value: 'guest', disabled: true }] },
	// Select with custom renderOption
	{ key: 'customSelect', title: 'Custom Select', type: 'select', options: [
		{ label: 'Option 1', value: 'opt1' },
		{ label: 'Option 2', value: 'opt2' },
	], renderOption: (value, opt) => (<span style={{ fontWeight: opt.value === 'opt1' ? 'bold' : 'normal' }}>{opt.label}</span>) },
	// Image upload field with required false
	{ key: 'avatar', title: 'Avatar', type: 'image', required: false },
	// Image upload field allowing multiple images (max 3)
	{ key: 'images', title: 'Images', type: 'image', multiple: 5 },
	// Object field with child fields
	{ key: 'address', title: 'Address', type: 'object', of: [
		{ key: 'city', title: 'City', validate: [maxLen(255)] },
		{ key: 'country', title: 'Country', validate: [maxLen(255)] },
	]},
	// Array field with child fields
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
	role: 'User',
	customSelect: 'opt1',
	avatar: '/avatar.jpg',
	images: ['/image1.jpg', '/image2.jpg'],
	address: { city: 'City Name', country: 'Country Name' },
	contacts: [ { type: 'Phone', value: '123-456-7890' }, { type: 'Email', value: 'Doe@example.com' }],
}

// useForm with useFieldRenderer
const [submitted, setSubmitted] = useState(false)
const { values, handleChange, setField, reset, registerRef, validateAll } = useForm(initialValues)
const { renderField, hasRequiredMissing } = useFieldRenderer(values, setField, handleChange, registerRef, submitted, 'standard'/'outlined'/'filled', 'small'/'medium')

const handleSubmit = () => {
	setSubmitted(true)
	const ok = validateAll()
	const isMissing = hasRequiredMissing(fields)

	if (!ok || isMissing) {
		alert('Please fill all required fields')
		return
	}

	alert('Form submitted: ' + JSON.stringify(values, null, 2))
}

<Stack spacing={2}>
	{fields.map((f) => renderField(f))}
	<Button
		variant='contained'
		onClick={handleSubmit}
	>
		Submit
	</Button>
</Stack>

*/
