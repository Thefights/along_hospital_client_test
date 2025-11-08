import SkeletonInvoice from '@/components/skeletons/SkeletonInvoice'
import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import {
	formatDateBasedOnCurrentLanguage,
	formatDatetimeStringBasedOnCurrentLanguage,
} from '@/utils/formatDateUtil'
import { formatCurrencyBasedOnCurrentLanguage } from '@/utils/formatNumberUtil'
import {
	Box,
	Button,
	Divider,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import { useParams } from 'react-router-dom'

const MedicalHistoryInvoicePage = () => {
	const { id } = useParams()
	const { t } = useTranslation()

	const { data, loading } = useFetch(ApiUrls.MEDICAL_HISTORY.DETAIL(id), {}, [id])

	if (loading || !data) {
		return <SkeletonInvoice />
	}

	const subtotal = data.medicalHistoryDetails?.reduce((sum, item) => sum + item.totalPrice, 0) || 0
	const taxRate = 0.0
	const taxAmount = subtotal * taxRate
	const total = subtotal + taxAmount

	return (
		<Box sx={{ p: 4, bgcolor: 'background.default' }}>
			<style>
				{`
				@media print {
					body * {
						visibility: hidden;
					}
					#invoice-paper, #invoice-paper * {
						visibility: visible;
					}
					#invoice-paper {
						position: absolute;
						top: 0;
                        marginX: auto;
						width: 100%;
						height: 'max-content';
					}
				}
				`}
			</style>
			<Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
				<Button variant='outlined' onClick={() => window.print()}>
					{t('medical_history.button.print_invoice')}
				</Button>
			</Box>

			<Paper
				id='invoice-paper'
				elevation={3}
				sx={{
					maxWidth: 900,
					mx: 'auto',
					p: 4,
					bgcolor: 'background.paper',
					'@media print': {
						boxShadow: 'none',
						borderRadius: 0,
					},
				}}
			>
				<Grid container spacing={2} alignItems='center'>
					<Grid size={8}>
						<Typography variant='h5' fontWeight={700} textTransform='uppercase'>
							{t('about_us.information.name')}
						</Typography>
						<Typography variant='body2'>
							{t('about_us.field.address')}: {t('about_us.information.address')}
						</Typography>
						<Typography variant='body2'>
							{t('about_us.field.phone')}: {t('about_us.information.phone')}
						</Typography>
					</Grid>
					<Grid size={4} sx={{ textAlign: 'right' }}>
						<Typography variant='h6' fontWeight={700} textTransform={'uppercase'}>
							{t('medical_history.title.invoice')}
						</Typography>
						<Typography variant='body2'>
							{t('medical_history.field.id')}: #{data.id}
						</Typography>
						<Typography variant='body2'>
							{t('medical_history.field.completed_date')}:{' '}
							{formatDatetimeStringBasedOnCurrentLanguage(data.completedDate)}
						</Typography>
					</Grid>
				</Grid>

				<Divider sx={{ my: 3 }} />

				<Grid container spacing={3}>
					<Grid size={6}>
						<Typography variant='subtitle1' fontWeight={600} gutterBottom>
							{t('medical_history.title.patient_info')}
						</Typography>
						<Typography variant='body2'>
							{t('profile.field.name')}: {data.patient?.name || '—'}
						</Typography>
						<Typography variant='body2'>
							{t('profile.field.medical_number')}: {data.patient?.medicalNumber || data.patientId}
						</Typography>
						<Typography variant='body2'>
							{t('profile.field.phone')}: {data.patient?.phone || '—'}
						</Typography>
						<Typography variant='body2'>
							{t('profile.field.email')}: {data.patient?.email || '—'}
						</Typography>
					</Grid>

					<Grid size={6}>
						<Typography variant='subtitle1' fontWeight={600} gutterBottom>
							{t('medical_history.title.doctor_info')}
						</Typography>
						<Typography variant='body2'>
							{t('profile.field.name')}: {data.doctor?.name || '—'}
						</Typography>
						<Typography variant='body2'>
							{t('profile.field.specialty')}: {data.doctor?.specialtyName || '—'}
						</Typography>
						<Typography variant='body2'>
							{t('profile.field.phone')}: {data.doctor?.phone || '—'}
						</Typography>
					</Grid>
				</Grid>

				<Box sx={{ mt: 3 }}>
					<Typography variant='subtitle1' fontWeight={600} gutterBottom>
						{t('medical_history.title.examination_info')}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.diagnosis')}: {data.diagnosis || '—'}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.status')}: {data.medicalHistoryStatus || '—'}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.follow_up_appointment_date')}:{' '}
						{formatDateBasedOnCurrentLanguage(data.followUpAppointmentDate)}
					</Typography>
					<Typography variant='body2'>
						{t('medical_history.field.prescription.doctor_note')}: {data.prescription?.doctorNote || '—'}
					</Typography>
				</Box>

				<Box sx={{ mt: 4 }}>
					<Typography variant='subtitle1' fontWeight={600} gutterBottom>
						{t('medical_history.title.service_details')}
					</Typography>
					<Table size='small'>
						<TableHead>
							<TableRow>
								<TableCell>STT</TableCell>
								<TableCell>{t('medical_history.field.medical_history_detail.service_name')}</TableCell>
								<TableCell align='right'>
									{t('medical_history.field.medical_history_detail.quantity')}
								</TableCell>
								<TableCell align='right'>
									{t('medical_history.field.medical_history_detail.unit_price')}
								</TableCell>
								<TableCell align='right'>
									{t('medical_history.field.medical_history_detail.total_price')}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.medicalHistoryDetails?.map((item, index) => (
								<TableRow key={item.medicalServiceId}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{item.medicalServiceName}</TableCell>
									<TableCell align='right'>{item.quantity}</TableCell>
									<TableCell align='right'>{formatCurrencyBasedOnCurrentLanguage(item.unitPrice)}</TableCell>
									<TableCell align='right'>
										{formatCurrencyBasedOnCurrentLanguage(item.totalPrice)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>

				<Grid container spacing={2} sx={{ mt: 4 }} justifyContent='flex-end'>
					<Grid size={{ xs: 12, sm: 6, md: 4 }}>
						<Box sx={{ border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 1 }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant='body2'>{t('medical_history.field.invoice.subtotal')}</Typography>
								<Typography variant='body2'>{formatCurrencyBasedOnCurrentLanguage(subtotal)}</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant='body2'>
									{t('medical_history.field.invoice.tax', { tax: 0 })}
								</Typography>
								<Typography variant='body2'>{formatCurrencyBasedOnCurrentLanguage(taxAmount)}</Typography>
							</Box>
							<Divider sx={{ my: 1 }} />
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography variant='subtitle1' fontWeight={600}>
									{t('medical_history.field.invoice.total')}
								</Typography>
								<Typography variant='subtitle1' fontWeight={700}>
									{formatCurrencyBasedOnCurrentLanguage(total)}
								</Typography>
							</Box>
						</Box>
					</Grid>
				</Grid>

				<Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
					<Box sx={{ textAlign: 'center' }}>
						<Typography variant='body2' fontWeight={600}>
							{t('medical_history.field.patient')}
						</Typography>
						<Typography variant='caption'>(Ký, ghi rõ họ tên)</Typography>
					</Box>
					<Box sx={{ textAlign: 'center' }}>
						<Typography variant='body2' fontWeight={600}>
							{t('medical_history.field.doctor')}
						</Typography>
						<Typography variant='caption'>(Ký, ghi rõ họ tên)</Typography>
					</Box>
					<Box sx={{ textAlign: 'center' }}>
						<Typography variant='body2' fontWeight={600}>
							{t('medical_history.field.invoice.creator')}
						</Typography>
						<Typography variant='caption'>(Ký, ghi rõ họ tên)</Typography>
					</Box>
				</Box>
			</Paper>
		</Box>
	)
}

export default MedicalHistoryInvoicePage
