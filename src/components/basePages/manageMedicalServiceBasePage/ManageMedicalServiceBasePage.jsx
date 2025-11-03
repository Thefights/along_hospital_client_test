import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import EmptyBox from '@/components/placeholders/EmptyBox'
import SkeletonBox from '@/components/skeletons/SkeletonBox'
import GenericTable from '@/components/tables/GenericTable'
import ValidationTextField from '@/components/textFields/ValidationTextField'
import useTranslation from '@/hooks/useTranslation'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const ManageMedicalServiceBasePage = ({
	headerTitleKey = 'medical_service.title.management',
	totalMedicalServices = 0,
	totalPage = 0,
	medicalServices = [],
	filters = { name: '', page: 1, pageSize: 10 },
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
	const [localName, setLocalName] = useState(filters.name || '')

	useEffect(() => {
		setLocalName(filters.name || '')
	}, [filters.name])

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
						[{t('medical_service.text.total')}: {totalMedicalServices}]
					</Typography>
				</Stack>

				<Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
					<ValidationTextField
						variant='outlined'
						label={t('text.search')}
						size='small'
						required={false}
						value={localName}
						onChange={(e) => setLocalName(e.target.value)}
						sx={{ flex: 1, minWidth: 160 }}
					/>
					<FilterButton
						variant='contained'
						onClick={() => {
							setFilters({ ...filters, name: localName, page: 1 })
							onFilterClick()
						}}
					>
						{t('button.search')}
					</FilterButton>
					<ResetFilterButton
						loading={loading}
						onResetFilterClick={() => {
							setLocalName('')
							const reset = { name: '', page: 1, pageSize: filters.pageSize }
							setFilters(reset)
							onFilterClick()
						}}
					>
						{t('button.reset')}
					</ResetFilterButton>
					<Button variant='contained' color='success' onClick={onCreateClick} sx={{ minWidth: 120 }}>
						{t('button.create')}
					</Button>
				</Stack>

				<Stack spacing={2} sx={{ width: '100%' }}>
					{loading ? (
						<SkeletonBox numberOfBoxes={3} heights={[268 / 3]} />
					) : medicalServices.length === 0 ? (
						<EmptyBox minHeight={300} text={t('medical_service.text.no_data')} />
					) : (
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

export default ManageMedicalServiceBasePage
