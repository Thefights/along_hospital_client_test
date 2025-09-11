import { isEmail, isNumber, required } from '@/utils/validateUtil'
import { TextField } from '@mui/material'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

/**
 * @typedef {Object} CustomProps
 * @property {string} label
 * @property {string|number} value
 * @property {function} onChange
 * @property {function} validate
 */

/**
 * @param {import('@mui/material').TextFieldProps & CustomProps} props
 * @param {React.Ref} ref
 *
 */
const ValidationTextField = (
	{ label, type = 'text', value, onChange, validate, ...props },
	ref
) => {
	const [error, setError] = useState('')

	const userRules = useMemo(() => {
		if (!validate) return []
		return Array.isArray(validate) ? validate : [validate]
	}, [validate])

	const builtinRules = useMemo(() => {
		const rs = []
		rs.push(required())

		if (type === 'email') rs.push(isEmail())
		if (type === 'number') rs.push(isNumber())

		return rs
	}, [type])

	const allRules = useMemo(() => [...builtinRules, ...userRules], [builtinRules, userRules])

	const run = useCallback(() => {
		const raw = typeof value === 'string' ? value.trim() : value
		for (const r of allRules) {
			const res = r(raw)
			if (res !== true) {
				setError(res)
				return false
			}
		}
		setError('')
		return true
	}, [value, allRules])

	useImperativeHandle(ref, () => ({ validate: run }), [run])

	return (
		<TextField
			label={label}
			value={value ?? undefined}
			onChange={onChange}
			onBlur={run}
			error={!!error}
			type={type}
			helperText={error}
			required
			fullWidth
			variant='outlined'
			slotProps={type === 'date' || type === 'time' ? { inputLabel: { shrink: true } } : undefined}
			{...props}
		/>
	)
}

export default forwardRef(ValidationTextField)

// For select text field
/*
<ValidationTextField
  label={'Project Name'}
  select
  value={value || ''}
  onChange={setValue}
  >
    {array.map((element) => (
      <MenuItem key={element.id} value={element.id}>
        {element.name}
      </MenuItem>
    ))}
</ValidationTextField>
*/
