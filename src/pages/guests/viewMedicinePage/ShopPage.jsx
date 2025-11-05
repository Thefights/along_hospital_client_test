import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, Pagination, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MedicineCard from './sections/MedicineCardSection'
import ShopFilters from './sections/ShopFiltersSection'

export default function ShopPage() {
	const navigate = useNavigate()
	const { t } = useTranslation()
	const [filters, setFilters] = useState({
		name: '',
		medicineCategoryId: '',
		medicineUnit: '',
		page: 1,
		pageSize: 12,
	})

	const getAllMedicines = useFetch(ApiUrls.MEDICINE.INDEX, filters, [filters])
	const getAllCategories = useFetch(ApiUrls.MEDICINE_CATEGORY.GET_ALL)

	const handlePageChange = (_, page) => {
		setFilters((prev) => ({ ...prev, page }))
	}

	const handleFilterChange = (newFilters) => {
		setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
	}

	const handleResetFilters = () => {
		setFilters({
			name: '',
			medicineCategoryId: '',
			medicineUnit: '',
			page: 1,
			pageSize: 12,
		})
	}

	const handleClickMedicine = (id) => {
		navigate(routeUrls.HOME.MEDICINE_DETAIL(id))
	}

	const medicines = getAllMedicines.data?.collection || []
	const totalPages = Math.ceil((getAllMedicines.data?.totalCount || 0) / filters.pageSize)
	const categories = getAllCategories.data || []

	return (
		<Box py={4}>
			<Typography variant='h4' sx={{ mb: 3 }}>
				{t('shop.title')}
			</Typography>

			<Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
				{/* Sidebar */}
				<Box sx={{ width: '25%', position: 'sticky', top: 96, alignSelf: 'flex-start' }}>
					<ShopFilters
						filters={filters}
						categories={categories}
						loading={getAllMedicines.loading}
						onFilterChange={handleFilterChange}
						onResetClick={handleResetFilters}
					/>
				</Box>

				{/* Medicines Grid */}
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
									flexBasis: 'calc((100% - 48px) / 3)', // 3 items fixed per row, 24px gap
									flexGrow: 0,
									flexShrink: 0,
									cursor: 'pointer',
								}}
								onClick={() => handleClickMedicine(medicine.id)}
							>
								<MedicineCard medicine={medicine} />
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
