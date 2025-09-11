import { formatNumberWithCommas } from '@/utils/generalFormatter'
import { TextField } from '@mui/material'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

/**
 * @typedef {Object} CustomProps
 * @property {string} label
 * @property {string|number} value
 * @property {function} onChange
 * @property {number} [minInput]
 * @property {number} [maxInput]
 * @property {string} [regex]
 * @property {string} [regexErrorText]
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
		value,
		onChange,
		minInput,
		maxInput = 255,
		regex,
		regexErrorText,
		...props
	},
	ref
) => {
	const [error, setError] = useState('')

	const validateInput = () => {
		value = value && typeof value === 'string' ? value.trim() : value
		if (value === '' || value === undefined || value === null) {
			setError('This field is required')
			return false
		}

		if (regex && !new RegExp(regex).test(value)) {
			setError(regexErrorText)
			return false
		}

		if (type === 'number' && isNaN(Number(value))) {
			setError('Please enter a valid number')
			return false
		}

		if (type === 'email' && !/^[a-zA-Z]+[-.]?\w+@([\w-]+\.)+[\w]{2,}$/.test(value)) {
			setError('Please enter a valid email address')
			return false
		}

		if (maxInput !== undefined) {
			if (type === 'number' && value > maxInput) {
				setError(`Number input can't greater than ${formatNumberWithCommas(maxInput)}`)
				return false
			}

			if (type !== 'number' && value.length > maxInput) {
				setError(`This field can't exceed ${maxInput} characters`)
				return false
			}
		}

		if (minInput !== undefined) {
			if (type === 'number' && value < minInput) {
				setError(`Number input can't less than ${minInput}`)
				return false
			}

			if (type !== 'number' && value.length < minInput) {
				setError(`This field must at least ${minInput} characters`)
				return false
			}
		}

		setError('')
		return true
	}

	useImperativeHandle(ref, () => ({
		validate: () => validateInput(),
	}))

	return (
		<TextField
			label={label}
			value={value ?? undefined}
			onChange={onChange}
			onBlur={validateInput}
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
  ref={(el) => (fieldsRef.current['value'] = el)}
  >
    {array.map((element) => (
      <MenuItem key={element.id} value={element.id}>
        {element.name}
      </MenuItem>
    ))}
</ValidationTextField>
*/
