import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTable from '@/components/tables/GenericTable'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import useTranslation from '@/hooks/useTranslation'
import { Button, Paper, Stack, Typography } from '@mui/material'

const ManageDepartmentBasePage = ({
	headerTitleKey = 'department.title.department_management',
	totalDepartments = 0,
	totalPage = 0,
	departments = [],
	filters = { search: '' },
	setFilters,
	selectedRows,
	setSelectedRows,
	onFilterClick = () => {},
	onResetFilterClick = () => {},
	fields = [],
	sort,
	setSort,
	page,
	setPage,
	pageSize,
	setPageSize,
	loading = false,
	onCreateClick = () => {},
}) => {
	const { t } = useTranslation()

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Stack direction='row' alignItems='center' justifyContent='space-between'>
					<Typography variant='h5'>{t(headerTitleKey)}</Typography>
					<Typography variant='body2' sx={{ color: 'text.secondary' }}>
						[{t('department.text.total')}: {totalDepartments}]
					</Typography>
				</Stack>

				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					flexWrap='wrap'
					mb={2}
				>
					<Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
						<ValidationTextField
							variant='outlined'
							label={t('text.search')}
							size='small'
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							sx={{ flex: 1, minWidth: 160 }}
						/>
						<FilterButton onClick={onFilterClick}>{t('button.search')}</FilterButton>
						<ResetFilterButton loading={loading} onResetFilterClick={onResetFilterClick}>
							{t('button.reset')}
						</ResetFilterButton>
					</Stack>

					<Button variant='contained' color='success' onClick={onCreateClick} sx={{ minWidth: 120 }}>
						{t('button.create')}
					</Button>
				</Stack>

				<Stack spacing={2} sx={{ width: '100%' }}>
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

					<Stack justifyContent='center' px={2}>
						<GenericTablePagination
							totalPage={totalPage}
							page={page}
							setPage={setPage}
							pageSize={pageSize}
							setPageSize={(size) => {
								setPageSize(size)
								setPage(1)
							}}
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
