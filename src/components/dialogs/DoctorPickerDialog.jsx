import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setDoctorsStore } from '@/redux/reducers/managementReducer'
import GenericFormDialog from './commons/GenericFormDialog'

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {(params: {values: any, closeDialog: Function, setField: Function}) => Promise<any>} [props.onSubmit]
 */
const DoctorPickerDialog = ({ open, onClose, onSubmit }) => {
	const { t } = useTranslation()

	const getDoctorStore = useReduxStore({
		selector: (state) => state.management.doctors,
		setStore: setDoctorsStore,
	})

	return (
		<GenericFormDialog
			open={open}
			onClose={onClose}
			onSubmit={onSubmit}
			title={t('dialog.doctor_picker.title')}
			fields={[
				{
					key: 'doctorId',
					title: t('text.role.doctor'),
					type: 'select',
					options: [
						{ value: '', label: t('dialog.doctor_picker.title'), disabled: true },
						...getDoctorStore.data,
					],
				},
			]}
			submitLabel={t('dialog.doctor_picker.confirm_button')}
		/>
	)
}

export default DoctorPickerDialog
