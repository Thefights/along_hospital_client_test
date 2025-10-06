import { getObjectMerged } from '@/utils/handleObjectUtil'
import { isEmail, isNumber, isRequired } from '@/utils/validateUtil'
import { TextField } from '@mui/material'
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react'

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
	{ label, type = 'text', required = true, value, onChange, validate, ...props },
	ref
) => {
	const [error, setError] = useState('')

	const { slotProps, ...restProps } = props

	const userRules = useMemo(() => {
		if (!validate) return []
		return Array.isArray(validate) ? validate : [validate]
	}, [validate])

	const builtinRules = useMemo(() => {
		const rs = []
		if (required) rs.push(isRequired())
		if (type === 'email') rs.push(isEmail())
		if (type === 'number') rs.push(isNumber())

		return rs
	}, [type])

	const allRules = useMemo(() => [...builtinRules, ...userRules], [builtinRules, userRules])

	const run = useCallback(() => {
		for (const r of allRules) {
			const res = r(value)
			if (res !== true) {
				setError(res)
				return false
			}
		}
		setError('')
		return true
	}, [value, allRules])

	useImperativeHandle(ref, () => ({ validate: run }), [run])

	const internalSlotProps = useMemo(() => {
		if (type === 'date' || type === 'time' || type === 'file') {
			return { inputLabel: { shrink: true } }
		}
		return undefined
	}, [type])

	const mergedSlotProps = useMemo(
		() => getObjectMerged(internalSlotProps, slotProps),
		[internalSlotProps, slotProps]
	)

	return (
		<TextField
			label={label}
			value={value ?? undefined}
			onChange={(e) => {
				onChange?.(e)
				run()
			}}
			onBlur={run}
			error={!!error}
			type={type}
			helperText={error}
			required={required}
			fullWidth
			variant='outlined'
			slotProps={mergedSlotProps}
			{...restProps}
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
