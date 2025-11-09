import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import { default as useReduxStore } from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setMedicineCategoriesStore } from '@/redux/reducers/managementReducer'
import { Box, Pagination, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { default as MedicineCardSection } from './sections/MedicineCardSection'
import ShopFilters from './sections/ShopFiltersSection'

export default function ShopPage() {
	const { t } = useTranslation()
	const [filters, setFilters] = useState({
		name: '',
		medicineCategoryId: '',
		medicineUnit: '',
		page: 1,
		pageSize: 12,
	})

	const getAllMedicines = useFetch(ApiUrls.MEDICINE.INDEX, filters, [filters])

	const {
		data: categories,
		loading: loadingCategories,
		fetch: fetchCategories,
	} = useReduxStore({
		selector: (state) => state.management.medicineCategories,
		setStore: setMedicineCategoriesStore,
	})

	useEffect(() => {
		fetchCategories()
	}, [fetchCategories])

	const handlePageChange = (_, page) => {
		setFilters((prev) => ({ ...prev, page }))
	}

	const handleFilterClick = (newFilters) => {
		setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
	}

	const handleResetFilterClick = () => {
		setFilters({
			name: '',
			medicineCategoryId: '',
			medicineUnit: '',
			page: 1,
			pageSize: 12,
		})
	}

	const medicines = getAllMedicines.data?.collection || []
	const totalPages = getAllMedicines.totalPages

	return (
		<Box py={4}>
			<Typography variant='h4' sx={{ mb: 3 }}>
				{t('shop.title')}
			</Typography>

			<Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
				<Box sx={{ width: '25%', position: 'sticky', top: 96, alignSelf: 'flex-start' }}>
					<ShopFilters
						filters={filters}
						categories={categories || []}
						loading={getAllMedicines.loading || loadingCategories}
						onFilterClick={handleFilterClick}
						onResetFilterClick={handleResetFilterClick}
					/>
				</Box>

				<Box sx={{ width: '75%' }}>
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: 3,
						}}
					>
						{medicines.map((medicine) => (
							<Box
								key={medicine.id}
								sx={{
									flexBasis: 250,
									flexGrow: 0,
									flexShrink: 0,
									cursor: 'pointer',
								}}
							>
								<MedicineCardSection medicine={medicine} />
							</Box>
						))}

						{!getAllMedicines.loading && medicines.length === 0 && (
							<Box
								sx={{
									p: 3,
									textAlign: 'center',
									bgcolor: 'background.paper',
									borderRadius: 1,
									width: '100%',
								}}
							>
								<Typography color='text.secondary'>{t('shop.text.no_products')}</Typography>
							</Box>
						)}
					</Box>

					{totalPages > 1 && (
						<Stack alignItems='center' sx={{ mt: 4 }}>
							<Pagination
								page={filters.page}
								count={totalPages}
								onChange={handlePageChange}
								disabled={getAllMedicines.loading}
							/>
						</Stack>
					)}
				</Box>
			</Box>
		</Box>
	)
}
