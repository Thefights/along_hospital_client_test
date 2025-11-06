import { Container, Stack } from '@mui/material'
import HeaderCardSection from './sections/ProfileHeaderCardSection'
import InfoTabSection from './sections/ProfileInfoTabSection'

const ViewProfileBasePage = ({
	profile = {},
	role,
	loading = false,
	editMode = false,
	formValues = {},
	onFieldChange,
	onFieldHandleChange,
	onFieldRegisterRef,
	submitted = false,
	onEdit,
	onCancel,
	onSave,
	saving = false,
}) => {
	return (
		<Container maxWidth='xl' sx={{ py: 3 }}>
			<Stack spacing={3}>
				<HeaderCardSection
					profile={profile}
					role={role}
					editMode={editMode}
					formValues={formValues}
					onFieldChange={onFieldChange}
					onEdit={onEdit}
					onCancel={onCancel}
					onSave={onSave}
					saving={saving}
					loading={loading}
				/>

				<InfoTabSection
					profile={profile}
					role={role}
					editMode={editMode}
					formValues={formValues}
					onFieldChange={onFieldChange}
					onFieldHandleChange={onFieldHandleChange}
					onFieldRegisterRef={onFieldRegisterRef}
					submitted={submitted}
					loading={loading}
				/>
			</Stack>
		</Container>
	)
}

export default ViewProfileBasePage
