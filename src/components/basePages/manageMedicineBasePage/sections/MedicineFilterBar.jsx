import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import SearchBar from '@/components/generals/SearchBar'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import useTranslation from '@/hooks/useTranslation'
import { Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'

export default function MedicineFilterBar({
	filters,
	setFilters,
	categories = [],
	medicineUnits = [],
	onFilterClick = () => {},
	loading = false,
	setOpenCreateDialog,
}) {
	const { t } = useTranslation()
	const [localFilters, setLocalFilters] = useState(filters)

	return (
		<Stack
			spacing={1.5}
			sx={{
				py: 1,
				px: 2,
				bgcolor: 'background.paper',
				border: (theme) => `1px solid ${theme.palette.divider}`,
				borderRadius: 1,
			}}
		>
			<Typography variant='caption'>{t('medicine.filter.title') || 'Bộ lọc thuốc'}</Typography>

			<Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap'>
				<ValidationTextField
					label={t('medicine.filter.category') || 'Loại thuốc'}
					value={localFilters?.medicinecategoryId || ''}
					size='small'
					type='select'
					required={false}
					fullWidth
					sx={{ flex: 1, minWidth: 120 }}
					onChange={(e) => setLocalFilters({ ...localFilters, medicinecategoryId: e.target.value })}
					options={[
						{ value: '', label: t('text.all') || 'Tất cả' },
						...(categories?.map((c) => ({ value: c.value, label: c.label })) || []),
					]}
				/>

				<ValidationTextField
					label={t('medicine.filter.unit') || 'Đơn vị'}
					value={localFilters?.medicineUnit || ''}
					size='small'
					type='select'
					required={false}
					fullWidth
					sx={{ flex: 1, minWidth: 120 }}
					onChange={(e) => setLocalFilters({ ...localFilters, medicineUnit: e.target.value })}
					options={[
						{ value: '', label: t('text.all') || 'Tất cả' },
						...(medicineUnits?.map((u) => ({ value: u.value, label: u.label })) || []),
					]}
				/>
			</Stack>

			<Stack direction='row' spacing={1}>
				<SearchBar
					placeholder={t('medicine.filter.searchPlaceholder') || 'Tìm theo tên thuốc...'}
					value={localFilters?.name || ''}
					setValue={(searchTerm) => setLocalFilters({ ...localFilters, name: searchTerm })}
					widthPercent={70}
				/>
				<FilterButton
					onFilterClick={() => {
						setFilters(localFilters)
						onFilterClick()
					}}
					loading={loading}
					sx={{ flexGrow: 1 }}
				/>
				<ResetFilterButton
					loading={loading}
					onResetFilterClick={() => {
						const reset = { name: '', medicinecategoryId: '', medicineUnit: '', page: 1, pageSize: 10 }
						setLocalFilters(reset)
						setFilters(reset)
						onFilterClick()
					}}
				/>
				<Button variant='contained' color='success' onClick={() => setOpenCreateDialog(true)}>
					{t('button.create')}
				</Button>
			</Stack>
		</Stack>
	)
}
