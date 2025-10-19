import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { Avatar, Button, Divider, Paper, Stack, Typography } from '@mui/material'

const MedicalHistoryDetailPrescriptionSection = ({
	prescription,
	role,
	medicalHistoryStatus,
	onClickCreatePrescription,
	onClickUpdatePrescription,
	onClickPrintPrescription,
}) => {
	const { t } = useTranslation()

	const hasPrescription = Boolean(prescription)
	const isDoctor = role === 'Doctor'
	const isDraft = medicalHistoryStatus === 'Draft'

	return (
		<Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
			<Typography variant='h6' gutterBottom>
				{t('medical_history.title.prescription')}
			</Typography>
			{!hasPrescription ? (
				<Stack alignItems='center' justifyContent='center' spacing={2} sx={{ py: 4 }}>
					<Typography color='text.secondary'>
						{t('medical_history.placeholder.no_prescription')}
					</Typography>
					{isDoctor && isDraft && (
						<Button variant='contained' onClick={onClickCreatePrescription}>
							{t('medical_history.button.create_prescription')}
						</Button>
					)}
				</Stack>
			) : (
				<Stack spacing={2}>
					<Typography variant='body2' color='text.secondary'>
						{t('medical_history.field.prescription.doctor_note')}: {prescription?.doctorNote}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{t('medical_history.field.prescription.medication_days')}: {prescription?.medicationDays}
					</Typography>
					<Divider />
					<Stack spacing={2}>
						{prescription?.prescriptionDetails?.length > 0 &&
							prescription?.prescriptionDetails?.map((m, i) => (
								<Paper
									key={i}
									variant='outlined'
									sx={{
										p: 2,
										borderRadius: 2,
										display: 'flex',
										alignItems: 'center',
										gap: 2,
									}}
								>
									<Avatar src={getImageFromCloud(m.medicineImage)} sx={{ width: 40, height: 40 }} />
									<Stack spacing={0.5}>
										<Typography variant='subtitle2'>{m.medicineName}</Typography>
										<Typography variant='body2' color='text.secondary'>
											{t('medical_history.field.prescription.medicine_brand')}: {m.medicineBrand}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											{t('medical_history.field.prescription.medicine_unit')}: {m.medicineUnit} |{' '}
											{t('medical_history.field.prescription.dosage')}: {m.dosage} |{' '}
											{t('medical_history.field.prescription.frequency_per_day')}: {m.frequencyPerDay}
										</Typography>
									</Stack>
								</Paper>
							))}
					</Stack>
					{isDoctor && isDraft && (
						<Button variant='contained' onClick={onClickUpdatePrescription}>
							{t('medical_history.button.update_prescription')}
						</Button>
					)}
					{!isDraft && (
						<Button variant='outlined' onClick={onClickPrintPrescription}>
							{t('medical_history.button.print_prescription')}
						</Button>
					)}
				</Stack>
			)}
		</Paper>
	)
}

export default MedicalHistoryDetailPrescriptionSection
