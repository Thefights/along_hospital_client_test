import React, { forwardRef, useState } from 'react'
import ValidationTextField from './ValidationTextField'
import { IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

/**
 * @typedef {Object} CustomProps
 * @property {string} label
 * @property {string} name
 * @property {string} value
 * @property {function} onChange
 */

/**
 * @param {import('@mui/material').TextFieldProps & CustomProps} props
 * @param {React.Ref} ref
 */
const PasswordTextField = ({ label, name, value, onChange, ...props }, ref) => {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<ValidationTextField
			ref={ref}
			type={showPassword ? 'text' : 'password'}
			label={label}
			name={name}
			value={value}
			onChange={onChange}
			regex='^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*()]).{8,}$'
			regexErrorText='Password must at least 8 characters and contains UPPERCASE, lowercase, number and special characters'
			maxInput={50}
			slotProps={{
				input: {
					endAdornment: (
						<InputAdornment position='end'>
							<IconButton onClick={() => setShowPassword(!showPassword)} edge='end' color='default'>
								{showPassword ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
					),
				},
			}}
			{...props}
		/>
	)
}

export default forwardRef(PasswordTextField)
