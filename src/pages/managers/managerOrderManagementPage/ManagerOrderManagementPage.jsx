import ActionMenu from '@/components/generals/ActionMenu'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import SearchBar from '@/components/generals/SearchBar'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { formatCurrencyBasedOnCurrentLanguage } from '@/utils/formatNumberUtil'
import { VisibilityRounded } from '@mui/icons-material'
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Paper,
	Stack,
	Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

const ManagerOrderManagementPage = () => {
	const { t } = useTranslation()

	const [sort, setSort] = useState({ key: 'orderDate', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [search, setSearch] = useState('')
	const [selectedOrder, setSelectedOrder] = useState(null)
	const [openDetail, setOpenDetail] = useState(false)

	const handleCloseDetail = () => {
		setOpenDetail(false)
		setSelectedOrder(null)
	}

	const sortParam = useMemo(() => `${sort.key ?? 'orderDate'} ${sort.direction ?? 'desc'}`, [sort])

	const fetchParams = useMemo(() => {
		const trimmedSearch = search.trim()
		return {
			page,
			pageSize,
			sort: sortParam,
			...(trimmedSearch ? { keyword: trimmedSearch } : {}),
		}
	}, [page, pageSize, sortParam, search])

	const { loading, data } = useFetch(ApiUrls.ORDER.MANAGEMENT.INDEX, fetchParams, [fetchParams])

	const orders = useMemo(() => (Array.isArray(data?.collection) ? data.collection : []), [data])

	const totalPage = data?.totalPage ?? 1

	const tableFields = useMemo(
		() => [
			{ key: 'id', title: t('order.field.id'), width: 10, sortable: true, fixedColumn: true },
			{
				key: 'orderDate',
				title: t('order.field.order_date'),
				width: 18,
				sortable: true,
				render: (value) => (value ? new Date(value).toLocaleString() : t('order.text.unknown')),
			},
			{
				key: 'deliveryDate',
				title: t('order.field.delivery_date'),
				width: 18,
				sortable: true,
				render: (value) => (value ? new Date(value).toLocaleString() : t('order.text.unknown')),
			},
			{
				key: 'orderStatus',
				title: t('order.field.status'),
				width: 14,
				sortable: true,
				render: (value) => value || t('order.text.unknown'),
			},
			{
				key: 'voucherCode',
				title: t('order.field.voucher'),
				width: 12,
				sortable: false,
				render: (value) => value || '-',
			},
			{
				key: 'finalPrice',
				title: t('order.field.final_price'),
				width: 15,
				isNumeric: true,
				sortable: true,
				render: (value) => formatCurrencyBasedOnCurrentLanguage(Number(value ?? 0)),
			},
			{
				key: 'transactionId',
				title: t('order.field.transaction_id'),
				width: 15,
				sortable: false,
				render: (value) => value || '-',
			},
			{
				key: '',
				title: '',
				width: 6,
				render: (_value, row) => (
					<ActionMenu
						actions={[
							{
								title: t('button.view_detail'),
								icon: <VisibilityRounded fontSize='small' />,
								onClick: () => {
									setSelectedOrder(row)
									setOpenDetail(true)
								},
							},
						]}
					/>
				),
			},
		],
		[t]
	)

	const detailItems = selectedOrder?.orderDetails ?? []

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('order.title.order_management')}</Typography>
				<Stack direction='row' justifyContent='space-between' alignItems='center'>
					<SearchBar widthPercent={30} value={search} setValue={setSearch} />
				</Stack>
				<GenericTable
					data={orders}
					fields={tableFields}
					sort={sort}
					setSort={setSort}
					rowKey='id'
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

			<Dialog maxWidth='md' fullWidth open={openDetail} onClose={handleCloseDetail}>
				<DialogTitle>{t('order.title.detail')}</DialogTitle>
				<DialogContent dividers>
					{selectedOrder ? (
						<Stack spacing={2}>
							<Box>
								<Typography variant='subtitle1' fontWeight={600} gutterBottom>
									{t('order.text.order_summary')}
								</Typography>
								<Stack spacing={1}>
									<Typography variant='body2'>
										{t('order.field.id')}: {selectedOrder.id}
									</Typography>
									<Typography variant='body2'>
										{t('order.field.order_date')}:{' '}
										{selectedOrder.orderDate
											? new Date(selectedOrder.orderDate).toLocaleString()
											: t('order.text.unknown')}
									</Typography>
									<Typography variant='body2'>
										{t('order.field.delivery_date')}:{' '}
										{selectedOrder.deliveryDate
											? new Date(selectedOrder.deliveryDate).toLocaleString()
											: t('order.text.unknown')}
									</Typography>
									<Typography variant='body2'>
										{t('order.field.status')}: {selectedOrder.orderStatus || t('order.text.unknown')}
									</Typography>
									<Typography variant='body2'>
										{t('order.field.voucher')}: {selectedOrder.voucherCode || '-'}
									</Typography>
									<Typography variant='body2'>
										{t('order.field.origin_price')}:{' '}
										{formatCurrencyBasedOnCurrentLanguage(Number(selectedOrder.originPrice ?? 0))}
									</Typography>
									<Typography variant='body2'>
										{t('order.field.total_discount')}:{' '}
										{formatCurrencyBasedOnCurrentLanguage(Number(selectedOrder.totalDiscountAmount ?? 0))}
									</Typography>
									<Typography variant='body2'>
										{t('order.field.final_price')}:{' '}
										{formatCurrencyBasedOnCurrentLanguage(Number(selectedOrder.finalPrice ?? 0))}
									</Typography>
									<Typography variant='body2'>
										{t('order.field.transaction_id')}: {selectedOrder.transactionId || '-'}
									</Typography>
								</Stack>
							</Box>
							<Divider />
							<Box>
								<Typography variant='subtitle1' fontWeight={600} gutterBottom>
									{t('order.text.order_details')}
								</Typography>
								{detailItems.length ? (
									<Stack spacing={1}>
										{detailItems.map((item) => (
											<Paper key={`${item.medicineId}-${item.unitPrice}`} variant='outlined' sx={{ p: 1.5 }}>
												<Typography variant='subtitle2' fontWeight={600}>
													{item.medicineName || t('order.text.unknown')}
												</Typography>
												<Typography variant='body2'>
													{t('order.field.medicine_brand')}: {item.medicineBrand || '-'}
												</Typography>
												<Typography variant='body2'>
													{t('order.field.medicine_unit')}: {item.medicineUnit || '-'}
												</Typography>
												<Typography variant='body2'>
													{t('order.field.quantity')}: {item.quantity}
												</Typography>
												<Typography variant='body2'>
													{t('order.field.unit_price')}:{' '}
													{formatCurrencyBasedOnCurrentLanguage(Number(item.unitPrice ?? 0))}
												</Typography>
												<Typography variant='body2'>
													{t('order.field.discount_amount')}:{' '}
													{formatCurrencyBasedOnCurrentLanguage(Number(item.discountAmount ?? 0))}
												</Typography>
											</Paper>
										))}
									</Stack>
								) : (
									<Typography variant='body2'>{t('order.text.no_orders')}</Typography>
								)}
							</Box>
						</Stack>
					) : (
						<Typography variant='body2'>{t('order.text.no_orders')}</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDetail}>{t('button.close')}</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	)
}

export default ManagerOrderManagementPage
