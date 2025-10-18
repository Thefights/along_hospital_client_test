import useAuth from '@/hooks/useAuth'
import useFetch from '@/hooks/useFetch'
import { Box, Button, Grid, Paper, Stack } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import DoctorInfoDialog from '../dialogs/DoctorInfoDialog'
import PatientInfoDialog from '../dialogs/PatientInfoDialog'
import CreateComplaintDialog from './sections/medicalHistoryDetailSections/dialogs/CreateComplaintDialog'
import CreateMedicalHistoryServiceDialog from './sections/medicalHistoryDetailSections/dialogs/CreateMedicalHistoryServiceDialog'
import PrescriptionFormDialog from './sections/medicalHistoryDetailSections/dialogs/PrescriptionFormDialog'
import RespondComplaintDialog from './sections/medicalHistoryDetailSections/dialogs/RespondComplaintDialog'
import MedicalHistoryDetailComplaintSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailComplaintSection'
import MedicalHistoryDetailHeaderInfoSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailHeaderInfoSection'
import MedicalHistoryDetailPrescriptionSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailPrescriptionSection'
import MedicalHistoryDetailServiceSection from './sections/medicalHistoryDetailSections/MedicalHistoryDetailServiceSection'

const MedicalHistoryDetailBasePage = () => {
	const { id } = useParams()

	const [openPatientInfo, setOpenPatientInfo] = useState(false)
	const [openDoctorInfo, setOpenDoctorInfo] = useState(false)
	const [openCreateComplaint, setOpenCreateComplaint] = useState(false)
	const [openRespondComplaint, setOpenRespondComplaint] = useState(false)
	const [openPrescriptionForm, setOpenPrescriptionForm] = useState(false)
	const [openCreateMedicalHistoryService, setOpenCreateMedicalHistoryService] = useState(false)

	const { auth } = useAuth()
	const role = auth?.role
	const { loading, data: medicalHistory } = useFetch(`/medical-histories/${id}`, {}, [id])

	return (
		<Box sx={{ p: 3 }}>
			<Stack spacing={2}>
				<MedicalHistoryDetailHeaderInfoSection
					medicalHistory={medicalHistory}
					onClickPatientInfo={() => setOpenPatientInfo(true)}
					onClickDoctorInfo={() => setOpenDoctorInfo(true)}
				/>

				<MedicalHistoryDetailServiceSection
					medicalHistoryDetails={medicalHistory?.medicalHistoryDetails}
					medicalHistoryStatus={medicalHistory?.medicalHistoryStatus}
					role={role}
					onClickCreateMedicalHistoryService={() => setOpenCreateMedicalHistoryService(true)}
				/>

				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6 }}>
						<MedicalHistoryDetailPrescriptionSection
							prescription={medicalHistory?.prescription}
							medicalHistoryStatus={medicalHistory?.medicalHistoryStatus}
							role={role}
							onClickCreatePrescription={() => setOpenPrescriptionForm(true)}
							onClickPrintPrescription={() => {}}
							onClickUpdatePrescription={() => setOpenPrescriptionForm(true)}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<MedicalHistoryDetailComplaintSection
							complaint={medicalHistory?.complaint}
							role={role}
							onClickCreateComplaint={() => setOpenCreateComplaint(true)}
							onClickRespondComplaint={() => setOpenRespondComplaint(true)}
						/>
					</Grid>
				</Grid>

				<Paper
					sx={{
						position: 'sticky',
						bottom: 0,
						p: 2,
						borderTop: '1px solid',
						borderColor: 'divider',
						backgroundColor: 'background.paper',
					}}
					elevation={3}
				>
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						spacing={1.5}
						justifyContent='flex-end'
						alignItems='center'
					>
						{medicalHistory?.medicalHistoryStatus === 'Draft' && role === 'Doctor' && (
							<Button variant='contained'>Complete Medical History</Button>
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
			/>
			<RespondComplaintDialog
				open={openRespondComplaint}
				onClose={() => setOpenRespondComplaint(false)}
			/>
			<PrescriptionFormDialog
				open={openPrescriptionForm}
				onClose={() => setOpenPrescriptionForm(false)}
			/>
			<CreateMedicalHistoryServiceDialog
				open={openCreateMedicalHistoryService}
				onClose={() => setOpenCreateMedicalHistoryService(false)}
			/>
		</Box>
	)
}

export default MedicalHistoryDetailBasePage
