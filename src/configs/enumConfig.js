export const EnumConfig = {
	// For users
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

	// For appointments
	AppointmentStatus: {
		Scheduled: 'Scheduled',
		Confirmed: 'Confirmed',
		Completed: 'Completed',
		Cancelled: 'Cancelled',
		Refused: 'Refused',
	},
	AppointmentType: {
		Consultation: 'Consultation',
		FollowUp: 'Follow-up',
		RoutineCheckup: 'Routine Check-up',
		Emergency: 'Emergency',
	},
	AppointmentMeetingType: {
		InPerson: 'In-Person',
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
}
