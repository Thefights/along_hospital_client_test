import PatientInfoDialog from '@/components/dialogs/PatientInfoDialog'
import EmptyBox from '@/components/placeholders/EmptyBox'
import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setPatientsStore } from '@/redux/reducers/managementReducer'
import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateMedicalHistoryCardSection from './sections/CreateMedicalHistoryCardSection'
import CreateMedicalHistoryFooterSection from './sections/CreateMedicalHistoryFooterSection'
import CreateMedicalHistoryHeaderSection from './sections/CreateMedicalHistoryHeaderSection'
import CreateMedicalHistoryPatientSummarySection from './sections/CreateMedicalHistoryPatientSummarySection'
import CreateMedicalHistoryPreviewSection from './sections/CreateMedicalHistoryPreviewSection'
import CreateMedicalHistorySearchPatientSection from './sections/CreateMedicalHistorySearchPatientSection'

export default function CreateMedicalHistoryPage() {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const [selectedId, setSelectedId] = useState(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [openCreatePatientDialog, setOpenCreatePatientDialog] = useState(false)

	const patientsStore = useReduxStore({
		url: ApiUrls.PATIENT.MANAGEMENT.GET_ALL,
		selector: (state) => state.management.patients,
		setStore: setPatientsStore,
	})

	const patients = useMemo(() => {
		if (!searchTerm) return patientsStore.data || []
		const lowerSearchTerm = searchTerm.toLowerCase()
		return patientsStore.data.filter(
			(p) =>
				(p.name && p.name.toLowerCase().includes(lowerSearchTerm)) ||
				(p.phone && p.phone.toLowerCase().includes(lowerSearchTerm)) ||
				(p.email && p.email.toLowerCase().includes(lowerSearchTerm))
		)
	}, [patientsStore.data, searchTerm])

	const selectedPatient = useMemo(
		() => patients.find((p) => p.id === selectedId) || null,
		[patients, selectedId]
	)

	const createPatient = useAxiosSubmit({
		url: ApiUrls.PATIENT.MANAGEMENT.INDEX,
		method: 'POST',
		onSuccess: async (response) => {
			const newPatient = response.data
			setPatientsStore((prev) => [...prev, newPatient])
		},
	})

	const createMedicalHistory = useAxiosSubmit({
		url: ApiUrls.MEDICAL_HISTORY.MANAGEMENT.INDEX,
		method: 'POST',
		data: {
			patientId: selectedId,
		},
		onSuccess: async (response) => {
			const medicalHistoryId = response.data.id
			navigate(routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.MEDICAL_HISTORY.DETAIL(medicalHistoryId)))
		},
	})

	return (
		<Box sx={{ p: 2, bgcolor: 'gradients.background', minHeight: '100vh' }}>
			<CreateMedicalHistoryHeaderSection />

			<Grid container spacing={2}>
				<Grid size={{ xs: 12, md: 7 }}>
					<CreateMedicalHistorySearchPatientSection
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						onCreateNewPatientClick={() => setOpenCreatePatientDialog(true)}
					/>
					<Paper variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
						<Stack spacing={1.2}>
							<Typography variant='subtitle2'>{t('text.result')}:</Typography>
							<Divider />
							<Stack
								spacing={1.2}
								sx={{
									maxHeight: 500,
									overflowY: 'auto',
									pr: 1,
								}}
							>
								{patients.length === 0 ? (
									<EmptyBox />
								) : (
									patients.map((p) => (
										<CreateMedicalHistoryCardSection
											key={p.id}
											item={p}
											selected={selectedId === p.id}
											onSelect={() => setSelectedId(p.id)}
										/>
									))
								)}
							</Stack>
						</Stack>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 5 }}>
					<Stack spacing={2}>
						<CreateMedicalHistoryPatientSummarySection patient={selectedPatient} />
						<CreateMedicalHistoryPreviewSection />
					</Stack>
				</Grid>
			</Grid>

			<CreateMedicalHistoryFooterSection
				selectedPatient={selectedPatient}
				onCreateMedicalHistoryClick={async () => await createMedicalHistory.submit()}
				onCancelClick={() =>
					navigate(routeUrls.BASE_ROUTE.DOCTOR(routeUrls.DOCTOR.MEDICAL_HISTORY.INDEX))
				}
			/>

			<PatientInfoDialog
				open={openCreatePatientDialog}
				onClose={() => setOpenCreatePatientDialog(false)}
				isEditable={true}
				onSave={async (data) => await createPatient.submit(data)}
			/>
		</Box>
	)
}
