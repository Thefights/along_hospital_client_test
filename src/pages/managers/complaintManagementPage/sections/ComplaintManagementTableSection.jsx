import ViewDetailMedicalHistoryButton from '@/components/buttons/ViewDetailMedicalHistoryButton'
import ActionMenu from '@/components/generals/ActionMenu'
import GenericTable from '@/components/tables/GenericTable'
import {
	defaultComplaintResolveStatusStyle,
	defaultComplaintTypeStyle,
} from '@/configs/defaultStylesConfig'
import { EnumConfig } from '@/configs/enumConfig'
import { useConfirm } from '@/hooks/useConfirm'
import useEnum from '@/hooks/useEnum'
import useTranslation from '@/hooks/useTranslation'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { Chip } from '@mui/material'

const ComplaintManagementTableSection = ({
	complaints,
	loading,
	sort,
	setSort,
	setSelectedComplaint = () => {},
	onClassifyComplaint = (type) => Promise.resolve(type),
}) => {
	const { t } = useTranslation()
	const _enum = useEnum()
	const confirm = useConfirm()

	const fields = [
		{ key: 'id', title: 'Id', width: 5, sortable: true },
		{ key: 'complaintTopic', title: t('complaint.field.topic'), width: 15, sortable: true },
		{ key: 'content', title: t('complaint.field.content'), width: 20, sortable: false },
		{ key: 'response', title: t('complaint.field.response'), width: 20, sortable: false },
		{
			key: 'complaintType',
			title: t('complaint.field.type'),
			sortable: true,
			width: 15,
			render: (value) => (
				<Chip
					label={getEnumLabelByValue(_enum.complaintTypeOptions, value)}
					color={defaultComplaintTypeStyle(value)}
					size='small'
				/>
			),
		},
		{
			key: 'complaintResolveStatus',
			title: t('complaint.field.resolve_status'),
			sortable: true,
			width: 15,
			render: (value) => (
				<Chip
					label={getEnumLabelByValue(_enum.complaintResolveStatusOptions, value)}
					color={defaultComplaintResolveStatusStyle(value)}
					size='small'
				/>
			),
		},
		{
			key: '',
			title: '',
			sortable: false,
			render: (_, row) => <ViewDetailMedicalHistoryButton medicalHistoryId={row.medicalHistoryId} />,
		},
		{
			key: '',
			title: '',
			sortable: false,
			render: (_, row) => (
				<ActionMenu
					menuTooltip={t('complaint.button.tooltip_classify')}
					actions={[
						row.complaintType !== EnumConfig.ComplaintType.Neutral && {
							title: t('complaint.button.classify_neutral'),
							onClick: async () => {
								const isConfirmed = await confirm({
									title: t('complaint.dialog.confirm.classify_complaint_title'),
									description: t('complaint.dialog.confirm.classify_complaint_description', {
										type: EnumConfig.ComplaintType.Neutral,
									}),
									confirmColor: defaultComplaintTypeStyle(EnumConfig.ComplaintType.Neutral),
									confirmText: t('complaint.button.classify_neutral'),
								})

								if (isConfirmed) {
									setSelectedComplaint(row)
									await onClassifyComplaint(EnumConfig.ComplaintType.Neutral)
								}
							},
						},
						row.complaintType !== EnumConfig.ComplaintType.Positive && {
							title: t('complaint.button.classify_positive'),
							onClick: async () => {
								const isConfirmed = await confirm({
									title: t('complaint.dialog.confirm.classify_complaint_title'),
									description: t('complaint.dialog.confirm.classify_complaint_description', {
										type: EnumConfig.ComplaintType.Positive,
									}),
									confirmColor: defaultComplaintTypeStyle(EnumConfig.ComplaintType.Positive),
									confirmText: t('complaint.button.classify_positive'),
								})

								if (isConfirmed) {
									setSelectedComplaint(row)
									await onClassifyComplaint(EnumConfig.ComplaintType.Positive)
								}
							},
						},
						row.complaintType !== EnumConfig.ComplaintType.Negative && {
							title: t('complaint.button.classify_negative'),
							onClick: async () => {
								const isConfirmed = await confirm({
									title: t('complaint.dialog.confirm.classify_complaint_title'),
									description: t('complaint.dialog.confirm.classify_complaint_description', {
										type: EnumConfig.ComplaintType.Negative,
									}),
									confirmColor: defaultComplaintTypeStyle(EnumConfig.ComplaintType.Negative),
									confirmText: t('complaint.button.classify_negative'),
								})

								if (isConfirmed) {
									setSelectedComplaint(row)
									await onClassifyComplaint(EnumConfig.ComplaintType.Negative)
								}
							},
						},
					]}
				/>
			),
		},
	]

	return (
		<GenericTable
			fields={fields}
			data={complaints}
			rowKey='id'
			sort={sort}
			setSort={setSort}
			loading={loading}
		/>
	)
}

export default ComplaintManagementTableSection
