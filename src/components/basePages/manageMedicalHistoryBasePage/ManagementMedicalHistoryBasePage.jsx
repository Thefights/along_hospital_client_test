/* eslint-disable no-unused-vars */
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import ManagementMedicalHistoryCardSection from './sections/ManagementMedicalHistoryCardSection'
import ManagementMedicalHistoryDetailDrawerSection from './sections/ManagementMedicalHistoryDetailDrawerSection'
import ManagementMedicalHistoryFilterSection from './sections/ManagementMedicalHistoryFilterSection'

const ManagementMedicalHistoryBasePage = ({
	items,
	loading,
	patientNames,
	doctorNames,
	totalPage,
	filters,
	setFilters,
	page,
	setPage,
	pageSize,
	setPageSize,
	selectedItem,
	setSelectedItem,
}) => {
	const [drawerOpen, setDrawerOpen] = useState(false)

	const { t } = useTranslation()

	const handleOpenDrawer = (item) => {
		setSelectedItem(item)
		setDrawerOpen(true)
	}

	return (
		<Paper sx={{ p: 2, my: 2, bgcolor: 'background.paper' }}>
			<Stack spacing={4}>
				<Typography variant='h6'>{t('medical_history.title.medical_history_management')}</Typography>
				<ManagementMedicalHistoryFilterSection
					filters={filters}
					setFilters={setFilters}
					loading={loading}
					patientNames={patientNames}
					doctorNames={doctorNames}
				/>
				<ManagementMedicalHistoryCardSection
					items={items}
					onOpen={handleOpenDrawer}
					loading={loading}
				/>
				<GenericTablePagination
					totalPage={totalPage}
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					loading={loading}
				/>
			</Stack>
			<ManagementMedicalHistoryDetailDrawerSection
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				item={selectedItem}
			/>
		</Paper>
	)
}

export default ManagementMedicalHistoryBasePage
