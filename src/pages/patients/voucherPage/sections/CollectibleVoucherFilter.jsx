import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import SearchBar from '@/components/generals/SearchBar'
import useTranslation from '@/hooks/useTranslation'
import { FilterList } from '@mui/icons-material'
import { Box, Drawer, Stack, Typography, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const DRAWER_WIDTH = 280

const CollectibleVoucherFilter = ({
	open = false,
	onClose,
	permanent = false,
	filters,
	onFilterChange,
	onReset,
}) => {
	const theme = useTheme()
	const { t } = useTranslation()
	const [localName, setLocalName] = useState(filters.name || '')

	useEffect(() => {
		setLocalName(filters.name || '')
	}, [filters.name])

	const handleApplyFilter = () => onFilterChange({ name: localName })

	const handleReset = () => {
		setLocalName('')
		onReset()
	}

	const filterContent = (
		<Stack spacing={3} sx={{ height: '100%' }}>
			<Stack direction='row' alignItems='center' justifyContent='space-between'>
				<Stack direction='row' alignItems='center' spacing={1}>
					<FilterList color='primary' />
					<Typography variant='h6' fontWeight={600}>
						{t('voucher.title.filters')}
					</Typography>
				</Stack>
			</Stack>

			<SearchBar
				value={localName}
				setValue={setLocalName}
				placeholder={t('voucher.placeholder.search_voucher')}
				fullWidth
			/>

			<Stack spacing={1.5} sx={{ mt: 'auto' }}>
				<FilterButton onFilterClick={handleApplyFilter} fullWidth />
				<ResetFilterButton onResetFilterClick={handleReset} fullWidth />
			</Stack>
		</Stack>
	)

	if (permanent) {
		return (
			<Box
				sx={{
					width: { xs: '100%', md: DRAWER_WIDTH },
					flexShrink: 0,
					bgcolor: 'background.paper',
					borderRadius: 2,
					p: 3,
					border: `1px solid ${theme.palette.divider}`,
					height: 'fit-content',
					position: { xs: 'relative', md: 'sticky' },
					top: { xs: 0, md: 16 },
				}}
			>
				{filterContent}
			</Box>
		)
	}

	return (
		<Drawer
			anchor='left'
			open={open}
			onClose={onClose}
			sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, p: 3 } }}
		>
			{filterContent}
		</Drawer>
	)
}

CollectibleVoucherFilter.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	permanent: PropTypes.bool,
	filters: PropTypes.shape({
		name: PropTypes.string,
	}).isRequired,
	onFilterChange: PropTypes.func.isRequired,
	onReset: PropTypes.func.isRequired,
}

export default CollectibleVoucherFilter
