import MedicineFilterBar from '@/components/basePages/manageMedicineBasePage/sections/MedicineFilterBar'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import EmptyBox from '@/components/placeholders/EmptyBox'
import SkeletonBox from '@/components/skeletons/SkeletonBox'
import GenericTable from '@/components/tables/GenericTable'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'

const ManageMedicineBasePage = ({
	headerTitleKey = 'medicine.title.medicine_management',
	totalMedicines = 0,
	totalPage = 0,
	medicines = [],
	filters = { search: '', category: '', page: 1, pageSize: 5 },
	setFilters,
	selectedRows,
	setSelectedRows,
	onFilterClick = () => {},
	fields = [],
	sort,
	setSort,
	loading = false,
	categories = [],
	setOpenCreateDialog,
}) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					flexWrap='wrap'
					rowGap={1}
				>
					<Typography variant='h5'>{t(headerTitleKey)}</Typography>
					<Typography variant='body2' sx={{ color: 'text.secondary' }}>
						[{t('medicine.text.total')}: {totalMedicines}]
					</Typography>
				</Stack>

				<MedicineFilterBar
					filters={filters}
					setFilters={setFilters}
					onFilterClick={onFilterClick}
					loading={loading}
					categories={categories}
					medicineUnits={_enum.medicineUnitOptions}
					setOpenCreateDialog={setOpenCreateDialog}
				/>

				<Stack spacing={2} sx={{ width: '100%' }}>
					{loading ? (
						<SkeletonBox numberOfBoxes={3} heights={[268 / 3]} />
					) : medicines.length === 0 ? (
						<EmptyBox minHeight={300} text={t('medicine.text.no_data')} />
					) : (
						<GenericTable
							data={medicines}
							fields={fields}
							rowKey='id'
							sort={sort}
							setSort={setSort}
							selectedRows={selectedRows}
							setSelectedRows={setSelectedRows}
							stickyHeader
						/>
					)}

					<Stack justifyContent='center' px={2}>
						<GenericTablePagination
							totalPage={totalPage}
							page={filters.page}
							setPage={(page) => setFilters({ ...filters, page })}
							pageSize={filters.pageSize}
							setPageSize={(pageSize) => setFilters({ ...filters, pageSize, page: 1 })}
							pageSizeOptions={[5, 10, 20]}
							loading={loading}
						/>
					</Stack>
				</Stack>
			</Stack>
		</Paper>
	)
}

export default ManageMedicineBasePage
