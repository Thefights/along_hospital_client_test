import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import ActionMenu from '@/components/generals/ActionMenu'
import { GenericTablePagination } from '@/components/generals/GenericPagination'
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
import ManagerOrderManagementFilterBarSection from './sections/ManagerOrderManagementFilterBarSection'

const ManagerOrderManagementPage = () => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const [sort, setSort] = useState({ key: 'orderDate', direction: 'desc' })
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [filters, setFilters] = useState({ orderStatus: '', orderDate: '', deliveryDate: '' })
	const [selectedOrder, setSelectedOrder] = useState(null)
	const [openDetail, setOpenDetail] = useState(false)

	const handleCloseDetail = () => {
		setOpenDetail(false)
		setSelectedOrder(null)
	}

	const fetchParams = useMemo(
		() => ({
			page,
			pageSize,
			sort: `${sort.key} ${sort.direction}`,
			...filters,
		}),
		[page, pageSize, sort, filters]
	)

	const {
		loading,
		data,
		fetch: refetch,
	} = useFetch(ApiUrls.ORDER.MANAGEMENT.INDEX, fetchParams, [fetchParams])
	const orders = useMemo(() => data?.collection || [], [data])
	const totalPage = data?.totalPage ?? 1

	const shippingSubmit = useAxiosSubmit({
		method: 'POST',
	})
	const completeSubmit = useAxiosSubmit({
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
				render: (v) => formatCurrencyBasedOnCurrentLanguage(v),
			},
			{
				key: 'transactionId',
				title: t('order_management.field.transaction_id'),
				width: 15,
				render: (v) => v || '-',
			},
			{
				key: '',
				title: '',
				width: 6,
				render: (_, row) => (
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
			{ key: 'id', title: t('order_management.field.id') },
			{
				key: 'orderDate',
				title: t('order_management.field.order_date'),
				render: (v) => formatDatetimeStringBasedOnCurrentLanguage(v),
			},
			{
				key: 'deliveryDate',
				title: t('order_management.field.delivery_date'),
				render: (v) => formatDatetimeStringBasedOnCurrentLanguage(v),
			},
			{
				key: 'orderStatus',
				title: t('order_management.field.status'),
				type: 'select',
				options: _enum.orderStatusOptions,
			},
			{
				key: 'voucherCode',
				title: t('order_management.field.voucher'),
				render: (v) => v || '-',
			},
			{
				key: 'originPrice',
				title: t('order_management.field.origin_price'),
				render: (v) => formatCurrencyBasedOnCurrentLanguage(v),
			},
			{
				key: 'totalDiscountAmount',
				title: t('order_management.field.total_discount'),
				render: (v) => formatCurrencyBasedOnCurrentLanguage(v),
			},
			{
				key: 'finalPrice',
				title: t('order_management.field.final_price'),
				render: (v) => formatCurrencyBasedOnCurrentLanguage(v),
			},
			{ key: 'transactionId', title: t('order_management.field.transaction_id') },
			{
				key: 'orderDetails',
				title: t('order_management.text.order_details'),
				type: 'array',
				readOnly: true,
				of: [
					{ key: 'medicineName', title: t('order_management.field.medicine_name') },
					{ key: 'medicineBrand', title: t('order_management.field.medicine_brand') },
					{ key: 'medicineUnit', title: t('order_management.field.medicine_unit') },
					{ key: 'quantity', title: t('order_management.field.quantity') },
					{
						key: 'unitPrice',
						title: t('order_management.field.unit_price'),
						render: (v) => formatCurrencyBasedOnCurrentLanguage(v),
					},
					{
						key: 'discountAmount',
						title: t('order_management.field.discount_amount'),
						render: (v) => formatCurrencyBasedOnCurrentLanguage(v),
					},
				],
			},
		]
	}, [selectedOrder, t, _enum])

	return (
		<Paper size={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('order_management.title.order_management')}</Typography>
				<ManagerOrderManagementFilterBarSection
					filters={filters}
					setFilters={(values) => {
						setFilters(values)
						setPage(1)
					}}
					loading={loading}
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
					fields={orderDetailFields.map((field) => ({
						...field,
						props: { readOnly: true },
					}))}
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
											var reponse = await shippingSubmit.submit(null, {
												overrideUrl: ApiUrls.ORDER.MANAGEMENT.SHIPPING(values.id),
											})
											if (reponse) {
												await refetch()
												handleCloseDetail()
											}
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
											var reponse = await completeSubmit.submit(null, {
												overrideUrl: ApiUrls.ORDER.MANAGEMENT.COMPLETE(values.id),
											})
											if (reponse) {
												await refetch()
												handleCloseDetail()
											}
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
