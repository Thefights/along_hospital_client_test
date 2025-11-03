import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTable from '@/components/tables/GenericTable'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import useTranslation from '@/hooks/useTranslation'
import { Button, Paper, Stack, Typography } from '@mui/material'

const ManageMedicalServiceBasePage = ({
	headerTitleKey = 'medical_service.title.management',
	medicalServices = [],
	totalMedicalServices = 0,
	totalPage = 0,
	filters = { name: '' },
	setFilters,
	selectedRows = [],
	setSelectedRows,
	onFilterClick = () => {},
	onResetFilterClick = () => {},
	fields = [],
	sort,
	setSort,
	page = 1,
	setPage,
	pageSize = 10,
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
						[{t('medical_service.text.total')}: {totalMedicalServices}]
					</Typography>
				</Stack>

				<Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
					<ValidationTextField
						variant='outlined'
						label={t('text.search')}
						size='small'
						value={filters.name || ''}
						onChange={(e) => setFilters({ ...filters, name: e.target.value })}
						sx={{ flex: 1, minWidth: 160 }}
					/>
					<FilterButton
						onClick={() => {
							setPage(1)
							onFilterClick()
						}}
					>
						{t('button.search')}
					</FilterButton>
					<ResetFilterButton
						loading={loading}
						onResetFilterClick={() => {
							setPage(1)
							onResetFilterClick()
						}}
					>
						{t('button.reset')}
					</ResetFilterButton>
					<Button variant='contained' color='success' onClick={onCreateClick} sx={{ minWidth: 120 }}>
						{t('button.create')}
					</Button>
				</Stack>

				<Stack spacing={2} sx={{ width: '100%' }}>
					<GenericTable
						data={medicalServices}
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

export default ManageMedicalServiceBasePage
