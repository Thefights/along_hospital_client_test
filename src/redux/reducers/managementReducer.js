import { ApiUrls } from '@/configs/apiUrls'
import { createSlice } from '@reduxjs/toolkit'

const initState = {
	doctors: [],
	patients: [],
	medicineCategories: [],
	departments: [],
	specialties: [],
	medicalServices: [],
	medicines: [],
	suppliers: [],
}

const managementSlice = createSlice({
	name: 'manager',
	initialState: initState,
	reducers: {
		setDoctorsStore: (state, action) => {
			state.doctors = action.payload
		},
		setPatientsStore: (state, action) => {
			state.patients = action.payload
		},
		setMedicineCategoriesStore: (state, action) => {
			state.medicineCategories = action.payload
		},
		setDepartmentsStore: (state, action) => {
			state.departments = action.payload
		},
		setSpecialtiesStore: (state, action) => {
			state.specialties = action.payload
		},
		setMedicalServicesStore: (state, action) => {
			state.medicalServices = action.payload
		},
		setMedicinesStore: (state, action) => {
			state.medicines = action.payload
		},
		setSuppliersStore: (state, action) => {
			state.suppliers = action.payload
		},
	},
})

const {
	setDoctorsStore,
	setPatientsStore,
	setMedicineCategoriesStore,
	setDepartmentsStore,
	setSpecialtiesStore,
	setMedicalServicesStore,
	setMedicinesStore,
	setSuppliersStore,
} = managementSlice.actions

setDoctorsStore.defaultUrl = ApiUrls.DOCTOR.GET_ALL
setPatientsStore.defaultUrl = ApiUrls.PATIENT.MANAGEMENT.GET_ALL // Only manager can get this
setSpecialtiesStore.defaultUrl = ApiUrls.SPECIALTY.GET_ALL
setMedicalServicesStore.defaultUrl = ApiUrls.MEDICAL_SERVICE.GET_ALL
setMedicinesStore.defaultUrl = ApiUrls.MEDICINE.GET_ALL
setDepartmentsStore.defaultUrl = ApiUrls.DEPARTMENT.MANAGEMENT.GET_ALL // Only manager can get this
setMedicineCategoriesStore.defaultUrl = ApiUrls.MEDICINE_CATEGORY.GET_ALL
setSuppliersStore.defaultUrl = ApiUrls.SUPPLIER.MANAGEMENT.GET_ALL

export {
	setDepartmentsStore,
	setDoctorsStore,
	setMedicalServicesStore,
	setMedicineCategoriesStore,
	setMedicinesStore,
	setPatientsStore,
	setSpecialtiesStore,
	setSuppliersStore,
}

export default managementSlice.reducer
