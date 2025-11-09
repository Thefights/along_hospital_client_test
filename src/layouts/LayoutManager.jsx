import DashboardDrawer from '@/components/layouts/DashboardDrawer'
import { default as DashboardHeader } from '@/components/layouts/DashboardHeader'
import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setProfileStore } from '@/redux/reducers/patientReducer'
import {
	ApartmentRounded,
	ArticleRounded,
	AssignmentRounded,
	BadgeRounded,
	CategoryRounded,
	CheckBoxRounded,
	DashboardRounded,
	Delete,
	DescriptionRounded,
	DiscountRounded,
	DomainRounded,
	EventAvailableRounded,
	FileUploadRounded,
	FlagRounded,
	Inventory2Rounded,
	LocalPharmacyRounded,
	Person,
	PersonAddAlt1Rounded,
	PersonRounded,
	QuestionAnswerRounded,
	ReceiptLongRounded,
	SettingsRounded,
	WorkHistoryRounded,
	WorkOutlineRounded,
} from '@mui/icons-material'
import { Container, Stack } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const LayoutManager = () => {
	const [collapsedDrawer, setCollapsedDrawer] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const { logout } = useAuth()
	const { t } = useTranslation()

	const profileStore = useReduxStore({
		selector: (s) => s.patient.profile,
		setStore: setProfileStore,
	})

	const sections = [
		{
			items: [
				{
					key: 'dashboard',
					label: 'Dashboard',
					icon: <DashboardRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(),
				},
			],
		},
		{
			title: 'Clinical Management',
			items: [
				{
					key: 'appointment',
					label: 'Appointment',
					icon: <EventAvailableRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.APPOINTMENT_MANAGEMENT),
				},
				{
					key: 'medical-history',
					label: 'Medical History',
					icon: <DescriptionRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.MEDICAL_HISTORY.INDEX),
				},
				{
					key: 'medical-service',
					label: 'Medical Service',
					icon: <AssignmentRounded />,
					// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.MEDICAL_SERVICE_MANAGEMENT),
				},
			],
		},
		{
			title: 'Commerce & Inventory',
			items: [
				{
					key: 'order',
					label: 'Order',
					icon: <ReceiptLongRounded />,
					// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.ORDER_MANAGEMENT),
				},
				{
					key: 'voucher',
					label: 'Voucher',
					icon: <DiscountRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.VOUCHER_MANAGEMENT),
				},
				{
					key: 'inventory',
					label: 'Inventory',
					icon: <Inventory2Rounded />,
					of: [
						{
							key: 'medicine',
							label: 'Medicine',
							icon: <LocalPharmacyRounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.MEDICINE_MANAGEMENT),
						},
						{
							key: 'medicine-category',
							label: 'Medicine Category',
							icon: <CategoryRounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.MEDICINE_CATEGORY_MANAGEMENT),
						},
						{
							key: 'import',
							label: 'Import',
							icon: <FileUploadRounded />,
							// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.IMPORT_MANAGEMENT),
						},
						{
							key: 'supplier',
							label: 'Supplier',
							icon: <BadgeRounded />,
							// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.SUPPLIER_MANAGEMENT),
						},
					],
				},
				{
					key: 'import',
					label: 'Import Management',
					icon: <FileUploadRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.IMPORT_MANAGEMENT.INDEX),
				},
			],
		},
		{
			title: 'Human Resource',
			items: [
				{
					key: 'organization',
					label: 'Organization',
					icon: <ApartmentRounded />,
					of: [
						{
							key: 'department',
							label: 'Department',
							icon: <DomainRounded />,
							// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.DEPARTMENT_MANAGEMENT),
						},
						{
							key: 'specialty',
							label: 'Specialty',
							icon: <WorkOutlineRounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.SPECIALTY_MANAGEMENT),
						},
					],
				},
				{
					key: 'employee',
					label: 'Employee',
					icon: <PersonRounded />,
					of: [
						{
							key: 'doctor',
							label: 'Doctor',
							icon: <PersonAddAlt1Rounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.DOCTOR_MANAGEMENT),
						},
					],
				},
				{
					key: 'workforce',
					label: 'Workforce',
					icon: <WorkHistoryRounded />,
					of: [
						{
							key: 'attendance',
							label: 'Attendance',
							icon: <CheckBoxRounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.ATTENDANCE_MANAGEMENT),
						},
						{
							key: 'shift',
							label: 'Shift',
							icon: <Delete />,
							// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.SHIFT_MANAGEMENT),
						},
						{
							key: 'payroll',
							label: 'Payroll',
							icon: <Delete />,
							// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.PAYROLL_MANAGEMENT),
						},
					],
				},
			],
		},
		{
			title: 'Customer & Support',
			items: [
				{
					key: 'blog',
					label: 'Blog',
					icon: <ArticleRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.BLOG.INDEX),
				},
				{
					key: 'feedback-report',
					label: 'Feedback Report',
					icon: <QuestionAnswerRounded />,
					// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.FEEDBACK_REPORT_MANAGEMENT),
				},
				{
					key: 'complaint',
					label: 'Complaint',
					icon: <FlagRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.COMPLAINT_MANAGEMENT),
				},
			],
		},
		{
			title: 'System',
			items: [
				{ key: 'settings', label: 'Settings', icon: <SettingsRounded />, url: '/admin/settings' },
			],
		},
	]

	const userMenuItems = [
		{
			label: t('header.user_menu.profile'),
			url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.PROFILE),
			icon: <Person />,
		},
	]

	return (
		<Stack direction={'row'}>
			<DashboardDrawer
				sections={sections}
				collapsed={collapsedDrawer}
				onToggleCollapse={() => setCollapsedDrawer((prev) => !prev)}
				mobileOpen={mobileOpen}
				onMobileClose={() => setMobileOpen(false)}
			/>
			<Stack flexGrow={1}>
				<DashboardHeader
					profile={profileStore.data}
					onLogout={logout}
					onOpenDrawer={() => setMobileOpen(true)}
					userMenuItems={userMenuItems}
				/>
				<Container sx={{ flexGrow: 1, py: 3 }} maxWidth='xl'>
					<Outlet />
				</Container>
			</Stack>
		</Stack>
	)
}

export default LayoutManager
