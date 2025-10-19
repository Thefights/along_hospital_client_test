import { ApiUrls } from '@/configs/apiUrls'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import { Box, Button, Grid, Paper, Stack } from '@mui/material'
import { useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal'
import { useParams } from 'react-router-dom'
import DoctorInfoDialog from '../dialogs/DoctorInfoDialog'
import PatientInfoDialog from '../dialogs/PatientInfoDialog'
import CreateComplaintDialog from './sections/medicalHistoryDetailSections/dialogs/CreateComplaintDialog'
import CreateMedicalHistoryDetailDialog from './sections/medicalHistoryDetailSections/dialogs/CreateMedicalHistoryDetailDialog'
import RespondComplaintDialog from './sections/medicalHistoryDetailSections/dialogs/RespondComplaintDialog'
import UpsertPrescriptionDialog from './sections/medicalHistoryDetailSections/dialogs/UpsertPrescriptionDialog'
import MedicalHistoryDetailComplaintSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailComplaintSection'
import MedicalHistoryDetailHeaderInfoSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailHeaderInfoSection'
import MedicalHistoryDetailPrescriptionSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailPrescriptionSection'
import MedicalHistoryDetailServiceSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailServiceSection'

const MedicalHistoryDetailBasePage = () => {
	const { id } = useParams()

	const [selectedMedicalServiceId, setSelectedMedicalServiceId] = useState(0)

	const [openPatientInfo, setOpenPatientInfo] = useState(false)
	const [openDoctorInfo, setOpenDoctorInfo] = useState(false)
	const [openCreateComplaint, setOpenCreateComplaint] = useState(false)
	const [openRespondComplaint, setOpenRespondComplaint] = useState(false)
	const [openCreatePrescription, setOpenCreatePrescription] = useState(false)
	const [openUpdatePrescription, setOpenUpdatePrescription] = useState(false)
	const [openCreateMedicalHistoryService, setOpenCreateMedicalHistoryService] = useState(false)

	const { auth } = useAuth()
	const role = auth?.role

	const {
		loading,
		data: medicalHistory,
		fetch: reFetchMedicalHistory,
	} = useFetch(`/medical-history/${id}`, {}, [id])

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
						onOpenCreateMedicalHistoryService={() => setOpenCreateMedicalHistoryService(true)}
						onDeleteMedicalHistoryService={async (medicalServiceId) => {
							setSelectedMedicalServiceId(medicalServiceId)
							const response = await deleteMedicalHistoryService.submit()
							if (response) {
								setSelectedMedicalServiceId(0)
								await reFetchMedicalHistory()
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
						{role === 'Doctor' && (
							<Button variant='contained' color='success'>
								Complete Medical History
							</Button>
						)}
						{medicalHistory?.medicalHistoryStatus === 'Processed' && (
							<Button variant='contained'>Payment</Button>
						)}
						{medicalHistory?.medicalHistoryStatus === 'Paid' && (
							<Button variant='contained'>Print Invoice</Button>
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
			<CreateComplaintDialog
				open={openCreateComplaint}
				onClose={() => setOpenCreateComplaint(false)}
				onSubmit={async (values) => {
					const response = await createComplaint.submit(values)
					if (response) {
						setOpenCreateComplaint(false)
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
					}
				}}
				onSaveDraft={async (values) => {
					const response = await responseAsDraftComplaint.submit(values)
					if (response) {
						setOpenRespondComplaint(false)
					}
				}}
				onCloseComplaint={async () => {
					const response = await closeComplaint.submit()
					if (response) {
						setOpenRespondComplaint(false)
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
					}
				}}
			/>
			<CreateMedicalHistoryDetailDialog
				open={openCreateMedicalHistoryService}
				onClose={() => setOpenCreateMedicalHistoryService(false)}
				onSubmit={async (values) => {
					const response = await addNewMedicalHistoryService.submit(values)
					if (response) {
						setOpenCreateMedicalHistoryService(false)
					}
				}}
			/>
		</Box>
	)
}

export default MedicalHistoryDetailBasePage
