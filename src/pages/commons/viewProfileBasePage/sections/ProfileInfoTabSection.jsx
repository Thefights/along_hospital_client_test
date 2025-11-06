import DrawerInfoRow from '@/components/infoRows/DrawerInfoRow'
import SkeletonBox from '@/components/skeletons/SkeletonBox'
import { EnumConfig } from '@/configs/enumConfig'
import useEnum from '@/hooks/useEnum'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import useTranslation from '@/hooks/useTranslation'
import { formatDateToDDMMYYYY } from '@/utils/formatDateUtil'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { Grid, Paper, Stack } from '@mui/material'

const InfoTabSection = ({
	profile,
	role,
	editMode = false,
	formValues = {},
	onFieldChange,
	onFieldHandleChange,
	onFieldRegisterRef,
	submitted = false,
	loading = false,
}) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const isDoctor = role === EnumConfig.Role.Doctor
	const isPatient = role === EnumConfig.Role.Patient

	const { renderField } = useFieldRenderer(
		formValues,
		onFieldChange,
		onFieldHandleChange,
		onFieldRegisterRef,
		submitted,
		'outlined',
		'medium'
	)

	const genderLabel = editMode
		? formValues.gender
			? getEnumLabelByValue(_enum.genderOptions, formValues.gender) || formValues.gender
			: '-'
		: profile?.gender
		? getEnumLabelByValue(_enum.genderOptions, profile.gender) || profile.gender
		: '-'

	const fields = [
		{
			key: 'name',
			title: t('profile.field.name'),
			type: 'text',
			required: false,
		},
		{
			key: 'dateOfBirth',
			title: t('profile.field.date_of_birth'),
			type: 'date',
			required: false,
			maxValue: new Date().toISOString().split('T')[0],
		},
		{
			key: 'gender',
			title: t('profile.field.gender'),
			type: 'select',
			options: _enum.genderOptions,
			required: false,
		},
		{
			key: 'address',
			title: t('profile.field.address'),
			type: 'text',
			required: false,
		},
	]

	if (loading) {
		return (
			<Paper sx={{ p: 3, borderRadius: 2 }}>
				<SkeletonBox numberOfBoxes={4} heights={[50, 50, 50, 50]} />
			</Paper>
		)
	}

	return (
		<Paper sx={{ p: 3, borderRadius: 2 }}>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Stack spacing={2.5}>
						{editMode ? (
							renderField(fields.find((f) => f.key === 'name'))
						) : (
							<DrawerInfoRow label={t('profile.field.name')} value={profile?.name || '-'} />
						)}
						{editMode ? (
							renderField(fields.find((f) => f.key === 'dateOfBirth'))
						) : (
							<DrawerInfoRow
								label={t('profile.field.date_of_birth')}
								value={formatDateToDDMMYYYY(profile?.dateOfBirth) || '-'}
							/>
						)}
						{editMode ? (
							renderField(fields.find((f) => f.key === 'gender'))
						) : (
							<DrawerInfoRow label={t('profile.field.gender')} value={genderLabel} />
						)}
					</Stack>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Stack spacing={2.5}>
						<DrawerInfoRow label={t('profile.field.email')} value={profile?.email || '-'} />
						<DrawerInfoRow label={t('profile.field.phone')} value={profile?.phone || '-'} />
						{editMode ? (
							renderField(fields.find((f) => f.key === 'address'))
						) : (
							<DrawerInfoRow label={t('profile.field.address')} value={profile?.address || '-'} />
						)}
					</Stack>
				</Grid>
				{isDoctor && (
					<>
						<Grid size={{ xs: 12, md: 6 }}>
							<Stack spacing={2.5}>
								<DrawerInfoRow
									label={t('profile.field.qualification')}
									value={profile?.qualification || '-'}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<Stack spacing={2.5}>
								<DrawerInfoRow label={t('profile.field.specialty')} value={profile?.specialtyName || '-'} />
							</Stack>
						</Grid>
					</>
				)}
				{isPatient && (
					<>
						<Grid size={{ xs: 12, md: 6 }}>
							<Stack spacing={2.5}>
								<DrawerInfoRow
									label={t('profile.field.medical_number')}
									value={profile?.medicalNumber || '-'}
								/>
								<DrawerInfoRow
									label={t('profile.field.height')}
									value={profile?.height ? `${profile.height} cm` : '-'}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<Stack spacing={2.5}>
								<DrawerInfoRow
									label={t('profile.field.weight')}
									value={profile?.weight ? `${profile.weight} kg` : '-'}
								/>
								<DrawerInfoRow label={t('profile.field.blood_type')} value={profile?.bloodType || '-'} />
							</Stack>
						</Grid>
					</>
				)}
			</Grid>
		</Paper>
	)
}

export default InfoTabSection
