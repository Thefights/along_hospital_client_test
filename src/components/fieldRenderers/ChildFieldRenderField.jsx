import { normalizeOptions } from '@/utils/handleObjectUtil'
import { MenuItem } from '@mui/material'
import ValidationTextField from '../textFields/ValidationTextField'

const ChildFieldRenderField = ({
	child,
	name,
	value,
	onChange = (e) => {},
	registerRef,
	textFieldVariant,
	textFieldSize,
}) => {
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
				value={value}
				onChange={onChange}
				validate={child.validate}
				select
				size={textFieldSize}
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
	} else {
		return (
			<ValidationTextField
				key={name}
				variant={textFieldVariant}
				ref={registerRef(name)}
				name={name}
				required={child.required ?? true}
				label={child.title}
				type={child.type ?? 'text'}
				value={value}
				onChange={onChange}
				validate={child.validate}
				sx={{ flex: 1 }}
				{...(child.props || {})}
			/>
		)
	}
}

export default ChildFieldRenderField
