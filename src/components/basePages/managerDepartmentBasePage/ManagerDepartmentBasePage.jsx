import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import EmptyBox from '@/components/placeholders/EmptyBox'
import SkeletonBox from '@/components/skeletons/SkeletonBox'
import GenericTable from '@/components/tables/GenericTable'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import useTranslation from '@/hooks/useTranslation'
import { Button, Paper, Stack, Typography } from '@mui/material'

const ManageDepartmentBasePage = ({
	headerTitleKey = 'department.title.department_management',
	totalDepartments = 0,
	totalPage = 0,
	departments = [],
	filters = { search: '', page: 1, pageSize: 10 },
	setFilters,
	selectedRows,
	setSelectedRows,
	onFilterClick = () => {},
	fields = [],
	sort,
	setSort,
	loading = false,
	onCreateClick = () => {},
}) => {
	const { t } = useTranslation()

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
						[{t('department.text.total')}: {totalDepartments}]
					</Typography>
				</Stack>

				<Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
					<ValidationTextField
						variant='outlined'
						label={t('text.search')}
						size='small'
						required={false}
						value={filters.name}
						onChange={(e) => setFilters({ ...filters, name: e.target.value })}
						sx={{ flex: 1, minWidth: 160 }}
					/>
					<FilterButton variant='contained' onClick={onFilterClick}>
						{t('button.search')}
					</FilterButton>
					<ResetFilterButton
						loading={loading}
						onResetFilterClick={() => {
							const reset = { search: '', page: 1, pageSize: 10 }
							setFilters(reset)
							onFilterClick()
						}}
					>
						{t('medicine_category.button.reset')}
					</ResetFilterButton>
					<Button variant='contained' color='success' onClick={onCreateClick} sx={{ minWidth: 120 }}>
						{t('button.create')}
					</Button>
				</Stack>

				<Stack spacing={2} sx={{ width: '100%' }}>
					{loading ? (
						<SkeletonBox numberOfBoxes={3} heights={[268 / 3]} />
					) : departments.length === 0 ? (
						<EmptyBox minHeight={300} text={t('department.text.no_data')} />
					) : (
						<GenericTable
							data={departments}
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

export default ManageDepartmentBasePage
