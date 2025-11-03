import useTranslation from '@/hooks/useTranslation'
import { getObjectMerged } from '@/utils/handleObjectUtil'
import { isEmail, isNumber, isPhone, isRequired } from '@/utils/validateUtil'
import { MenuItem, TextField } from '@mui/material'
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react'

/**
 * @typedef {Object} CustomProps
 * @property {string} label
 * @property {string|number} value
 * @property {(value: string|number) => void} onChange
 * @property {(value: string|number) => string|null} [validate]
 * @property {{value: string|number, label: string, disabled?: boolean}[]} [options=[]]
 * @property {function(string|number, {value: string|number, label: string, disabled?: boolean}):JSX.Element} [renderOption]
 * @property {string|number} [minValue]
 * @property {string|number} [maxValue]
 * @property {boolean} [readOnly=false]
 */

/**
 * @param {import('@mui/material').TextFieldProps & CustomProps} props
 * @param {React.Ref} ref
 *
 */
const ValidationTextField = (
	{
		label,
		type = 'text',
		required = true,
		value,
		onChange,
		validate,
		options = [],
		renderOption,
		minValue,
		maxValue,
		readOnly = false,
		...props
	},
	ref
) => {
	const [error, setError] = useState('')
	const { t } = useTranslation()

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
		if (type === 'tel') rs.push(isPhone())

		return rs
	}, [required, type])

	const allRules = useMemo(() => [...builtinRules, ...userRules], [builtinRules, userRules])

	const runWith = useCallback(
		(val, { skipEmpty = false } = {}) => {
			const isEmpty = val === '' || val === undefined || val === null
			if (skipEmpty && isEmpty) {
				setError('')
				return true
			}
			for (const r of allRules) {
				const res = r(val)
				if (res !== true) {
					setError(res)
					return false
				}
			}
			setError('')
			return true
		},
		[allRules]
	)

	const run = useCallback(() => runWith(value), [runWith, value])

	useImperativeHandle(ref, () => ({ validate: run }), [run])

	const internalSlotProps = useMemo(() => {
		const inputProps = {}

		if (minValue !== undefined) inputProps.min = minValue
		if (maxValue !== undefined) inputProps.max = maxValue

		const result = {}

		if (Object.keys(inputProps).length > 0) {
			result.input = { ...result.input, inputProps }
		}

		if (readOnly) {
			result.input = { ...result.input, readOnly: true }
		}

		if (type === 'select') {
			result.select = { displayEmpty: true }
			result.inputLabel = { shrink: true }
		} else if (type === 'date' || type === 'time' || type === 'file') {
			result.inputLabel = { shrink: true }
		}

		return Object.keys(result).length > 0 ? result : undefined
	}, [type, minValue, maxValue, readOnly])

	const mergedSlotProps = useMemo(
		() => getObjectMerged(internalSlotProps, slotProps),
		[internalSlotProps, slotProps]
	)

	return (
		<TextField
			label={label}
			value={value ?? undefined}
			onChange={(e) => {
				if (error) runWith(e.target.value, { skipEmpty: true })
				onChange?.(e)
			}}
			onBlur={run}
			error={!!error}
			type={type}
			helperText={error}
			required={required}
			fullWidth
			variant='outlined'
			select={type === 'select'}
			slotProps={mergedSlotProps}
			{...restProps}
		>
			<MenuItem value='' disabled>
				-- {t('text.select_options')} --
			</MenuItem>
			{options &&
				options.length > 0 &&
				options.map((opt) => (
					<MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
						{renderOption ? renderOption(opt.value, opt) : opt.label}
					</MenuItem>
				))}
		</TextField>
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
