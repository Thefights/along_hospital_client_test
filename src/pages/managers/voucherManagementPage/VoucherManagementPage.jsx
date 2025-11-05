import { GenericTablePagination } from '@/components/generals/GenericPagination'
import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import VoucherManagementFilterSection from './sections/VoucherManagementFilterSection'
import VoucherManagementTable from './sections/VoucherManagementTable'

const VoucherManagementPage = () => {
	const [filters, setFilters] = useState({
		name: '',
		voucherStatus: '',
		voucherType: '',
	})
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const { t } = useTranslation()

	const getVouchers = useFetch(ApiUrls.VOUCHER.MANAGEMENT.INDEX, { ...filters, page, pageSize }, [
		filters,
		page, // tach cai nay ra
		pageSize,
	])

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('voucher.title.voucher_management')}</Typography>
				<VoucherManagementFilterSection
					filters={filters}
					setFilters={setFilters}
					loading={getVouchers.loading}
				/>
				<VoucherManagementTable
					vouchers={getVouchers.data?.collection}
					loading={getVouchers.loading}
					refetch={getVouchers.fetch}
				/>
				<GenericTablePagination
					totalPage={getVouchers.data?.totalPage}
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					loading={getVouchers.loading}
				/>
			</Stack>
		</Paper>
	)
}

export default VoucherManagementPage
