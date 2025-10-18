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
	const hasPrescription = Boolean(prescription)

	return (
		<Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
			<Typography variant='h6' gutterBottom>
				Prescription
			</Typography>
			{!hasPrescription ? (
				<Stack alignItems='center' justifyContent='center' spacing={2} sx={{ py: 4 }}>
					<Typography color='text.secondary'>No prescription yet</Typography>
					{role === 'Doctor' && medicalHistoryStatus === 'Draft' && (
						<Button variant='contained' onClick={onClickCreatePrescription}>
							Create Prescription
						</Button>
					)}
				</Stack>
			) : (
				<Stack spacing={2}>
					<Typography variant='body2' color='text.secondary'>
						Doctor Note: {prescription?.doctorNote}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						Medication Days: {prescription?.medicationDays}
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
											Brand: {m.medicineBrand}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											Unit: {m.medicineUnit} | Dosage: {m.dosage} | Freq/Day: {m.frequencyPerDay}
										</Typography>
									</Stack>
								</Paper>
							))}
					</Stack>
					{role === 'Doctor' && medicalHistoryStatus === 'Draft' && (
						<Button variant='contained' onClick={onClickUpdatePrescription}>
							Update Prescription
						</Button>
					)}
					{medicalHistoryStatus !== 'Draft' && (
						<Button variant='outlined' onClick={onClickPrintPrescription}>
							Print Prescription
						</Button>
					)}
				</Stack>
			)}
		</Paper>
	)
}

export default MedicalHistoryDetailPrescriptionSection
