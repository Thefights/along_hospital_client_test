export const isValidatedFieldsRef = (fieldsRef) => {
	let isValid = true
	Object.keys(fieldsRef.current).forEach((key) => {
		if (fieldsRef.current[key] && !fieldsRef.current[key].validate()) {
			isValid = false
		}
	})
	return isValid
}
