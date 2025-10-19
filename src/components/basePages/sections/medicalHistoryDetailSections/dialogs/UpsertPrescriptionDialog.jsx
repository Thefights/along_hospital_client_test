import GenericFormDialog from '@/components/dialogs/commons/GenericFormDialog'
import { ApiUrls } from '@/configs/apiUrls'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setMedicinesStore } from '@/redux/reducers/managementReducer'
import { getImageFromCloud } from '@/utils/commons'
import { getObjectValueFromStringPath } from '@/utils/handleObjectUtil'
import { maxLen, numberHigherThan } from '@/utils/validateUtil'
import { Avatar, Typography } from '@mui/material'
import { Stack } from '@mui/system'

const UpsertPrescriptionDialog = ({ open, onClose, initialValues, onSubmit = () => {} }) => {
	const { t } = useTranslation()

	const medicineStore = useReduxStore({
		url: ApiUrls.MEDICINE.MANAGEMENT.GET_ALL,
		selector: (state) => state.management.medicines,
		setStore: setMedicinesStore,
	})

	const fields = [
		{ key: 'doctorNote', title: 'Doctor Note', type: 'text', multiple: 2, validate: [maxLen(1000)] },
		{
			key: 'medicationDays',
			title: 'Medication Days',
			type: 'number',
			validate: [numberHigherThan(1)],
		},
		{
			key: 'prescriptionDetails',
			title: 'Prescription Details',
			type: 'array',
			of: [
				{
					key: 'medicineId',
					title: 'Medicine',
					type: 'select',
					options: medicineStore.data || [],
					renderOption: (option) => (
						<Stack direction='row' spacing={1} alignItems='center' sx={{ width: '100%' }}>
							<Avatar src={getImageFromCloud(option.image)} alt={option.name} />
							<Stack sx={{ width: '100%' }}>
								{[
									{ key: 'name', label: 'Name' },
									{ key: 'brand', label: 'Brand' },
									{ key: 'unit', label: 'Unit' },
								].map((field) => (
									<Stack direction={'row'} justifyContent={'space-between'}>
										<Typography variant='body2' color='text.secondary'>
											{field.label}
										</Typography>
										<Typography variant='body2' color='text.secondary' textAlign={'right'}>
											{getObjectValueFromStringPath(option, field.key) ?? '-'}
										</Typography>
									</Stack>
								))}
							</Stack>
						</Stack>
					),
				},
				{
					key: 'dosage',
					title: 'Dosage (per time)',
					type: 'number',
					validate: [numberHigherThan(0)],
				},
				{
					key: 'frequencyPerDay',
					title: 'Frequency (per day)',
					type: 'number',
					validate: [numberHigherThan(0)],
				},
			],
		},
	]

	return (
		<GenericFormDialog
			open={open}
			onClose={onClose}
			title={initialValues ? 'Update prescription' : 'Create prescription'}
			fields={fields}
			initialValues={initialValues}
			onSubmit={onSubmit}
			submitButtonColor={initialValues ? 'success' : 'primary'}
			submitLabel={initialValues ? t('button.update') : t('button.create')}
			maxWidth='lg'
		/>
	)
}

export default UpsertPrescriptionDialog
