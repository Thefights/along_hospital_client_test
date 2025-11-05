import ViewProfileBasePage from '@/components/basePages/viewProfileBasePage/ViewProfileBasePage'
import { ApiUrls } from '@/configs/apiUrls'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useForm } from '@/hooks/useForm'
import useReduxStore from '@/hooks/useReduxStore'
import { setProfileStore } from '@/redux/reducers/patientReducer'
import { formatDateToSqlDate } from '@/utils/formatDateUtil'
import { useEffect, useState } from 'react'

const ProfilePage = () => {
	const { auth } = useAuth()
	const [editMode, setEditMode] = useState(false)
	const [submitted, setSubmitted] = useState(false)

	const profileStore = useReduxStore({
		selector: (s) => s.patient.profile,
		setStore: setProfileStore,
	})

	const { values, setField, handleChange, reset, registerRef, validateAll } = useForm({
		name: '',
		dateOfBirth: '',
		gender: '',
		address: '',
		image: null,
	})

	useEffect(() => {
		if (profileStore.data && !editMode) {
			reset({
				name: profileStore.data.name || '',
				dateOfBirth: profileStore.data.dateOfBirth
					? formatDateToSqlDate(profileStore.data.dateOfBirth)
					: '',
				gender: profileStore.data.gender || '',
				address: profileStore.data.address || '',
				image: null,
			})
		}
	}, [profileStore.data, editMode, reset])

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
		if (profileStore.data) {
			reset({
				name: profileStore.data.name || '',
				dateOfBirth: profileStore.data.dateOfBirth
					? formatDateToSqlDate(profileStore.data.dateOfBirth)
					: '',
				gender: profileStore.data.gender || '',
				address: profileStore.data.address || '',
				image: null,
			})
		}
	}

	const handleSave = async () => {
		setSubmitted(true)
		const ok = validateAll()
		if (!ok) return

		const payload = {
			name: values.name,
			dateOfBirth: values.dateOfBirth || null,
			gender: values.gender || null,
			address: values.address || null,
		}

		if (values.image instanceof File) {
			payload.image = values.image
		}

		await updateProfile.submit(payload)
	}

	return (
		<ViewProfileBasePage
			profile={profileStore.data || {}}
			role={auth?.role}
			loading={profileStore.loading}
			editMode={editMode}
			formValues={values}
			onFieldChange={setField}
			onFieldHandleChange={handleChange}
			onFieldRegisterRef={registerRef}
			submitted={submitted}
			onEdit={handleEdit}
			onCancel={handleCancel}
			onSave={handleSave}
			saving={updateProfile.loading}
		/>
	)
}

export default ProfilePage
