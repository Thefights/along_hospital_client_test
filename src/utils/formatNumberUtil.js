export const formatNumberWithCommas = (number) =>
	number
		? number
				.toString()
				.replace(/^0+/, '')
				.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0'
		: '0'

export const formatNumberToTime = (number) => {
	if (isNaN(number) || number < 0) return '0'

	const hours = Math.floor(number)
	const minutes = Math.round((number - hours) * 60)

	return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`
}
