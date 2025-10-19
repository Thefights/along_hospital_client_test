import { ApiUrls } from '@/configs/apiUrls'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, Button, Grid, Paper, Stack } from '@mui/material'
import { useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal'
import { useParams } from 'react-router-dom'
import DoctorInfoDialog from '../dialogs/DoctorInfoDialog'
import PatientInfoDialog from '../dialogs/PatientInfoDialog'
import ConfirmationButton from '../generals/ConfirmationButton'
import CreateComplaintDialog from './sections/medicalHistoryDetailSections/dialogs/CreateComplaintDialog'
import CreateMedicalHistoryDetailDialog from './sections/medicalHistoryDetailSections/dialogs/CreateMedicalHistoryDetailDialog'
import RespondComplaintDialog from './sections/medicalHistoryDetailSections/dialogs/RespondComplaintDialog'
import UpdateMedicalHistoryDialog from './sections/medicalHistoryDetailSections/dialogs/UpdateMedicalHistoryDialog'
import UpsertPrescriptionDialog from './sections/medicalHistoryDetailSections/dialogs/UpsertPrescriptionDialog'
import MedicalHistoryDetailComplaintSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailComplaintSection'
import MedicalHistoryDetailHeaderInfoSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailHeaderInfoSection'
import MedicalHistoryDetailPrescriptionSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailPrescriptionSection'
import MedicalHistoryDetailServiceSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailServiceSection'

const MedicalHistoryDetailBasePage = () => {
	const { id } = useParams()
	const { t } = useTranslation()

	const [selectedMedicalServiceId, setSelectedMedicalServiceId] = useState(0)

	const [openPatientInfo, setOpenPatientInfo] = useState(false)
	const [openDoctorInfo, setOpenDoctorInfo] = useState(false)

	const [openUpdateMedicalHistory, setOpenUpdateMedicalHistory] = useState(false)
	const [openAddMedicalHistoryService, setOpenAddMedicalHistoryService] = useState(false)

	const [openCreateComplaint, setOpenCreateComplaint] = useState(false)
	const [openRespondComplaint, setOpenRespondComplaint] = useState(false)

	const [openCreatePrescription, setOpenCreatePrescription] = useState(false)
	const [openUpdatePrescription, setOpenUpdatePrescription] = useState(false)

	const { auth } = useAuth()
	const role = auth?.role

	const {
		loading,
		data: medicalHistory,
		setData: setMedicalHistory,
	} = useFetch(`/medical-history/${id}`, {}, [id])

	const updateMedicalHistory = useAxiosSubmit({
		url: `${ApiUrls.MEDICAL_HISTORY.MANAGEMENT.INDEX}/${medicalHistory?.id}`,
		method: 'PUT',
	})
	const completeMedicalHistory = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.COMPLETE(id),
		method: 'PUT',
	})

	const addNewMedicalHistoryService = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.MEDICAL_HISTORY_DETAIL(id),
		method: 'POST',
	})
	const deleteMedicalHistoryService = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.MEDICAL_HISTORY_DETAIL(id, selectedMedicalServiceId),
		method: 'DELETE',
	})

	const createComplaint = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.CREATE_COMPLAINT(id),
		method: 'POST',
	})
	const responseAsDraftComplaint = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.COMPLAINT.DRAFT(id),
		method: 'PUT',
	})
	const responseAsResolveComplaint = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.COMPLAINT.RESOLVE(id),
		method: 'PUT',
	})
	const closeComplaint = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.COMPLAINT.CLOSE(id),
		method: 'PUT',
	})

	const createPrescription = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.PRESCRIPTION(id),
		method: 'POST',
	})
	const updatePrescription = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.PRESCRIPTION(id),
		method: 'PUT',
	})

	const isDoctorRole = role === 'Doctor'

	const isDraftStatus = medicalHistory?.medicalHistoryStatus === 'Draft'
	const isProcessedStatus = medicalHistory?.medicalHistoryStatus === 'Processed'
	const isPaidStatus = medicalHistory?.medicalHistoryStatus === 'Paid'

	return (
		<Box sx={{ p: 3 }}>
			<Stack spacing={2}>
				<MedicalHistoryDetailHeaderInfoSection
					medicalHistory={medicalHistory}
					onClickPatientInfo={() => setOpenPatientInfo(true)}
					onClickDoctorInfo={() => setOpenDoctorInfo(true)}
				/>

				<Fade>
					<MedicalHistoryDetailServiceSection
						medicalHistoryDetails={medicalHistory?.medicalHistoryDetails}
						medicalHistoryStatus={medicalHistory?.medicalHistoryStatus}
						role={role}
						onOpenCreateMedicalHistoryService={() => setOpenAddMedicalHistoryService(true)}
						onDeleteMedicalHistoryService={async (medicalServiceId) => {
							setSelectedMedicalServiceId(medicalServiceId)
							const response = await deleteMedicalHistoryService.submit()
							if (response) {
								setSelectedMedicalServiceId(0)
								setMedicalHistory((prev) => ({
									...prev,
									medicalHistoryDetails: prev.medicalHistoryDetails.filter(
										(item) => item.medicalServiceId !== medicalServiceId
									),
								}))
							}
						}}
					/>
				</Fade>

				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6 }}>
						<Slide direction='left'>
							<MedicalHistoryDetailPrescriptionSection
								prescription={medicalHistory?.prescription}
								medicalHistoryStatus={medicalHistory?.medicalHistoryStatus}
								role={role}
								onClickCreatePrescription={() => setOpenCreatePrescription(true)}
								onClickUpdatePrescription={() => setOpenUpdatePrescription(true)}
								onClickPrintPrescription={() => {}}
							/>
						</Slide>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<Slide direction='right'>
							<MedicalHistoryDetailComplaintSection
								complaint={medicalHistory?.complaint}
								role={role}
								onClickCreateComplaint={() => setOpenCreateComplaint(true)}
								onClickRespondComplaint={() => setOpenRespondComplaint(true)}
							/>
						</Slide>
					</Grid>
				</Grid>

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
								<Button
									variant='outlined'
									color='success'
									onClick={() => setOpenUpdateMedicalHistory(true)}
								>
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
									onConfirm={async () => {
										var response = await completeMedicalHistory.submit()
										if (response) {
											setMedicalHistory((prev) => ({
												...prev,
												medicalHistoryStatus: 'Completed',
											}))
										}
									}}
								>
									{t('medical_history.button.complete_medical_history')}
								</ConfirmationButton>
							</>
						)}
						{isProcessedStatus && (
							<Button variant='contained'>{t('medical_history.button.payment')}</Button>
						)}
						{isPaidStatus && (
							<Button variant='contained'>{t('medical_history.button.print_invoice')}</Button>
						)}
					</Stack>
				</Paper>
			</Stack>

			<PatientInfoDialog
				open={openPatientInfo}
				onClose={() => setOpenPatientInfo(false)}
				patientInfo={medicalHistory?.patient}
			/>
			<DoctorInfoDialog
				open={openDoctorInfo}
				onClose={() => setOpenDoctorInfo(false)}
				doctorInfo={medicalHistory?.doctor}
			/>
			<UpdateMedicalHistoryDialog
				open={openUpdateMedicalHistory}
				onClose={() => setOpenUpdateMedicalHistory(false)}
				medicalHistory={medicalHistory}
				onSubmit={async (values) => {
					const response = await updateMedicalHistory.submit(values)
					if (response) {
						setOpenUpdateMedicalHistory(false)
						setMedicalHistory((prev) => ({
							...prev,
							diagnosis: values.diagnosis,
							followUpAppointmentDate: values.followUpAppointmentDate,
						}))
					}
				}}
			/>
			<CreateComplaintDialog
				open={openCreateComplaint}
				onClose={() => setOpenCreateComplaint(false)}
				onSubmit={async (values) => {
					const response = await createComplaint.submit(values)
					if (response) {
						setOpenCreateComplaint(false)
						setMedicalHistory((prev) => ({
							...prev,
							complaint: response,
						}))
					}
				}}
			/>
			<RespondComplaintDialog
				open={openRespondComplaint}
				onClose={() => setOpenRespondComplaint(false)}
				onSubmit={async (values) => {
					const response = await responseAsResolveComplaint.submit(values)
					if (response) {
						setOpenRespondComplaint(false)
						setMedicalHistory((prev) => ({
							...prev,
							complaint: { ...prev.complaint, response: values.response, status: 'Resolved' },
						}))
					}
				}}
				onSaveDraft={async (values) => {
					const response = await responseAsDraftComplaint.submit(values)
					if (response) {
						setOpenRespondComplaint(false)
						setMedicalHistory((prev) => ({
							...prev,
							complaint: { ...prev.complaint, response: values.response, status: 'Draft' },
						}))
					}
				}}
				onCloseComplaint={async () => {
					const response = await closeComplaint.submit()
					if (response) {
						setOpenRespondComplaint(false)
						setMedicalHistory((prev) => ({
							...prev,
							complaint: { ...prev.complaint, status: 'Closed' },
						}))
					}
				}}
			/>
			<UpsertPrescriptionDialog
				open={openCreatePrescription}
				onClose={() => setOpenCreatePrescription(false)}
				onSubmit={async (values) => {
					const response = await createPrescription.submit(values)
					if (response) {
						setOpenCreatePrescription(false)
						setMedicalHistory((prev) => ({
							...prev,
							prescription: response,
						}))
					}
				}}
			/>
			<UpsertPrescriptionDialog
				open={openUpdatePrescription}
				initialValues={medicalHistory?.prescription}
				onClose={() => setOpenUpdatePrescription(false)}
				onSubmit={async (values) => {
					const response = await updatePrescription.submit(values)
					if (response) {
						setOpenUpdatePrescription(false)
						setMedicalHistory((prev) => ({
							...prev,
							prescription: response,
						}))
					}
				}}
			/>
			<CreateMedicalHistoryDetailDialog
				open={openAddMedicalHistoryService}
				onClose={() => setOpenAddMedicalHistoryService(false)}
				onSubmit={async (values) => {
					const response = await addNewMedicalHistoryService.submit(values)
					if (response) {
						setOpenAddMedicalHistoryService(false)
						setMedicalHistory((prev) => {
							const exists = prev.medicalHistoryDetails.some(
								(item) => item.medicalServiceId === response.medicalServiceId
							)
							if (exists) {
								return {
									...prev,
									medicalHistoryDetails: prev.medicalHistoryDetails.map((item) =>
										item.medicalServiceId === response.medicalServiceId ? response : item
									),
								}
							}
							return {
								...prev,
								medicalHistoryDetails: [...prev.medicalHistoryDetails, response],
							}
						})
					}
				}}
			/>
		</Box>
	)
}

export default MedicalHistoryDetailBasePage
