import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
import SearchBar from '@/components/generals/SearchBar'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useEnum from '@/hooks/useEnum'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { formatDatetimeStringBasedOnCurrentLanguage } from '@/utils/formatDateUtil'
import { formatCurrencyBasedOnCurrentLanguage } from '@/utils/formatNumberUtil'
import { VisibilityRounded } from '@mui/icons-material'
import { Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import OrderManagementFilterSection from './sections/ManagerOrderManagementFilterBarSection'

const ManagerOrderManagementPage = () => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const [sort, setSort] = useState({ key: 'orderDate', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [search, setSearch] = useState('')
	const [filters, setFilters] = useState({ orderStatus: '', orderDate: '', deliveryDate: '' })
	const [selectedOrder, setSelectedOrder] = useState(null)
	const [openDetail, setOpenDetail] = useState(false)

	const handleCloseDetail = () => {
		setOpenDetail(false)
		setSelectedOrder(null)
	}

	const sortParam = useMemo(() => `${sort.key} ${sort.direction}`, [sort])

	const normalizedFilters = useMemo(() => {
		const next = {}
		if (filters.orderStatus) next.OrderStatus = filters.orderStatus
		if (filters.orderDate) next.OrderDate = filters.orderDate
		if (filters.deliveryDate) next.DeliveryDate = filters.deliveryDate
		return next
	}, [filters])

	const fetchParams = useMemo(
		() => ({
			page,
			pageSize,
			sort: sortParam,
			...(search.trim() ? { keyword: search.trim() } : {}),
			...normalizedFilters,
		}),
		[page, pageSize, sortParam, search, normalizedFilters]
	)

	const {
		loading,
		data,
		fetch: refetch,
	} = useFetch(ApiUrls.ORDER.MANAGEMENT.INDEX, fetchParams, [fetchParams])

	const orders = useMemo(() => (Array.isArray(data?.collection) ? data.collection : []), [data])
	const totalPage = data?.totalPage ?? 1

	const statusOptions = useMemo(() => {
		const uniqueStatuses = new Set()
		orders.forEach((o) => o?.orderStatus && uniqueStatuses.add(o.orderStatus))
		if (filters.status) uniqueStatuses.add(filters.status)
		return Array.from(uniqueStatuses)
			.sort((a, b) => String(a).localeCompare(String(b)))
			.map((s) => ({ value: s, label: s }))
	}, [orders, filters.status])

	const handleFilterChange = (next) => {
		setFilters({
			orderStatus: next?.orderStatus ?? '',
			orderDate: next?.orderDate ?? '',
			deliveryDate: next?.deliveryDate ?? '',
		})
		setPage(1)
	}

	const handleSearchChange = (val) => {
		setSearch(val)
		setPage(1)
	}

	const shippingSubmit = useAxiosSubmit({
		url: ApiUrls.ORDER.MANAGEMENT.SHIPPING(':id'),
		method: 'POST',
	})
	const completeSubmit = useAxiosSubmit({
		url: ApiUrls.ORDER.MANAGEMENT.COMPLETE(':id'),
		method: 'POST',
	})

	const tableFields = useMemo(
		() => [
			{
				key: 'id',
				title: t('order_management.field.id'),
				width: 10,
				sortable: true,
				fixedColumn: true,
			},
			{
				key: 'orderDate',
				title: t('order_management.field.order_date'),
				width: 18,
				sortable: true,
				render: (v) =>
					v ? formatDatetimeStringBasedOnCurrentLanguage(v) : t('order_management.text.unknown'),
			},
			{
				key: 'deliveryDate',
				title: t('order_management.field.delivery_date'),
				width: 18,
				sortable: true,
				render: (v) =>
					v ? formatDatetimeStringBasedOnCurrentLanguage(v) : t('order_management.text.unknown'),
			},
			{
				key: 'orderStatus',
				title: t('order_management.field.status'),
				width: 14,
				sortable: true,
				render: (v) => v || t('order_management.text.unknown'),
			},
			{
				key: 'voucherCode',
				title: t('order_management.field.voucher'),
				width: 12,
				sortable: false,
				render: (v) => v || '-',
			},
			{
				key: 'finalPrice',
				title: t('order_management.field.final_price'),
				width: 15,
				isNumeric: true,
				sortable: true,
				render: (v) => formatCurrencyBasedOnCurrentLanguage(Number(v ?? 0)),
			},
			{
				key: 'transactionId',
				title: t('order_management.field.transaction_id'),
				width: 15,
				sortable: false,
				render: (v) => v || '-',
			},
			{
				key: '',
				title: '',
				width: 6,
				render: (_v, row) => (
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

	const orderDetailFields = useMemo(() => {
		if (!selectedOrder) return []
		return [
			{ key: 'id', title: t('order_management.field.id'), readOnly: true },
			{
				key: 'orderDate',
				title: t('order_management.field.order_date'),
				readOnly: true,
				render: (v) => formatDatetimeStringBasedOnCurrentLanguage(v),
			},
			{
				key: 'deliveryDate',
				title: t('order_management.field.delivery_date'),
				readOnly: true,
				render: (v) => formatDatetimeStringBasedOnCurrentLanguage(v),
			},
			{
				key: 'orderStatus',
				title: t('order_management.field.status'),
				readOnly: true,
				type: 'select',
				options: _enum.orderStatusOptions,
			},
			{
				key: 'voucherCode',
				title: t('order_management.field.voucher'),
				readOnly: true,
				render: (v) => v || '-',
			},
			{
				key: 'originPrice',
				title: t('order_management.field.origin_price'),
				readOnly: true,
				render: (v) => formatCurrencyBasedOnCurrentLanguage(Number(v ?? 0)),
			},
			{
				key: 'totalDiscountAmount',
				title: t('order_management.field.total_discount'),
				readOnly: true,
				render: (v) => formatCurrencyBasedOnCurrentLanguage(Number(v ?? 0)),
			},
			{
				key: 'finalPrice',
				title: t('order_management.field.final_price'),
				readOnly: true,
				render: (v) => formatCurrencyBasedOnCurrentLanguage(Number(v ?? 0)),
			},
			{ key: 'transactionId', title: t('order_management.field.transaction_id'), readOnly: true },
			{
				key: 'orderDetails',
				title: t('order_management.text.order_details'),
				type: 'array',
				readOnly: true,
				of: [
					{ key: 'medicineName', title: t('order_management.field.medicine_name'), readOnly: true },
					{ key: 'medicineBrand', title: t('order_management.field.medicine_brand'), readOnly: true },
					{ key: 'medicineUnit', title: t('order_management.field.medicine_unit'), readOnly: true },
					{ key: 'quantity', title: t('order_management.field.quantity'), readOnly: true },
					{
						key: 'unitPrice',
						title: t('order_management.field.unit_price'),
						readOnly: true,
						render: (v) => formatCurrencyBasedOnCurrentLanguage(Number(v ?? 0)),
					},
					{
						key: 'discountAmount',
						title: t('order_management.field.discount_amount'),
						readOnly: true,
						render: (v) => formatCurrencyBasedOnCurrentLanguage(Number(v ?? 0)),
					},
				],
			},
		]
	}, [selectedOrder, t, _enum])

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('order_management.title.order_management')}</Typography>
				<SearchBar widthPercent={30} value={search} setValue={handleSearchChange} />
				<OrderManagementFilterSection
					filters={filters}
					setFilters={handleFilterChange}
					loading={loading}
					statusOptions={statusOptions}
				/>
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

			{selectedOrder && (
				<GenericFormDialog
					open={openDetail}
					onClose={handleCloseDetail}
					title={t('order_management.title.detail')}
					fields={orderDetailFields}
					initialValues={selectedOrder}
					submitLabel={t('button.close')}
					submitButtonColor='primary'
					onSubmit={({ closeDialog }) => closeDialog()}
					additionalButtons={[
						...(selectedOrder.orderStatus === 'Processing'
							? [
									{
										label: t('order_management.button.shipping'),
										color: 'info',
										variant: 'contained',
										onClick: async ({ values }) => {
											await shippingSubmit.submit(null, {
												overrideUrl: ApiUrls.ORDER.MANAGEMENT.SHIPPING(values.id),
											})
											await refetch()
											handleCloseDetail()
										},
									},
							  ]
							: []),
						...(selectedOrder.orderStatus === 'Shipping'
							? [
									{
										label: t('order_management.button.complete'),
										color: 'success',
										variant: 'contained',
										onClick: async ({ values }) => {
											await completeSubmit.submit(null, {
												overrideUrl: ApiUrls.ORDER.MANAGEMENT.COMPLETE(values.id),
											})
											await refetch()
											handleCloseDetail()
										},
									},
							  ]
							: []),
					]}
				/>
			)}
		</Paper>
	)
}

export default ManagerOrderManagementPage
