/* eslint-disable no-unused-vars */
import SkeletonTableRow from '@/components/skeletons/SkeletonTableRow'
import { EnumConfig } from '@/configs/enumConfig'
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
	loading = false,
	onOpenCreateMedicalHistoryService,
	onDeleteMedicalHistoryService = (medicalServiceId) => {},
}) => {
	const confirm = useConfirm()
	const { t } = useTranslation()

	const isDoctor = role === EnumConfig.Role.Doctor
	const isDraft = medicalHistoryStatus === EnumConfig.MedicalHistoryStatus.Draft

	const handleDelete = async (medicalServiceId) => {
		const confirmed = await confirm({
			title: t('medical_history.dialog.confirm.delete_service_title'),
			description: t('medical_history.dialog.confirm.delete_service_description'),
			confirmColor: 'error',
			confirmText: t('button.delete'),
		})

		if (confirmed) {
			onDeleteMedicalHistoryService(medicalServiceId)
		}
	}

	return (
		<Paper sx={{ p: 3, borderRadius: 2 }}>
			<Typography variant='h6' gutterBottom>
				{t('medical_history.title.service_details')}
			</Typography>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>{t('medical_history.field.medical_history_detail.service_name')}</TableCell>
							<TableCell>{t('medical_history.field.medical_history_detail.description')}</TableCell>
							<TableCell align='right'>
								{t('medical_history.field.medical_history_detail.quantity')}
							</TableCell>
							<TableCell align='right'>
								{t('medical_history.field.medical_history_detail.unit_price')}
							</TableCell>
							<TableCell align='right'>
								{t('medical_history.field.medical_history_detail.total_price')}
							</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<SkeletonTableRow colSpan={6} lineCount={2} rows={2} />
						) : (
							medicalHistoryDetails &&
							medicalHistoryDetails.length > 0 &&
							medicalHistoryDetails.map((service) => (
								<TableRow key={`${service.medicalHistoryId}-${service.medicalServiceId}`}>
									<TableCell>{service.medicalServiceName}</TableCell>
									<TableCell>{service.medicalServiceDescription}</TableCell>
									<TableCell align='right'>{service.quantity}</TableCell>
									<TableCell align='right'>${service.unitPrice}</TableCell>
									<TableCell align='right'>${service.totalPrice}</TableCell>
									<TableCell>
										{isDoctor && isDraft && (
											<IconButton onClick={() => handleDelete(service.medicalServiceId)}>
												<Delete color='error' />
											</IconButton>
										)}
									</TableCell>
								</TableRow>
							))
						)}

						<TableRow>
							<TableCell colSpan={4} align='right'>
								<Typography fontWeight={600}>
									{t('medical_history.field.medical_history_detail.grand_total')}
								</Typography>
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
			{isDoctor && isDraft && (
				<Button variant='contained' onClick={onOpenCreateMedicalHistoryService} sx={{ mt: 2 }}>
					{t('medical_history.button.add_service')}
				</Button>
			)}
		</Paper>
	)
}

export default MedicalHistoryDetailServiceSection
