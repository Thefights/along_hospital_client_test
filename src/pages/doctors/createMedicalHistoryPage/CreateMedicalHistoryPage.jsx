import { EnumConfig } from '@/configs/enumConfig'
import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import CreateMedicalHistoryCardSection from './sections/CreateMedicalHistoryCardSection'
import CreateMedicalHistoryFooterSection from './sections/CreateMedicalHistoryFooterSection'
import CreateMedicalHistoryHeaderSection from './sections/CreateMedicalHistoryHeaderSection'
import CreateMedicalHistoryPatientSummarySection from './sections/CreateMedicalHistoryPatientSummarySection'
import CreateMedicalHistoryPreviewSection from './sections/CreateMedicalHistoryPreviewSection'
import CreateMedicalHistorySearchPatientSection from './sections/CreateMedicalHistorySearchPatientSection'

export default function CreateMedicalHistoryPage() {
	const [selectedId, setSelectedId] = useState(null)
	const patients = useMemo(
		() => [
			{
				id: 1,
				name: 'Nguyễn Văn A',
				phone: '0901 234 567',
				email: 'a.nguyen@example.com',
				gender: 'Male',
				dateOfBirth: '1990-05-12',
				address: '12 Nguyễn Trãi, Q.1, TP.HCM',
				image: '',
				medicalNumber: 'MH-000123',
				height: 172,
				weight: 68.5,
				bloodType: 'O',
				allergies: [
					{
						id: 11,
						name: 'Penicillin',
						severityLevel: EnumConfig.AllergySeverity.Severe,
						reaction: 'Phát ban',
					},
					{
						id: 12,
						name: 'Hải sản',
						severityLevel: EnumConfig.AllergySeverity.Moderate,
						reaction: 'Ngứa',
					},
					{
						id: 13,
						name: 'Phấn hoa',
						severityLevel: EnumConfig.AllergySeverity.Mild,
						reaction: 'Hắt hơi',
					},
				],
			},
			{
				id: 2,
				name: 'Trần Thị B',
				phone: '0912 345 678',
				email: 'b.tran@example.com',
				gender: 'Female',
				dateOfBirth: '1995-11-02',
				address: '45 Lê Lợi, Q.3, TP.HCM',
				image: '',
				medicalNumber: 'MH-000456',
				height: 160,
				weight: 52,
				bloodType: 'A',
				allergies: [],
			},
			{
				id: 3,
				name: 'Phạm Minh C',
				phone: '',
				email: '',
				gender: 'Male',
				dateOfBirth: '1988-02-22',
				address: '',
				image: '',
				medicalNumber: 'MH-000789',
				height: null,
				weight: null,
				bloodType: 'B',
				allergies: [{ id: 31, name: 'Bụi mịn', severityLevel: 'Low', reaction: '' }],
			},
		],
		[]
	)
	const selectedPatient = useMemo(
		() => patients.find((p) => p.id === selectedId) || null,
		[patients, selectedId]
	)

	return (
		<Box sx={{ p: 2, bgcolor: 'gradients.background', minHeight: '100vh' }}>
			<CreateMedicalHistoryHeaderSection />

			<Grid container spacing={2}>
				<Grid size={{ xs: 12, md: 7 }}>
					<CreateMedicalHistorySearchPatientSection />

					<Paper variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
						<Stack spacing={1.2}>
							<Typography variant='subtitle2'>Kết quả</Typography>
							<Divider />
							<Stack spacing={1.2}>
								{patients.map((p) => (
									<CreateMedicalHistoryCardSection
										key={p.id}
										item={p}
										selected={selectedId === p.id}
										onSelect={() => setSelectedId(p.id)}
									/>
								))}
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

			<CreateMedicalHistoryFooterSection selectedPatient={selectedPatient} />
		</Box>
	)
}
