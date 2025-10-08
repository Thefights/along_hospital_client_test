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
			size={textFieldSize}
			sx={{ minWidth: 220, flex: 1 }}
			{...(child.props || {})}
		>
			{opts &&
				opts.length > 0 &&
				opts.map((opt) => (
					<MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
						{opt.label}
					</MenuItem>
				))}
		</ValidationTextField>
	)
}

export default ChildFieldRenderField
