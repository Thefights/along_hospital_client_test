import EmptyPage from '@/components/placeholders/EmptyPage'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useConfirm } from '@/hooks/useConfirm'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Box, Grid, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal'
import { useParams } from 'react-router-dom'
import DoctorInfoDialog from '../../dialogs/DoctorInfoDialog'
import PatientInfoDialog from '../../dialogs/PatientInfoDialog'
import CreateComplaintDialog from './sections/dialogs/CreateComplaintDialog'
import CreateMedicalHistoryDetailDialog from './sections/dialogs/CreateMedicalHistoryDetailDialog'
import RespondComplaintDialog from './sections/dialogs/RespondComplaintDialog'
import UpdateMedicalHistoryDialog from './sections/dialogs/UpdateMedicalHistoryDialog'
import UpsertPrescriptionDialog from './sections/dialogs/UpsertPrescriptionDialog'
import MedicalHistoryDetailComplaintSection from './sections/MedicalHistoryDetailComplaintSection'
import MedicalHistoryDetailFooterSection from './sections/MedicalHistoryDetailFooterSection'
import MedicalHistoryDetailHeaderInfoSection from './sections/MedicalHistoryDetailHeaderInfoSection'
import MedicalHistoryDetailPrescriptionSection from './sections/MedicalHistoryDetailPrescriptionSection'
import MedicalHistoryDetailServiceSection from './sections/MedicalHistoryDetailServiceSection'

