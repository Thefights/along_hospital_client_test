import { useConfirm } from '@/hooks/useConfirm'
import useTranslation from '@/hooks/useTranslation'
import { Delete } from '@mui/icons-material'
import {
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'

const MedicalHistoryDetailServiceSection = ({
	medicalHistoryDetails,
	role,
	medicalHistoryStatus,
	onClickCreateMedicalHistoryService,
	onDeleteMedicalHistoryService,
}) => {
	const confirm = useConfirm()

	const { t } = useTranslation()

	const handleDelete = async (serviceId) => {
		const confirmed = await confirm({
			title: 'Confirm Delete',
			description: 'Are you sure you want to delete this service?',
			confirmColor: 'error',
			confirmText: t('button.delete'),
		})

		if (confirmed) {
			onDeleteMedicalHistoryService(serviceId)
		}
	}

	return (
		<Paper sx={{ p: 3, borderRadius: 2 }}>
			<Typography variant='h6' gutterBottom>
				Service Details
			</Typography>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Service Name</TableCell>
							<TableCell>Description</TableCell>
							<TableCell align='right'>Qty</TableCell>
							<TableCell align='right'>Unit Price</TableCell>
							<TableCell align='right'>Total</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{medicalHistoryDetails &&
							medicalHistoryDetails.length > 0 &&
							medicalHistoryDetails.map((service) => (
								<TableRow key={`${service.medicalHistoryId}-${service.medicalServiceId}`}>
									<TableCell>{service.medicalServiceName}</TableCell>
									<TableCell>{service.medicalServiceDescription}</TableCell>
									<TableCell align='right'>{service.quantity}</TableCell>
									<TableCell align='right'>${service.unitPrice}</TableCell>
									<TableCell align='right'>${service.totalPrice}</TableCell>
									<TableCell>
										<IconButton onClick={() => handleDelete(service.medicalServiceId)}>
											<Delete color='error' />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						<TableRow>
							<TableCell colSpan={4} align='right'>
								<Typography fontWeight={600}>Grand Total</Typography>
							</TableCell>
							<TableCell align='right'>
								<Typography fontWeight={600}>
									${medicalHistoryDetails?.reduce((acc, service) => acc + service.totalPrice, 0) ?? 0}
								</Typography>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			{role === 'Doctor' && medicalHistoryStatus === 'Draft' && (
				<Button variant='contained' onClick={onClickCreateMedicalHistoryService} sx={{ mt: 2 }}>
					Add Service
				</Button>
			)}
		</Paper>
	)
}

export default MedicalHistoryDetailServiceSection
