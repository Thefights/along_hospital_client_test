import ManageAppointmentDetailDrawerSection from '@/components/basePages/manageAppointmentBasePage/sections/ManageAppointmentDetailDrawerSection'
import ManageAppointmentFilterBarSection from '@/components/basePages/manageAppointmentBasePage/sections/ManageAppointmentFilterBarSection'
import ManageAppointmentListItemSection from '@/components/basePages/manageAppointmentBasePage/sections/ManageAppointmentListItemSection'
import { GenericPagination, GenericTablePagination } from '@/components/generals/GenericPagination'
import { EnumConfig } from '@/configs/enumConfig'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import EmptyBox from '../../placeholders/EmptyBox'
import SkeletonBox from '../../skeletons/SkeletonBox'
import ManageAppointmentTabsSection from './sections/ManageAppointmentTabsSection'

const ManageAppointmentBasePage = ({
	headerTitle = 'Manage Appointments',
	totalAppointments = 0,
	appointments = [],
	specialties = [],
	filters,
	setFilters,
	selectedAppointment,
	setSelectedAppointment,
	onFilterClick = (values) => Promise.resolve(values),
	loading = false,
	drawerButtons = <React.Fragment />,
}) => {
	const [drawerOpen, setDrawerOpen] = useState(false)

	const { t } = useTranslation()

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
							[{t('appointment.title.upcoming')}:{' '}
							{appointments?.reduce(
								(acc, appt) =>
									appt.appointmentStatus === EnumConfig.AppointmentStatus.Scheduled ||
									appt.appointmentStatus === EnumConfig.AppointmentStatus.Confirmed
										? acc + 1
										: acc,
								0
							)}
							]
						</Typography>
						<Typography variant='body2' sx={{ color: 'text.secondary' }}>
							[{t('appointment.title.completed')}:{' '}
							{appointments?.reduce(
								(acc, appt) =>
									appt.appointmentStatus === EnumConfig.AppointmentStatus.Completed ? acc + 1 : acc,
								0
							)}
							]
						</Typography>
					</Stack>
				</Stack>

				<ManageAppointmentFilterBarSection
					filters={filters}
					setFilters={setFilters}
					specialties={specialties}
					onFilterClick={onFilterClick}
					loading={loading}
				/>

				<Stack spacing={2} sx={{ width: '100%' }}>
					<ManageAppointmentTabsSection filters={filters} setFilters={setFilters} loading={loading} />
					<Stack spacing={1}>
						{loading ? (
							<SkeletonBox numberOfBoxes={3} heights={[268 / 3]} />
						) : appointments.length === 0 ? (
							<EmptyBox minHeight={300} />
						) : (
							appointments.map((appt, index) => (
								<ManageAppointmentListItemSection
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
								pageSizeOptions={[5, 10, 20]}
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

				<ManageAppointmentDetailDrawerSection
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
