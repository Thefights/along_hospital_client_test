/* eslint-disable react-hooks/exhaustive-deps */
import ActionMenu from '@/components/generals/ActionMenu'
import GenericTable from '@/components/tables/GenericTable'
import { ApiUrls } from '@/configs/apiUrls'
import { defaultVoucherStatusStyle, defaultVoucherTypeStyle } from '@/configs/defaultStylesConfig'
import { EnumConfig } from '@/configs/enumConfig'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { formatDateBasedOnCurrentLanguage, formatDateToSqlDate } from '@/utils/formatDateUtil'
import { Box, Button, Chip, Stack } from '@mui/material'
import { useMemo, useState } from 'react'
import VoucherDetailDialog from './VoucherDetailDialog'
import VoucherFormDialog from './VoucherFormDialog'

const VoucherManagementTable = ({ vouchers, loading, refetch }) => {
	const [selectedRow, setSelectedRow] = useState({})
	const [openCreate, setOpenCreate] = useState(false)
	const [openUpdate, setOpenUpdate] = useState(false)
	const [openDetail, setOpenDetail] = useState(false)
	const [detailVoucher, setDetailVoucher] = useState(null)

	const confirm = useConfirm()
	const { t } = useTranslation()

	const getMedicines = useFetch(ApiUrls.MEDICINE.MANAGEMENT.GET_ALL)

	const voucherPost = useAxiosSubmit({
		url: ApiUrls.VOUCHER.MANAGEMENT.INDEX,
		method: 'POST',
	})

	const voucherPut = useAxiosSubmit({
		url: ApiUrls.VOUCHER.MANAGEMENT.DETAIL(selectedRow.id),
		method: 'PUT',
	})

	const voucherDelete = useAxiosSubmit({
		method: 'DELETE',
	})

	const createInitialValues = useMemo(
		() => ({
			name: '',
			description: '',
			discountValue: '',
			minPurchaseAmount: '',
			maxDiscount: '',
			quantity: '',
			expireDate: '',
			voucherType: EnumConfig.VoucherType.Patient,
			discountType: EnumConfig.VoucherDiscountType.Percentage,
			image: null,
			medicineIds: [{ medicineId: '' }],
		}),
		[]
	)

	const buildVoucherFormData = (rawValues) => {
		const formData = new FormData()
		if (!rawValues) return formData

		const processedValues = { ...rawValues }
		const isMedicineVoucher = processedValues.voucherType === EnumConfig.VoucherType.Medicine

		if (Array.isArray(processedValues.medicineIds)) {
			processedValues.medicineIds = processedValues.medicineIds
				.filter((item) => item?.medicineId)
				.map((item) => item.medicineId)
		}

		if (isMedicineVoucher) {
			delete processedValues.quantity
			delete processedValues.image
		} else {
			delete processedValues.medicineIds
		}

		Object.entries(processedValues).forEach(([key, value]) => {
			if (value === null || value === undefined) return
			if (key === 'medicineIds' && Array.isArray(value)) {
				value.forEach((id) => formData.append('medicineIds', id))
				return
			}
			formData.append(key, value)
		})

		return formData
	}

	const handleUpdateSubmit = async ({ values, closeDialog }) => {
		const respond = await voucherPut.submit(buildVoucherFormData(values))

		if (respond) {
			closeDialog()
			refetch()
		}
	}

	const handleCreateSubmit = async ({ values, closeDialog }) => {
		const respond = await voucherPost.submit(buildVoucherFormData(values))

		if (respond) {
			closeDialog()
			refetch()
		}
	}

	const handleDeleteClick = async (row) => {
		const isConfirmed = await confirm({
			confirmText: t('button.delete'),
			confirmColor: 'error',
			title: t('voucher.title.delete'),
			description: `${t('voucher.title.delete_confirm')} ${row.name}?`,
		})

		if (isConfirmed) {
			await voucherDelete.submit(undefined, {
				overrideUrl: ApiUrls.VOUCHER.MANAGEMENT.DETAIL(row.id),
			})
			refetch()
		}
	}

	const fields = useMemo(
		() => [
			{ key: 'id', title: t('voucher.field.id'), width: 5, fixedColumn: true },
			{ key: 'name', title: t('voucher.field.name'), width: 12 },
			{ key: 'code', title: t('voucher.field.code'), width: 10 },
			{
				key: 'discountValue',
				title: t('voucher.field.discount_value'),
				width: 8,
				render: (value, row) => {
					if (row.discountType === EnumConfig.VoucherDiscountType.Percentage) {
						return `${value}%`
					}
					return `${value.toLocaleString()} VND`
				},
			},
			{
				key: 'quantity',
				title: t('voucher.field.quantity'),
				width: 7,
				render: (value, row) => {
					if (row.voucherType === EnumConfig.VoucherType.Patient) {
						return value || 0
					}
					return '-'
				},
			},
			{
				key: 'expireDate',
				title: t('voucher.field.expire_date'),
				width: 10,
				render: (value) => formatDateBasedOnCurrentLanguage(value),
			},
			{
				key: 'voucherStatus',
				title: t('voucher.field.voucher_status'),
				width: 8,
				render: (value) => (
					<Chip
						label={t(`voucher.status.${value}`)}
						color={defaultVoucherStatusStyle(value)}
						size='small'
						sx={{ fontWeight: 500 }}
					/>
				),
			},
			{
				key: 'voucherType',
				title: t('voucher.field.voucher_type'),
				width: 8,
				render: (value) => (
					<Chip
						label={t(`voucher.type.${value}`)}
						color={defaultVoucherTypeStyle(value)}
						size='small'
						sx={{ fontWeight: 500 }}
					/>
				),
			},
			{
				key: 'medicines',
				title: t('voucher.field.medicines'),
				width: 12,
				render: (value, row) => {
					if (row.voucherType === EnumConfig.VoucherType.Medicine) {
						if (value?.length > 0) {
							return (
								<Stack direction='row' spacing={1} alignItems='center'>
									<Chip
										label={`${value.length} ${t('voucher.field.medicine').toLowerCase()}`}
										size='small'
										color='info'
										variant='outlined'
									/>
								</Stack>
							)
						}
						return '-'
					}
					return '-'
				},
			},
			{
				key: '',
				title: '',
				width: 5,
				render: (value, row) => (
					<ActionMenu
						actions={[
							{
								title: t('button.view_detail'),
								onClick: () => {
									setDetailVoucher(row)
									setOpenDetail(true)
								},
							},
							{
								title: t('button.edit'),
								onClick: () => {
									const formattedRow = { ...row }
									if (row.medicineIds && Array.isArray(row.medicineIds)) {
										formattedRow.medicineIds = row.medicineIds.map((id) => ({
											medicineId: id,
										}))
									} else if (row.medicines && Array.isArray(row.medicines)) {
										formattedRow.medicineIds = row.medicines.map((medicine) => ({
											medicineId: medicine.id,
										}))
									}
									if (row.expireDate) {
										formattedRow.expireDate = formatDateToSqlDate(row.expireDate)
									}
									setSelectedRow(formattedRow)
									setOpenUpdate(true)
								},
							},
							{
								title: t('button.delete'),
								onClick: () => handleDeleteClick(row),
							},
						]}
					/>
				),
			},
		],
		[t]
	)

	const medicineOptions = useMemo(() => {
		const raw = getMedicines.data?.collection
		return raw?.map((medicine) => ({
			value: medicine.id,
			label: `${medicine.name}${medicine.brand ? ` - ${medicine.brand}` : ''}`,
		}))
	}, [getMedicines.data])

	return (
		<>
			<Box sx={{ py: 1, px: 2, mt: 2 }}>
				<Stack
					spacing={2}
					direction='row'
					alignItems='center'
					justifyContent='flex-end'
					ml={2}
					mb={1.5}
				>
					<Button variant='contained' color='primary' onClick={() => setOpenCreate(true)}>
						{t('button.create')}
					</Button>
				</Stack>
				<GenericTable data={vouchers} fields={fields} rowKey='id' loading={loading} />
			</Box>
			<VoucherFormDialog
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				initialValues={createInitialValues}
				medicineOptions={medicineOptions}
				submitLabel={t('button.create')}
				submitButtonColor='success'
				title={t('voucher.title.create')}
				onSubmit={handleCreateSubmit}
				isUpdate={false}
			/>
			<VoucherFormDialog
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				initialValues={selectedRow}
				medicineOptions={medicineOptions}
				submitLabel={t('button.update')}
				submitButtonColor='success'
				title={t('voucher.title.update')}
				onSubmit={handleUpdateSubmit}
				isUpdate={true}
			/>
			<VoucherDetailDialog
				open={openDetail}
				onClose={() => {
					setOpenDetail(false)
					setDetailVoucher(null)
				}}
				voucher={detailVoucher}
			/>
		</>
	)
}

export default VoucherManagementTable
