import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import { EnumConfig } from '@/configs/enumConfig'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { isPercentage, maxLen } from '@/utils/validateUtil'
import { useState } from 'react'

const VoucherFormDialog = ({
	open,
	onClose,
	title,
	initialValues,
	medicineOptions,
	submitLabel,
	submitButtonColor,
	onSubmit,
	isUpdate = false,
}) => {
	const { t } = useTranslation()
	const [values, setValues] = useState(initialValues)
	const _enum = useEnum()
	const baseFields = [
		{
			key: 'voucherType',
			title: t('voucher.field.voucher_type'),
			type: 'select',
			options: _enum.voucherTypeOptions,
			props: { readOnly: isUpdate },
		},
		{
			key: 'name',
			title: t('voucher.field.name'),
			type: 'text',
			validate: [maxLen(255)],
		},
		{
			key: 'description',
			title: t('voucher.field.description'),
			type: 'text',
			required: false,
			validate: [maxLen(1000)],
			multiple: 3,
		},
		{
			key: 'discountType',
			title: t('voucher.field.discount_type'),
			type: 'select',
			options: _enum.voucherDiscountTypeOptions,
		},
		{
			key: 'discountValue',
			title: t('voucher.field.discount_value'),
			type: 'number',
			validate:
				values.discountType === EnumConfig.VoucherDiscountType.Percentage ? [isPercentage()] : [],
		},
		{
			key: 'minPurchaseAmount',
			title: t('voucher.field.min_purchase_amount'),
			type: 'number',
			required: false,
		},
		{
			key: 'maxDiscount',
			title: t('voucher.field.max_discount'),
			type: 'number',
			required: false,
		},
		{
			key: 'expireDate',
			title: t('voucher.field.expire_date'),
			type: 'date',
			minValue: new Date().toISOString().split('T')[0],
		},
	]

	const patientFields = [
		{
			key: 'quantity',
			title: t('voucher.field.quantity'),
			type: 'number',
		},
		{
			key: 'image',
			title: t('voucher.field.image'),
			type: 'image',
			required: false,
		},
	]

	const medicineFields = [
		{
			key: 'medicineIds',
			title: t('voucher.field.applicable_medicines'),
			type: 'array',
			of: [
				{
					key: 'medicineId',
					title: t('voucher.field.medicine'),
					type: 'select',
					options: medicineOptions,
				},
			],
		},
	]

	const fields = [
		...baseFields,
		...(values.voucherType === EnumConfig.VoucherType.Patient ? patientFields : []),
		...(values.voucherType === EnumConfig.VoucherType.Medicine ? medicineFields : []),
	]

	const handleSubmit = async ({ values, closeDialog, setField }) => {
		return onSubmit({ values, closeDialog, setField })
	}

	return (
		<GenericFormDialog
			open={open}
			onClose={onClose}
			title={title}
			initialValues={initialValues}
			fields={fields}
			submitLabel={submitLabel}
			submitButtonColor={submitButtonColor}
			onValuesChange={setValues}
			textFieldVariant={'outlined'}
			onSubmit={handleSubmit}
		/>
	)
}

export default VoucherFormDialog
