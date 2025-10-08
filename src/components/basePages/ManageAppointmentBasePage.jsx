import { GenericPagination, GenericTablePagination } from '@/components/generals/GenericPagination'
import GenericTabs from '@/components/generals/GenericTabs'
import AppointmentDetailDrawer from '@/components/sections/manageAppointmentSections/AppointmentDetailDrawerSection'
import AppointmentFilterBar from '@/components/sections/manageAppointmentSections/AppointmentFilterBar'
import AppointmentListItem from '@/components/sections/manageAppointmentSections/AppointmentListItem'
import useDebounce from '@/hooks/useDebounce'
import useTranslation from '@/hooks/useTranslation'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'

const ManageAppointmentBasePage = ({
	headerTitle = 'Manage Appointments',
	totalAppointments = 0,
	appointments = [],
	appointmentSpecialties = [],
	appointmentDoctors = [],
	showSpecialtiesAndDoctorsFilter = true,
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
	drawerButtons = <React.Fragment />,
}) => {
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	useDebounce(() => setFilters({ ...filters, search: searchTerm, page: 1 }), 500, [searchTerm])

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
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					specialties={appointmentSpecialties}
					doctors={appointmentDoctors}
					showSpecialtiesAndDoctorsFilter={showSpecialtiesAndDoctorsFilter}
				/>

				<Stack spacing={2}>
					<GenericTabs
						tabs={statusTabs}
						currentTab={filters.status}
						setCurrentTab={(status) => setFilters({ ...filters, status })}
					/>
					<Stack spacing={1}>
						{appointments.map((appt, index) => (
							<AppointmentListItem
								key={appt?.id || index}
								appointment={appt}
								onClick={() => onOpenDrawer(appt)}
							/>
						))}
					</Stack>
					<Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
						{filters?.pageSize ? (
							<GenericTablePagination
								totalItems={totalAppointments}
								page={filters.page}
								setPage={(page) => setFilters({ ...filters, page })}
								pageSize={filters.pageSize}
								setPageSize={(pageSize) => setFilters({ ...filters, pageSize, page: 1 })}
								rowsPerPageOptions={[5, 10, 20]}
							/>
						) : (
							<GenericPagination
								totalPages={Math.ceil(totalAppointments / 5)}
								page={filters.page}
								setPage={(page) => setFilters({ ...filters, page })}
							/>
						)}
					</Box>
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
