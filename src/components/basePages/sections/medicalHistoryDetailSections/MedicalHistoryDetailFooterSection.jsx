import ConfirmationButton from '@/components/generals/ConfirmationButton'
import useTranslation from '@/hooks/useTranslation'
import { Button, Paper, Stack } from '@mui/material'

const MedicalHistoryDetailFooterSection = ({
	role,
	medicalHistoryStatus,
	onClickUpdateMedicalHistory,
	onClickCompleteMedicalHistory,
	onClickPayment,
	onClickPrintInvoice,
}) => {
	const { t } = useTranslation()

	const isDoctorRole = role === 'Doctor'
	const isDraftStatus = medicalHistoryStatus === 'Draft'
	const isProcessedStatus = medicalHistoryStatus === 'Processed'
	const isPaidStatus = medicalHistoryStatus === 'Paid'

	return (
		<Paper
			sx={{
				position: 'sticky',
				bottom: 15,
				p: 2,
				borderTop: '1px solid',
				borderColor: 'divider',
				backgroundColor: 'background.lightBlue',
			}}
			elevation={3}
		>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={1.5}
				justifyContent='flex-start'
				alignItems='center'
			>
				{isDoctorRole && isDraftStatus && (
					<>
						<Button variant='outlined' color='success' onClick={onClickUpdateMedicalHistory}>
							{t('medical_history.button.update_medical_history')}
						</Button>
						<ConfirmationButton
							confirmationTitle={t('medical_history.dialog.confirm.complete_medical_history_title')}
							confirmationDescription={t(
								'medical_history.dialog.confirm.complete_medical_history_description'
							)}
							confirmButtonColor='secondary'
							confirmButtonText={t('button.complete')}
							variant='contained'
							color='secondary'
							onConfirm={onClickCompleteMedicalHistory}
						>
							{t('medical_history.button.complete_medical_history')}
						</ConfirmationButton>
					</>
				)}
				{isProcessedStatus && (
					<Button variant='contained' onClick={onClickPayment}>
						{t('medical_history.button.payment')}
					</Button>
				)}
				{isPaidStatus && (
					<Button variant='contained' onClick={onClickPrintInvoice}>
						{t('medical_history.button.print_invoice')}
					</Button>
				)}
			</Stack>
		</Paper>
	)
}

export default MedicalHistoryDetailFooterSection
