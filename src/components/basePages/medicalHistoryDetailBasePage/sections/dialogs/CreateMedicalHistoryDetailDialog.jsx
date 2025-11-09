import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import { defaultLineClampStyle } from '@/configs/defaultStylesConfig'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setMedicalServicesStore } from '@/redux/reducers/managementReducer'
import { numberHigherThan } from '@/utils/validateUtil'
import { Stack, Typography } from '@mui/material'

const CreateMedicalHistoryDetailDialog = ({
	open,
	onClose,
	onSubmit = (values) => Promise.resolve(values),
}) => {
	const { t } = useTranslation()
	const medicalServiceStore = useReduxStore({
		selector: (state) => state.management.medicalServices,
		setStore: setMedicalServicesStore,
	})

	const fields = [
		{
			key: 'medicalServiceId',
			title: t('medical_history.field.medical_history_detail.medical_service'),
			type: 'select',
			options:
				medicalServiceStore?.data.map((item) => ({
					value: item.id,
					label: item,
				})) || [],
			renderOption: (value, label) => (
				<Stack direction={'row'} justifyContent={'space-between'} alignItems={'stretch'}>
					<Stack>
						<Typography variant='subtitle1'>{label?.name}</Typography>
						<Typography variant='subtitle2' color='text.secondary'>
							{label?.specialtyName}
						</Typography>
						<Typography variant='caption' color='text.secondary' sx={{ ...defaultLineClampStyle(2) }}>
							{label?.description}
						</Typography>
					</Stack>
					<Typography variant='subtitle2' color='primary'>
						${label?.price ?? 0}
					</Typography>
				</Stack>
			),
		},
		{
			key: 'quantity',
			title: t('medical_history.field.medical_history_detail.quantity'),
			type: 'number',
			validate: [numberHigherThan(1)],
		},
	]

	return (
		<GenericFormDialog
			open={open}
			onClose={onClose}
			title={t('medical_history.dialog.title.add_medical_service')}
			fields={fields}
			onSubmit={({ values }) => onSubmit(values)}
			submitButtonColor='primary'
			submitLabel={t('button.add')}
		/>
	)
}

export default CreateMedicalHistoryDetailDialog
