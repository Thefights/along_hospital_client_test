/* eslint-disable no-unused-vars */
import { normalizeOptions } from '@/utils/handleObjectUtil'
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
			multiline={!!child.multiple}
			minRows={child.multiple}
			size={textFieldSize}
			options={opts}
			renderOption={child.renderOption}
			type={child.type || 'text'}
			select={child.type === 'select'}
			sx={{ minWidth: 220, flex: 1 }}
			{...(child.props || {})}
		/>
	)
}

export default ChildFieldRenderField
