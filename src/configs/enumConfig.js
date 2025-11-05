export const EnumConfig = {
	// For users
	AuthStage: {
		PatientProfilePendingWithPhone: 'PatientProfilePendingWithPhone',
		PatientProfilePendingWithoutPhone: 'PatientProfilePendingWithoutPhone',
		DoctorProfilePending: 'DoctorProfilePending',
		Done: 'Done',
	},
	Role: {
		Guest: 'Guest',
		Patient: 'Patient',
		Doctor: 'Doctor',
		Manager: 'Manager',
	},
	Gender: {
		Male: 'Male',
		Female: 'Female',
		Other: 'Other',
	},
	AllergySeverity: {
		Mild: 'Mild',
		Moderate: 'Moderate',
		Severe: 'Severe',
	},

	// For appointments
	AppointmentStatus: {
		Scheduled: 'Scheduled',
		Confirmed: 'Confirmed',
		Completed: 'Completed',
		Cancelled: 'Cancelled',
		Refused: 'Refused',
	},
	AppointmentTimeSlot: {
		HalfHour: 'HalfHour',
		OneHour: 'OneHour',
		TwoHours: 'TwoHours',
	},
	AppointmentPaymentStatus: {
		None: 'None',
		Pending: 'Pending',
		Completed: 'Completed',
		Failed: 'Failed',
	},
	AppointmentType: {
		Consultation: 'Consultation',
		FollowUp: 'FollowUp',
		RoutineCheckup: 'RoutineCheckup',
		LabTest: 'LabTest',
		Imaging: 'Imaging',
		Vaccination: 'Vaccination',
		Procedure: 'Procedure',
	},
	AppointmentMeetingType: {
		InPerson: 'InPerson',
		Telehealth: 'Telehealth',
	},

	// For medical history
	BloodType: {
		O: 'O',
		A: 'A',
		B: 'B',
		AB: 'AB',
	},
	SeverityLevel: {
		Mild: 'Mild',
		Moderate: 'Moderate',
		Severe: 'Severe',
	},
	MedicalHistoryStatus: {
		Draft: 'Draft',
		Processed: 'Processed',
		Paid: 'Paid',
	},

	// For complaints
	ComplaintTopic: {
		Service: 'Service',
		Billing: 'Billing',
		Doctor: 'Doctor',
		Medicine: 'Medicine',
		Others: 'Others',
	},
	ComplaintType: {
		Neutral: 'Neutral',
		Positive: 'Positive',
		Negative: 'Negative',
	},
	ComplaintResolveStatus: {
		Pending: 'Pending',
		Draft: 'Draft',
		Resolved: 'Resolved',
		Closed: 'Closed',
	},

	BlogType: {
		Health: 'Health',
		News: 'News',
		Promotion: 'Promotion',
		Guide: 'Guide',
		Other: 'Other',
	},

	// For medicines
	MedicineUnit: {
		Tablet: 'Tablet',
		Capsule: 'Capsule',
		Milliliter: 'Milliliter',
		Milligram: 'Milligram',
		Drop: 'Drop',
		Spoon: 'Spoon',
		Bottle: 'Bottle',
		Tube: 'Tube',
		Other: 'Other',
	},
}
