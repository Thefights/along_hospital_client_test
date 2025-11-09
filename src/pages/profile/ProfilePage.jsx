import { ApiUrls } from '@/configs/apiUrls'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useForm } from '@/hooks/useForm'
import useReduxStore from '@/hooks/useReduxStore'
import { setProfileStore } from '@/redux/reducers/patientReducer'
import { formatDateToSqlDate } from '@/utils/formatDateUtil'
import { Container, Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import ProfileHeaderCardSection from './sections/ProfileHeaderCardSection'
import ProfileInfoTabSection from './sections/ProfileInfoTabSection'

const ProfilePage = () => {
	const { auth } = useAuth()
	const [editMode, setEditMode] = useState(false)
	const [submitted, setSubmitted] = useState(false)

	const profileStore = useReduxStore({
		selector: (s) => s.patient.profile,
		setStore: setProfileStore,
	})

	const initialValues = useMemo(
		() => ({
			name: profileStore.data?.name || '',
			dateOfBirth: profileStore.data?.dateOfBirth
				? formatDateToSqlDate(profileStore.data.dateOfBirth)
				: '',
			gender: profileStore.data?.gender || '',
			address: profileStore.data?.address || '',
			image: null,
		}),
		[profileStore.data]
	)

	const { values, setField, handleChange, reset, registerRef, validateAll } = useForm(initialValues)

	useEffect(() => {
		if (profileStore.data && !editMode) {
			reset(initialValues)
		}
	}, [profileStore.data, editMode, reset, initialValues])

	const updateProfile = useAxiosSubmit({
		url: ApiUrls.USER.PROFILE,
		method: 'PUT',
		onSuccess: async () => {
			setEditMode(false)
			setSubmitted(false)
			await profileStore.fetch()
		},
	})

	const handleEdit = () => {
		setEditMode(true)
	}

	const handleCancel = () => {
		setEditMode(false)
		setSubmitted(false)
		reset(initialValues)
	}

	const handleSave = async () => {
		setSubmitted(true)
		const ok = validateAll()
		if (!ok) return

		const { image, ...rest } = values

		await updateProfile.submit(image instanceof File ? values : rest)
	}

	return (
		<Container maxWidth='xl' sx={{ py: 3 }}>
			<Stack spacing={3}>
				<ProfileHeaderCardSection
					profile={profileStore.data || {}}
					role={auth?.role}
					editMode={editMode}
					formValues={values}
					onFieldChange={setField}
					onEdit={handleEdit}
					onCancel={handleCancel}
					onSave={handleSave}
					saving={updateProfile.loading}
					loading={profileStore.loading}
				/>

				<ProfileInfoTabSection
					profile={profileStore.data || {}}
					role={auth?.role}
					editMode={editMode}
					formValues={values}
					onFieldChange={setField}
					onFieldHandleChange={handleChange}
					onFieldRegisterRef={registerRef}
					submitted={submitted}
					loading={profileStore.loading}
				/>
			</Stack>
		</Container>
	)
}

export default ProfilePage
