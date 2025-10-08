// Format Date -> Fri, 24 May 2024
export const formatDateWithWeekDay = (dateString) => {
	if (!dateString) return ''

	const date = new Date(dateString)
	const options = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}
	return date?.toLocaleDateString('en-GB', options)
}

// Format DateTime -> 14:30:15 24/05/2024
export const formatDatetimeToDDMMYYYY = (datetimeString) => {
	if (!datetimeString) return ''

	const date = new Date(datetimeString)

	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()

	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')

	return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
}

// Format DateTime -> 14:30:15 05/24/2024
export const formatDatetimeToMMDDYYYY = (datetimeString) => {
	if (!datetimeString) return ''

	const date = new Date(datetimeString)
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()

	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')

	return `${hours}:${minutes}:${seconds} ${month}/${day}/${year}`
}

// Format Date -> 24 May 2024
export const formatDateWithLetterMonth = (dateString) => {
	if (!dateString) return ''

	const date = new Date(dateString)
	const options = {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}
	return date?.toLocaleDateString('en-GB', options)
}

// Format Date -> 24/05/2024
export const formatDateToDDMMYYYY = (dateString) => {
	if (!dateString) return ''

	const date = new Date(dateString)
	const day = String(date?.getDate()).padStart(2, '0')
	const month = String(date?.getMonth() + 1).padStart(2, '0')
	const year = date?.getFullYear()

	return `${day}/${month}/${year}`
}

// Format Date -> 05/24/2024
export const formatDateToMMDDYYYY = (dateString) => {
	if (!dateString) return ''

	const date = new Date(dateString)
	const day = String(date?.getDate()).padStart(2, '0')
	const month = String(date?.getMonth() + 1).padStart(2, '0')
	const year = date?.getFullYear()

	return `${month}/${day}/${year}`
}

// Format Date -> 2024-05-24
export const formatDateToSqlDate = (dateString) => {
	if (!dateString) return ''

	const date = new Date(dateString)
	const day = String(date?.getDate()).padStart(2, '0')
	const month = String(date?.getMonth() + 1).padStart(2, '0')
	const year = date?.getFullYear()

	return `${year}-${month}-${day}`
}

export const formatDateToDateTime = (dateString) => {
	if (!dateString) return ''

	const date = new Date(dateString)
	const day = String(date?.getDate()).padStart(2, '0')
	const month = String(date?.getMonth() + 1).padStart(2, '0')
	const year = date?.getFullYear()

	return `${year}-${month}-${day}T00:00:00`
}
