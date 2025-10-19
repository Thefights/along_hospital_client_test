import useTranslation from '@/hooks/useTranslation'
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
	const { t } = useTranslation()
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
			type={child.type || 'text'}
			select={child.type === 'select'}
			sx={{ minWidth: 220, flex: 1 }}
			{...(child.props || {})}
		>
			<MenuItem value='' disabled>
				-- {t('text.select_options')} --
			</MenuItem>
			{opts &&
				opts.length > 0 &&
				opts.map((opt) => {
					return (
						<MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
							{child.renderOption ? child.renderOption(opt.value) : opt.label}
						</MenuItem>
					)
				})}
		</ValidationTextField>
	)
}

export default ChildFieldRenderField
