import useEnum from '@/hooks/useEnum'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Button, Grid, Stack } from '@mui/material'

const FeedbackReportManagementFilterSection = ({ filters, setFilters, loading }) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const { values, setField, handleChange, registerRef, reset } = useForm({ status: filters.status })
	const { renderField } = useFieldRenderer(
		values,
		setField,
		handleChange,
		registerRef,
		false,
		'outlined',
		'small'
	)

	const fields = [
		{
			key: 'status',
			title: t('feedback_report.field.status'),
			type: 'select',
			required: false,
			options: _enum.feedbackReportStatusEnum,
			props: { fullWidth: true },
		},
	]

	return (
		<Stack spacing={2}>
			<Grid container spacing={2}>
				<Grid size={12} md={4}>
					{renderField(fields[0])}
				</Grid>
			</Grid>
			<Stack direction='row' spacing={2}>
				<Button
					variant='contained'
					disabled={loading}
					onClick={() => setFilters((f) => ({ ...f, status: values.status }))}
				>
					{t('button.filter')}
				</Button>
				<Button
					variant='outlined'
					disabled={loading}
					onClick={() => {
						reset({ status: '' })
						setFilters({ status: '' })
					}}
				>
					{t('button.reset_filter')}
				</Button>
			</Stack>
		</Stack>
	)
}

export default FeedbackReportManagementFilterSection
