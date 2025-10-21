import { EnumConfig } from '@/configs/enumConfig'
import useTranslation from './useTranslation'

export default function useEnum() {
	const { t } = useTranslation()
	return {
		genderOptions: [
			{ value: EnumConfig.Gender.Male, label: t('enum.gender.male') },
			{ value: EnumConfig.Gender.Female, label: t('enum.gender.female') },
			{ value: EnumConfig.Gender.Other, label: t('enum.gender.other') },
		],

		// For appointments
		appointmentStatusOptions: [
			{ value: EnumConfig.AppointmentStatus.Scheduled, label: t('enum.appointment_status.scheduled') },
			{ value: EnumConfig.AppointmentStatus.Confirmed, label: t('enum.appointment_status.confirmed') },
			{ value: EnumConfig.AppointmentStatus.Completed, label: t('enum.appointment_status.completed') },
			{ value: EnumConfig.AppointmentStatus.Cancelled, label: t('enum.appointment_status.cancelled') },
			{ value: EnumConfig.AppointmentStatus.Refused, label: t('enum.appointment_status.refused') },
		],
		appointmentTypeOptions: [
			{
				value: EnumConfig.AppointmentType.Consultation,
				label: t('enum.appointment_type.consultation'),
			},
			{ value: EnumConfig.AppointmentType.FollowUp, label: t('enum.appointment_type.follow_up') },
			{
				value: EnumConfig.AppointmentType.RoutineCheckup,
				label: t('enum.appointment_type.routine_checkup'),
			},
			{ value: EnumConfig.AppointmentType.Emergency, label: t('enum.appointment_type.emergency') },
		],
		appointmentMeetingTypeOptions: [
			{
				value: EnumConfig.AppointmentMeetingType.InPerson,
				label: t('enum.appointment_meeting_type.in_person'),
			},
			{
				value: EnumConfig.AppointmentMeetingType.Telehealth,
				label: t('enum.appointment_meeting_type.telehealth'),
			},
		],

		// For medical history
		bloodTypeOptions: [
			EnumConfig.BloodType.O,
			EnumConfig.BloodType.A,
			EnumConfig.BloodType.B,
			EnumConfig.BloodType.AB,
		],
		severityLevelOptions: [
			{ value: EnumConfig.SeverityLevel.Mild, label: t('enum.severity_level.mild') },
			{ value: EnumConfig.SeverityLevel.Moderate, label: t('enum.severity_level.moderate') },
			{ value: EnumConfig.SeverityLevel.Severe, label: t('enum.severity_level.severe') },
		],
		medicalHistoryStatusOptions: [
			{ value: EnumConfig.MedicalHistoryStatus.Draft, label: t('enum.medical_history_status.draft') },
			{
				value: EnumConfig.MedicalHistoryStatus.Processed,
				label: t('enum.medical_history_status.processed'),
			},
			{ value: EnumConfig.MedicalHistoryStatus.Paid, label: t('enum.medical_history_status.paid') },
		],

		// For complaints
		complaintTopicOptions: [
			{ value: EnumConfig.ComplaintTopic.Service, label: t('enum.complaint_topic.service') },
			{ value: EnumConfig.ComplaintTopic.Billing, label: t('enum.complaint_topic.billing') },
			{ value: EnumConfig.ComplaintTopic.Doctor, label: t('enum.complaint_topic.doctor') },
			{ value: EnumConfig.ComplaintTopic.Medicine, label: t('enum.complaint_topic.medicine') },
			{ value: EnumConfig.ComplaintTopic.Others, label: t('enum.complaint_topic.others') },
		],
		complaintResolveStatusOptions: [
			{
				value: EnumConfig.ComplaintResolveStatus.Pending,
				label: t('enum.complaint_resolve_status.pending'),
			},
			{
				value: EnumConfig.ComplaintResolveStatus.Draft,
				label: t('enum.complaint_resolve_status.draft'),
			},
			{
				value: EnumConfig.ComplaintResolveStatus.Resolved,
				label: t('enum.complaint_resolve_status.resolved'),
			},
			{
				value: EnumConfig.ComplaintResolveStatus.Closed,
				label: t('enum.complaint_resolve_status.closed'),
			},
		],
	}
}

// Usage Example:

// const _enum = useEnum();
// options: _enum.genderOptions,
// options: _enum.bloodTypeOptions,
// options: _enum.severityLevelOptions,
