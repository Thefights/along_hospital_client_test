import useTranslation from '@/hooks/useTranslation'
import { Button, Paper, Stack } from '@mui/material'

const FilterSection = ({ selected, counts, onChange }) => {
	const { t } = useTranslation()
	const allCount = Object.values(counts || {}).reduce((a, b) => a + (b || 0), 0)

	const options = [
		{ label: t('feedback.filter.all'), value: null, count: allCount },
		{ label: '5 ⭐', value: 5, count: counts?.[5] || 0 },
		{ label: '4 ⭐', value: 4, count: counts?.[4] || 0 },
		{ label: '3 ⭐', value: 3, count: counts?.[3] || 0 },
		{ label: '2 ⭐', value: 2, count: counts?.[2] || 0 },
		{ label: '1 ⭐', value: 1, count: counts?.[1] || 0 },
	]

	return (
		<Paper sx={{ p: 2, borderRadius: 2 }}>
			<Stack direction='row' useFlexGap gap={1} flexWrap='wrap'>
				{options.map((opt) => (
					<Button
						key={String(opt.value)}
						variant={selected === opt.value ? 'contained' : 'outlined'}
						size='small'
						onClick={() => onChange(opt.value)}
					>
						{opt.label} ({opt.count})
					</Button>
				))}
			</Stack>
		</Paper>
	)
}

export default FilterSection
