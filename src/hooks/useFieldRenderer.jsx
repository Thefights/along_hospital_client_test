import ValidationTextField from '@/components/textFields/ValidationTextField'
import { isStringArray } from '@/utils/handleBooleanUtil'
import { Add, Close, Delete } from '@mui/icons-material'
import { Box, Button, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useRef } from 'react'
import useFileUrls from './useFileUrls'

const normalizeOptions = (options) =>
	Array.isArray(options)
		? options.map((option) =>
				typeof option === 'object' && option !== null && 'value' in option
					? option
					: { label: String(option), value: option }
		  )
		: []

export default function useFieldRenderer(
	values,
	setField,
	handleChange = () => {},
	registerRef = () => {},
	submitted,
	textFieldVariant = 'outlined'
) {
	const normalizedImageKeysRef = useRef(new Set())
	const { getUrlForFile, revokeUrlForFile } = useFileUrls()

	useEffect(() => {
		normalizedImageKeysRef.current.clear()
	}, [values])

	const hasRequiredMissing = useCallback(
		(fields) => {
			const checkField = (f, v) => {
				if (f.required !== undefined && !f.required) return false

				if (f.type === 'image') {
					const max = Number.isFinite(f.multiple) ? Math.max(1, Number(f.multiple)) : 1
					if (max === 1) return !v
					if (v && typeof v === 'object' && ('remainImages' in v || 'newImages' in v)) {
						const total = (v.remainImages?.length || 0) + (v.newImages?.length || 0)
						return total === 0
					}
					if (Array.isArray(v)) return v.length === 0
					return true
				}

				if (f.type === 'array') return !Array.isArray(v) || v.length === 0
				if (f.type === 'object') {
					const obj = v || {}
					const children = f.of || []
					return children.some((c) => obj[c.key] === '' || obj[c.key] == null)
				}
				return false
			}
			return fields.some((f) => checkField(f, values[f.key]))
		},
		[values]
	)

	const renderStandard = (field) => (
		<ValidationTextField
			key={field.key}
			variant={textFieldVariant}
			ref={registerRef(field.key)}
			name={field.key}
			label={field.title}
			required={field.required || true}
			type={field.type || 'text'}
			value={values[field.key] || ''}
			onChange={handleChange}
			validate={field.validate}
			multiline={!!field.multiple}
			rows={field.multiple}
			{...(field.props || {})}
		/>
	)

	const renderSelect = (field) => {
		const opts = normalizeOptions(field.options || [])
		return (
			<ValidationTextField
				key={field.key}
				variant={textFieldVariant}
				ref={registerRef(field.key)}
				name={field.key}
				required={field.required ?? true}
				label={field.title}
				value={values[field.key]}
				onChange={handleChange}
				validate={field.validate}
				select
				{...(field.props || {})}
			>
				{opts.map((opt) => (
					<MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
						{opt.label}
					</MenuItem>
				))}
			</ValidationTextField>
		)
	}

	const renderImageSingle = (field) => {
		const file = values[field.key]
		const preview = file instanceof File ? URL.createObjectURL(file) : ''
		const required = field.required ?? true
		const showError = submitted && required && !file

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

	const renderImageMultiple = (field) => {
		const key = field.key
		const required = field.required ?? true
		const max = Math.max(1, Number(field.multiple) || 1)
		const v = values[key]
		if (isStringArray(v) && !normalizedImageKeysRef.current.has(key)) {
			normalizedImageKeysRef.current.add(key)
			setField(key, {
				remainImages: v.slice(),
				newImages: [],
				removeImages: [],
			})
		}

		const isEditObj =
			v && typeof v === 'object' && ('remainImages' in v || 'newImages' in v || 'removeImages' in v)

		const remain = isEditObj ? v.remainImages || [] : []
		const news = isEditObj ? v.newImages || [] : Array.isArray(v) ? v : []

		const total = remain.length + news.length
		const capacityLeft = Math.max(0, max - total)
		const showError = submitted && required && total === 0

		const addFiles = (filesList) => {
			if (!filesList?.length || capacityLeft <= 0) return
			const picked = Array.from(filesList).slice(0, capacityLeft)
			if (isEditObj) {
				setField(key, {
					remainImages: remain,
					newImages: [...news, ...picked],
					removeImages: v.removeImages || [],
				})
			} else {
				setField(key, [...news, ...picked])
			}
		}

		const removeRemain = (idx) => {
			if (!isEditObj) return
			const nextRemain = remain.slice()
			const removed = nextRemain.splice(idx, 1)[0]
			setField(key, {
				remainImages: nextRemain,
				newImages: news,
				removeImages: [...(v.removeImages || []), removed],
			})
		}

		const removeNew = (idx) => {
			const nextNew = news.slice()
			const removed = nextNew.splice(idx, 1)[0]
			if (isEditObj) {
				setField(key, { remainImages: remain, newImages: nextNew, removeImages: v.removeImages || [] })
			} else {
				setField(key, nextNew)
			}
			if (removed instanceof File) revokeUrlForFile(removed)
		}

		const Tile = ({ src, alt, onRemove }) => (
			<Box
				sx={{
					position: 'relative',
					flex: '1 1 max(50%, 160px)',
					maxWidth: 160,
					aspectRatio: 1,
					borderRadius: 2,
					overflow: 'hidden',
					boxShadow: 1,
					alignItems: 'center',
				}}
			>
				<Box
					component='img'
					src={src}
					onError={(e) => {
						e.currentTarget.onerror = null
						e.currentTarget.src = '/image-placeholder.jpg'
					}}
					alt={alt}
					sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
				<IconButton
					size='small'
					onClick={onRemove}
					sx={{
						position: 'absolute',
						top: 4,
						right: 4,
						bgcolor: 'background.paper',
						boxShadow: 1,
						'&:hover': { bgcolor: 'background.paper' },
					}}
				>
					<Close fontSize='small' />
				</IconButton>
			</Box>
		)

		const inputId = `${key}__picker`
		const AddTile = ({ remaining }) => (
			<label htmlFor={inputId} style={{ display: 'contents' }}>
				<Box
					sx={{
						cursor: 'pointer',
						flex: '1 1 max(50%, 160px)',
						maxWidth: 160,
						aspectRatio: 1,
						borderRadius: 2,
						boxShadow: 1,
						border: '1px dashed',
						borderColor: 'divider',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transition: 'background-color .15s ease',
						'&:hover': { bgcolor: 'action.hover' },
					}}
				>
					<Stack alignItems='center' spacing={0.5}>
						<Add />
						<Typography variant='caption'>Add {remaining}</Typography>
					</Stack>
				</Box>
			</label>
		)

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
						<Tile
							key={`remain-${i}`}
							src={String(url)}
							alt={`${field.title}-remain-${i}`}
							onRemove={() => removeRemain(i)}
						/>
					))}
					{news.map((file, i) => {
						const src = file instanceof File ? getUrlForFile(file) : ''
						const fileKey = (f) => `${f.name}_${f.size}_${f.lastModified}`
						return (
							<Tile
								key={`new-${fileKey(file)}`}
								src={src}
								alt={`${field.title}-new-${fileKey(file)}`}
								onRemove={() => removeNew(i)}
							/>
						)
					})}
					{capacityLeft > 0 && <AddTile remaining={capacityLeft} />}
				</Box>

				{showError && (
					<Typography variant='caption' color='error'>
						This field is required
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
			if (child.type === 'select') {
				const opts = normalizeOptions(child.options || [])
				return (
					<ValidationTextField
						key={name}
						variant={textFieldVariant}
						ref={registerRef(name)}
						name={name}
						label={child.title}
						required={child.required ?? true}
						value={v}
						onChange={(e) => updateChild(child.key, e.target.value)}
						validate={child.validate}
						select
						sx={{ minWidth: 220, flex: 1 }}
						{...(child.props || {})}
					>
						{opts.map((opt) => (
							<MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
								{opt.label}
							</MenuItem>
						))}
					</ValidationTextField>
				)
			}
			return (
				<ValidationTextField
					key={name}
					variant={textFieldVariant}
					ref={registerRef(name)}
					name={name}
					required={child.required ?? true}
					label={child.title}
					type={child.type ?? 'text'}
					value={v}
					onChange={(e) => updateChild(child.key, e.target.value)}
					validate={child.validate}
					sx={{ flex: 1 }}
					{...(child.props || {})}
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
			if (child.type === 'select') {
				const opts = normalizeOptions(child.options || [])
				return (
					<ValidationTextField
						key={name}
						variant={textFieldVariant}
						ref={registerRef(name)}
						name={name}
						required={child.required ?? true}
						label={child.title}
						value={v}
						onChange={(e) => updateCell(idx, child.key, e.target.value)}
						validate={child.validate}
						select
						sx={{ minWidth: 220, flex: 1 }}
						{...(child.props || {})}
					>
						{opts.map((opt) => (
							<MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
								{opt.label}
							</MenuItem>
						))}
					</ValidationTextField>
				)
			}
			return (
				<ValidationTextField
					key={name}
					variant={textFieldVariant}
					ref={registerRef(name)}
					name={name}
					required={child.required ?? true}
					label={child.title}
					type={child.type ?? 'text'}
					value={v}
					onChange={(e) => updateCell(idx, child.key, e.target.value)}
					validate={child.validate}
					sx={{ flex: 1 }}
					{...(child.props || {})}
				/>
			)
		}

		return (
			<Stack key={field.key} spacing={1.5}>
				<Typography variant='subtitle2'>{field.title}</Typography>
				<Stack spacing={1}>
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
						This field is required
					</Typography>
				)}
				<Button variant='outlined' onClick={addRow} sx={{ width: 'min(50%, 200px)' }}>
					+ Add row
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
		number: renderStandard,
		email: renderStandard,
		select: renderSelect,
		image: renderImage,
		object: renderObject,
		array: renderArray,
		_default: renderStandard,
	}

	const renderField = useCallback(
		(field) => {
			const type = field.type || 'text'
			const fn = map[type] || map._default
			return fn(field)
		},
		[map]
	)

	return { renderField, hasRequiredMissing }
}
