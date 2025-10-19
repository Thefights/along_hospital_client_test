import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import { ApiUrls } from '@/configs/apiUrls'
import { defaultLineClampStyle } from '@/configs/defaultStylesConfig'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setMedicalServicesStore } from '@/redux/reducers/managementReducer'
import { numberHigherThan } from '@/utils/validateUtil'
import { Stack, Typography } from '@mui/material'

const CreateMedicalHistoryServiceDialog = ({ open, onClose, onSubmit = (values) => {} }) => {
	const { t } = useTranslation()
	const medicalServiceStore = useReduxStore({
		url: ApiUrls.MEDICAL_SERVICE.MANAGEMENT.GET_ALL,
		selector: (state) => state.management.medicalServices,
		setStore: setMedicalServicesStore,
	})

	const fields = [
		{
			key: 'medicalServiceId',
			title: 'Medicine Service',
			type: 'select',
			options: medicalServiceStore?.data || [],
			renderOption: (option) => (
				<Stack direction={'row'} justifyContent={'space-between'} alignItems={'stretch'}>
					<Stack>
						<Typography variant='subtitle1'>{option?.name}</Typography>
						<Typography variant='subtitle2' color='text.secondary'>
							{option?.specialtyName}
						</Typography>
						<Typography variant='caption' color='text.secondary' sx={{ ...defaultLineClampStyle(2) }}>
							{option?.description}
						</Typography>
					</Stack>
					<Typography variant='subtitle2' color='primary'>
						${option?.price ?? 0}
					</Typography>
				</Stack>
			),
		},
		{
			key: 'quantity',
			title: 'Quantity',
			type: 'number',
			validate: [numberHigherThan(1)],
		},
	]

	return (
		<GenericFormDialog
			open={open}
			onClose={onClose}
			title='Add new Medical Service'
			fields={fields}
			onSubmit={({ values }) => onSubmit(values)}
			submitButtonColor='primary'
			submitLabel={t('button.add')}
		/>
	)
}

export default CreateMedicalHistoryServiceDialog