const MedicalHistoryDetailBasePage = ({ fetchUrl = ApiUrls.MEDICAL_HISTORY.INDEX }) => {
	const { id } = useParams()

	const { t } = useTranslation()
	const confirm = useConfirm()

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
	const isDoctor = role === EnumConfig.Role.Doctor

	const {
		loading,
		data: medicalHistory,
		setData: setMedicalHistory,
	} = useFetch(`${fetchUrl}/${id}`, {}, [id])

	const getPaymentUrl = useFetch(ApiUrls.MEDICAL_HISTORY.MANAGEMENT.PAYMENT_URL(id), {}, [], false)

	useEffect(() => {
		if (getPaymentUrl.data) {
			window.open(getPaymentUrl.data, '_blank')
		}
	}, [getPaymentUrl.data])

	// API Operations for medical history
	const updateMedicalHistory = useAxiosSubmit({
		url: `${ApiUrls.MEDICAL_HISTORY.MANAGEMENT.INDEX}/${medicalHistory?.id}`,
		method: 'PUT',
	})
	const completeMedicalHistory = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.COMPLETE(id),
		method: 'PUT',
	})

	// API Operations for Medical history detail services
	const addNewMedicalHistoryService = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.MEDICAL_HISTORY_DETAIL(id),
		method: 'POST',
		onSuccess: (response) => {
			setOpenAddMedicalHistoryService(false)
			setMedicalHistory((prev) => {
				const exists = prev.medicalHistoryDetails.some(
					(item) => item.medicalServiceId === response.medicalServiceId
				)
				if (exists) {
					return {
						...prev,
						medicalHistoryDetails: prev.medicalHistoryDetails.map((item) =>
							item.medicalServiceId === response.medicalServiceId ? response.data : item
						),
					}
				}
				return {
					...prev,
					medicalHistoryDetails: [...prev.medicalHistoryDetails, response.data],
				}
			})
		},
	})
	const deleteMedicalHistoryService = useAxiosSubmit({
		method: 'DELETE',
	})

	// API Operations for Complaint
	const createComplaint = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.CREATE_COMPLAINT(id),
		method: 'POST',
		onSuccess: (response) => {
			setOpenCreateComplaint(false)
			setMedicalHistory((prev) => ({
				...prev,
				complaint: response.data,
			}))
		},
	})
	const responseAsDraftComplaint = useAxiosSubmit({
		url: ApiUrls.COMPLAINT.MANAGEMENT.DRAFT(id),
		method: 'PUT',
	})
	const responseAsResolveComplaint = useAxiosSubmit({
		url: ApiUrls.COMPLAINT.MANAGEMENT.RESOLVE(id),
		method: 'PUT',
	})
	const closeComplaint = useAxiosSubmit({
		url: ApiUrls.COMPLAINT.MANAGEMENT.CLOSE(id),
		method: 'PUT',
		onSuccess: () => {
			setOpenRespondComplaint(false)
			setMedicalHistory((prev) => ({
				...prev,
				complaint: { ...prev.complaint, status: EnumConfig.ComplaintResolveStatus.Closed },
			}))
		},
	})

	// API Operations for Prescription
	const createPrescription = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.PRESCRIPTION(id),
		method: 'POST',
		onSuccess: (response) => {
			setOpenCreatePrescription(false)
			setMedicalHistory((prev) => ({
				...prev,
				prescription: response.data,
			}))
		},
	})
	const updatePrescription = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.PRESCRIPTION(id),
		method: 'PUT',
		onSuccess: (response) => {
			setOpenUpdatePrescription(false)
			setMedicalHistory((prev) => ({
				...prev,
				prescription: response.data,
			}))
		},
	})

	// API Operations for Patient Info
	const updatePatientInfo = useAxiosSubmit({
		url: ApiUrls.PATIENT.MANAGEMENT.DETAIL(medicalHistory?.patient.id),
		method: 'PUT',
		onSuccess: (response) => {
			setMedicalHistory((prev) => ({
				...prev,
				patient: response.data,
			}))
		},
	})

	if (!loading && !medicalHistory) {
		return <EmptyPage showButton />
	}

	return (
		<Box sx={{ p: 3 }}>
			<Stack spacing={2}>
				<MedicalHistoryDetailHeaderInfoSection
					medicalHistory={medicalHistory}
					onClickPatientInfo={() => setOpenPatientInfo(true)}
					onClickDoctorInfo={() => setOpenDoctorInfo(true)}
					loading={loading}
				/>

				<Fade triggerOnce>
					<MedicalHistoryDetailServiceSection
						medicalHistoryDetails={medicalHistory?.medicalHistoryDetails}
						medicalHistoryStatus={medicalHistory?.medicalHistoryStatus}
						role={role}
						loading={loading}
						onOpenCreateMedicalHistoryService={() => setOpenAddMedicalHistoryService(true)}
						onDeleteMedicalHistoryService={async (medicalServiceId) => {
							const response = await deleteMedicalHistoryService.submit(undefined, {
								overrideUrl: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.MEDICAL_HISTORY_DETAIL(
									id,
									medicalServiceId
								),
							})
							if (response) {
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
						<Slide direction='left' triggerOnce>
							<MedicalHistoryDetailPrescriptionSection
								prescription={medicalHistory?.prescription}
								medicalHistoryStatus={medicalHistory?.medicalHistoryStatus}
								role={role}
								loading={loading}
								onClickCreatePrescription={() => setOpenCreatePrescription(true)}
								onClickUpdatePrescription={() => setOpenUpdatePrescription(true)}
								onClickPrintPrescription={() => {}}
							/>
						</Slide>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<Slide direction='right' triggerOnce>
							<MedicalHistoryDetailComplaintSection
								complaint={medicalHistory?.complaint}
								role={role}
								loading={loading}
								onClickCreateComplaint={() => setOpenCreateComplaint(true)}
								onClickRespondComplaint={() => setOpenRespondComplaint(true)}
							/>
						</Slide>
					</Grid>
				</Grid>

				{medicalHistory && (
					<MedicalHistoryDetailFooterSection
						role={role}
						medicalHistoryStatus={medicalHistory?.medicalHistoryStatus}
						onClickUpdateMedicalHistory={() => setOpenUpdateMedicalHistory(true)}
						onClickPayment={async () => await getPaymentUrl.fetch()}
						onClickCompleteMedicalHistory={async () => {
							var response = await completeMedicalHistory.submit()
							if (response) {
								setMedicalHistory((prev) => ({
									...prev,
									medicalHistoryStatus: EnumConfig.MedicalHistoryStatus.Processed,
								}))
							}
						}}
						loadingPayment={getPaymentUrl.loading}
					/>
				)}
			</Stack>

			{medicalHistory?.patient && (
				<PatientInfoDialog
					open={openPatientInfo}
					onClose={() => setOpenPatientInfo(false)}
					patientInfo={medicalHistory?.patient}
					loading={updatePatientInfo.loading}
					isEditable={isDoctor}
					onSave={async (values) => await updatePatientInfo.submit(values)}
				/>
			)}
			{medicalHistory?.doctor && (
				<DoctorInfoDialog
					open={openDoctorInfo}
					onClose={() => setOpenDoctorInfo(false)}
					doctorInfo={medicalHistory?.doctor}
				/>
			)}
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
				onSubmit={async (values) => await createComplaint.submit(values)}
			/>
			<RespondComplaintDialog
				open={openRespondComplaint}
				onClose={() => setOpenRespondComplaint(false)}
				initialResponse={medicalHistory?.complaint?.response}
				onSubmit={async (values) => {
					const response = await responseAsResolveComplaint.submit(values)
					if (response) {
						setOpenRespondComplaint(false)
						setMedicalHistory((prev) => ({
							...prev,
							complaint: {
								...prev.complaint,
								response: values.response,
								status: EnumConfig.ComplaintResolveStatus.Resolved,
							},
						}))
					}
				}}
				onSaveDraft={async (values) => {
					const response = await responseAsDraftComplaint.submit(values)
					if (response) {
						setOpenRespondComplaint(false)
						setMedicalHistory((prev) => ({
							...prev,
							complaint: {
								...prev.complaint,
								response: values.response,
								status: EnumConfig.ComplaintResolveStatus.Draft,
							},
						}))
					}
				}}
				onCloseComplaint={async () => {
					const isConfirmed = await confirm({
						title: t('complaint.dialog.confirm.close_complaint_title'),
						description: t('complaint.dialog.confirm.close_complaint_description'),
						confirmColor: 'error',
						confirmText: t('button.close'),
					})

					if (isConfirmed) {
						await closeComplaint.submit()
					}
				}}
			/>
			<UpsertPrescriptionDialog
				open={openCreatePrescription}
				onClose={() => setOpenCreatePrescription(false)}
				onSubmit={async (values) => await createPrescription.submit(values)}
			/>
			<UpsertPrescriptionDialog
				open={openUpdatePrescription}
				initialValues={medicalHistory?.prescription}
				onClose={() => setOpenUpdatePrescription(false)}
				onSubmit={async (values) => await updatePrescription.submit(values)}
			/>
			<CreateMedicalHistoryDetailDialog
				open={openAddMedicalHistoryService}
				onClose={() => setOpenAddMedicalHistoryService(false)}
				onSubmit={async (values) => await addNewMedicalHistoryService.submit(values)}
			/>
		</Box>
	)
}

export default MedicalHistoryDetailBasePage
