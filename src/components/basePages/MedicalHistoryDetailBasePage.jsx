import useAuth from '@/hooks/useAuth'
import useFetch from '@/hooks/useFetch'
import { Box, Button, Grid, Paper, Stack } from '@mui/material'
import { useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal'
import { useParams } from 'react-router-dom'
import DoctorInfoDialog from '../dialogs/DoctorInfoDialog'
import PatientInfoDialog from '../dialogs/PatientInfoDialog'
import CreateComplaintDialog from './sections/medicalHistoryDetailSections/dialogs/CreateComplaintDialog'
import CreateMedicalHistoryServiceDialog from './sections/medicalHistoryDetailSections/dialogs/CreateMedicalHistoryServiceDialog'
import RespondComplaintDialog from './sections/medicalHistoryDetailSections/dialogs/RespondComplaintDialog'
import UpsertPrescriptionDialog from './sections/medicalHistoryDetailSections/dialogs/UpsertPrescriptionDialog'
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
	const [openCreatePrescription, setOpenCreatePrescription] = useState(false)
	const [openUpdatePrescription, setOpenUpdatePrescription] = useState(false)
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

				<Fade>
					<MedicalHistoryDetailServiceSection
						medicalHistoryDetails={medicalHistory?.medicalHistoryDetails}
						medicalHistoryStatus={medicalHistory?.medicalHistoryStatus}
						role={role}
						onClickCreateMedicalHistoryService={() => setOpenCreateMedicalHistoryService(true)}
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
			/>
			<RespondComplaintDialog
				open={openRespondComplaint}
				onClose={() => setOpenRespondComplaint(false)}
			/>
			<UpsertPrescriptionDialog
				open={openCreatePrescription}
				onClose={() => setOpenCreatePrescription(false)}
			/>
			<UpsertPrescriptionDialog
				open={openUpdatePrescription}
				onClose={() => setOpenUpdatePrescription(false)}
			/>
			<CreateMedicalHistoryServiceDialog
				open={openCreateMedicalHistoryService}
				onClose={() => setOpenCreateMedicalHistoryService(false)}
			/>
		</Box>
	)
}

export default MedicalHistoryDetailBasePage
