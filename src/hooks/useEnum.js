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
		blogTypeOptions: [
			{ value: EnumConfig.BlogType.Health, label: t('enum.blog_type.health') },
			{ value: EnumConfig.BlogType.News, label: t('enum.blog_type.news') },
			{ value: EnumConfig.BlogType.Promotion, label: t('enum.blog_type.promotion') },
			{ value: EnumConfig.BlogType.Guide, label: t('enum.blog_type.guide') },
			{ value: EnumConfig.BlogType.Other, label: t('enum.blog_type.other') },
		],

		// For appointments
		appointmentStatusOptions: [
			{ value: EnumConfig.AppointmentStatus.Scheduled, label: t('enum.appointment_status.scheduled') },
			{ value: EnumConfig.AppointmentStatus.Confirmed, label: t('enum.appointment_status.confirmed') },
			{ value: EnumConfig.AppointmentStatus.Completed, label: t('enum.appointment_status.completed') },
			{ value: EnumConfig.AppointmentStatus.Cancelled, label: t('enum.appointment_status.cancelled') },
			{ value: EnumConfig.AppointmentStatus.Refused, label: t('enum.appointment_status.refused') },
		],
		appointmentTimeSlotOptions: [
			{
				value: EnumConfig.AppointmentTimeSlot.HalfHour,
				label: t('enum.appointment_time_slot.half_hour'),
			},
			{
				value: EnumConfig.AppointmentTimeSlot.OneHour,
				label: t('enum.appointment_time_slot.one_hour'),
			},
			{
				value: EnumConfig.AppointmentTimeSlot.TwoHours,
				label: t('enum.appointment_time_slot.two_hours'),
			},
		],
		appointmentPaymentStatusOptions: [
			{
				value: EnumConfig.AppointmentPaymentStatus.None,
				label: t('enum.appointment_payment_status.none'),
			},
			{
				value: EnumConfig.AppointmentPaymentStatus.Pending,
				label: t('enum.appointment_payment_status.pending'),
			},
			{
				value: EnumConfig.AppointmentPaymentStatus.Completed,
				label: t('enum.appointment_payment_status.completed'),
			},
			{
				value: EnumConfig.AppointmentPaymentStatus.Failed,
				label: t('enum.appointment_payment_status.failed'),
			},
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
			{ value: EnumConfig.AppointmentType.LabTest, label: t('enum.appointment_type.lab_test') },
			{ value: EnumConfig.AppointmentType.Imaging, label: t('enum.appointment_type.imaging') },
			{ value: EnumConfig.AppointmentType.Vaccination, label: t('enum.appointment_type.vaccination') },
			{ value: EnumConfig.AppointmentType.Procedure, label: t('enum.appointment_type.procedure') },
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
		complaintTypeOptions: [
			{
				value: EnumConfig.ComplaintType.Neutral,
				label: t('enum.complaint_type.neutral'),
			},
			{
				value: EnumConfig.ComplaintType.Positive,
				label: t('enum.complaint_type.positive'),
			},
			{
				value: EnumConfig.ComplaintType.Negative,
				label: t('enum.complaint_type.negative'),
			},
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
