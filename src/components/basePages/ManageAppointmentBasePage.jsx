import { GenericPagination, GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTabs from '@/components/generals/GenericTabs'
import AppointmentDetailDrawer from '@/components/sections/manageAppointmentSections/AppointmentDetailDrawerSection'
import AppointmentFilterBar from '@/components/sections/manageAppointmentSections/AppointmentFilterBar'
import AppointmentListItem from '@/components/sections/manageAppointmentSections/AppointmentListItem'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import EmptyBox from '../placeholders/EmptyBox'
import SkeletonBox from '../skeletons/SkeletonBox'

const ManageAppointmentBasePage = ({
	headerTitle = 'Manage Appointments',
	totalAppointments = 0,
	appointments = [],
	appointmentSpecialties = [],
	appointmentDoctors = [],
	filters = {
		dateRange: { start: '', end: '' },
		status: '',
		specialty: '',
		doctor: '',
		search: '',
		page: 1,
		pageSize: 5,
	},
	setFilters,
	selectedAppointment,
	setSelectedAppointment,
	onFilterClick = () => {},
	loading = false,
	showSpecialtiesAndDoctorsFilter = true,
	drawerButtons = <React.Fragment />,
}) => {
	const [drawerOpen, setDrawerOpen] = useState(false)

	const { t } = useTranslation()

	const statusTabs = [
		{ key: '', title: t('text.all') },
		{ key: 'scheduled', title: t('appointment.status.scheduled') },
		{ key: 'confirmed', title: t('appointment.status.confirmed') },
		{ key: 'completed', title: t('appointment.status.completed') },
		{ key: 'cancelled', title: t('appointment.status.cancelled') },
		{ key: 'refused', title: t('appointment.status.refused') },
	]

	const onOpenDrawer = (appt) => {
		setSelectedAppointment(appt)
		setDrawerOpen(true)
	}

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					flexWrap='wrap'
					rowGap={1}
				>
					<Typography variant='h5'>{headerTitle}</Typography>
					<Stack direction='row' spacing={2}>
						<Typography variant='body2' sx={{ color: 'text.secondary' }}>
							[{t('appointment.status.upcoming')}:{' '}
							{appointments?.reduce(
								(acc, appt) =>
									appt.appointmentStatus === 'Scheduled' || appt.appointmentStatus === 'Confirmed'
										? acc + 1
										: acc,
								0
							)}
							]
						</Typography>
						<Typography variant='body2' sx={{ color: 'text.secondary' }}>
							[{t('appointment.status.completed')}:{' '}
							{appointments?.reduce(
								(acc, appt) => (appt.appointmentStatus === 'Completed' ? acc + 1 : acc),
								0
							)}
							]
						</Typography>
					</Stack>
				</Stack>

				<AppointmentFilterBar
					filters={filters}
					setFilters={setFilters}
					specialties={appointmentSpecialties}
					doctors={appointmentDoctors}
					onFilterClick={onFilterClick}
					loading={loading}
					showSpecialtiesAndDoctorsFilter={showSpecialtiesAndDoctorsFilter}
				/>

				<Stack spacing={2} sx={{ width: '100%' }}>
					<GenericTabs
						tabs={statusTabs}
						currentTab={filters.status}
						setCurrentTab={(tab) => setFilters({ ...filters, status: tab.key, page: 1 })}
						loading={loading}
					/>
					<Stack spacing={1}>
						{loading ? (
							<SkeletonBox numberOfBoxes={3} heights={[268 / 3]} />
						) : appointments.length === 0 ? (
							<EmptyBox minHeight={300} />
						) : (
							appointments.map((appt, index) => (
								<AppointmentListItem
									key={appt?.id || index}
									appointment={appt}
									onClick={() => onOpenDrawer(appt)}
								/>
							))
						)}
					</Stack>
					<Stack justifyContent={'center'} px={2}>
						{filters?.pageSize ? (
							<GenericTablePagination
								totalItems={totalAppointments}
								page={filters.page}
								setPage={(page) => setFilters({ ...filters, page })}
								pageSize={filters.pageSize}
								setPageSize={(pageSize) => setFilters({ ...filters, pageSize })}
								rowsPerPageOptions={[5, 10, 20]}
								loading={loading}
							/>
						) : (
							<GenericPagination
								totalPages={Math.ceil(totalAppointments / 5)}
								page={filters.page}
								setPage={(page) => setFilters({ ...filters, page })}
								loading={loading}
							/>
						)}
					</Stack>
				</Stack>

				<AppointmentDetailDrawer
					appointment={selectedAppointment}
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
					buttons={drawerButtons}
				/>
			</Stack>
		</Paper>
	)
}

export default ManageAppointmentBasePage
