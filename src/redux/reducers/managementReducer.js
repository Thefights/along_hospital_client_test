import { createSlice } from '@reduxjs/toolkit'

const initState = {
	doctors: [],
	patients: [],
	medicineCategories: [],
	departments: [],
	specialties: [],
	medicalServices: [],
}

const managerSlice = createSlice({
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
	},
})

export const {
	setDoctorsStore,
	setPatientsStore,
	setMedicineCategoriesStore,
	setDepartmentsStore,
	setSpecialtiesStore,
	setMedicalServicesStore,
} = managerSlice.actions

export default managerSlice.reducer
