import { GenericPagination } from '@/components/generals/GenericPagination'
import SkeletonVoucher from '@/components/skeletons/SkeletonVoucher'
import { ApiUrls } from '@/configs/apiUrls'
import { EnumConfig } from '@/configs/enumConfig'
import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { LocalOffer, SearchOff } from '@mui/icons-material'
import { Box, Button, Grid, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CollectibleVoucherFilter from './sections/CollectibleVoucherFilter'
import VoucherCard from './sections/VoucherCard'

const CollectibleVoucherListPage = () => {
	const theme = useTheme()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))
	const { auth } = useAuth()

	const [filters, setFilters] = useState({ name: '' })
	const [page, setPage] = useState(1)
	const [collectingVoucherId, setCollectingVoucherId] = useState(null)

	const buildQueryParams = useCallback(
		() => ({
			page,
			pageSize: 10,
			...(filters.name && { name: filters.name }),
		}),
		[filters.name, page]
	)

	const { data, loading, fetch } = useFetch(ApiUrls.VOUCHER.COLLECTIBLE, buildQueryParams(), [
		page,
		filters.name,
	])

	const { submit: collectVoucher, loading: collectLoading } = useAxiosSubmit({
		url: ApiUrls.VOUCHER.COLLECT,
		method: 'POST',
	})

	const handleCollectClick = async (voucher) => {
		if (!voucher) return
		setCollectingVoucherId(voucher.id)
		await collectVoucher({ voucherCode: voucher.code })
		fetch()
	}

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters)
		setPage(1)
	}

	const handleResetFilters = () => {
		setFilters({ name: '' })
		setPage(1)
	}

	const handlePageChange = (newPage) => {
		setPage(newPage)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const vouchers = data?.collection || []
	const totalPages = data?.totalPage || 1

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: isMobile ? 8 : 4 }}>
			<Box
				sx={{
					bgcolor: 'background.paper',
					borderBottom: `1px solid ${theme.palette.divider}`,
					py: 3,
				}}
			>
				<Stack direction='row' alignItems='center' spacing={2}>
					<LocalOffer sx={{ fontSize: '2rem', color: 'primary.main' }} />
					<Box>
						<Typography variant='h4' fontWeight={700}>
							{t('voucher.title.collectible_vouchers')}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{t('voucher.description.collectible_subtitle')}
						</Typography>
					</Box>
				</Stack>
			</Box>

			{!isMobile && auth?.role === EnumConfig.Role.Patient && (
				<Box
					sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}`, mb: 3 }}
				>
					<Box sx={{ display: 'flex', gap: 3 }}>
						<Box
							sx={{
								py: 2,
								px: 3,
								borderBottom: `3px solid ${theme.palette.primary.main}`,
								color: 'primary.main',
								fontWeight: 600,
								cursor: 'pointer',
							}}
						>
							{t('voucher.title.collectible_vouchers')}
						</Box>
						<Box
							sx={{
								py: 2,
								px: 3,
								color: 'text.secondary',
								fontWeight: 500,
								cursor: 'pointer',
								'&:hover': { color: 'primary.main' },
							}}
							onClick={() => navigate(routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.VOUCHER.MY_VOUCHERS))}
						>
							{t('voucher.title.my_vouchers')}
						</Box>
					</Box>
				</Box>
			)}

			{isMobile && (
				<Box sx={{ mb: 3 }}>
					<CollectibleVoucherFilter
						permanent
						filters={filters}
						onFilterChange={handleFilterChange}
						onReset={handleResetFilters}
					/>
				</Box>
			)}

			<Stack direction='row' spacing={3}>
				{!isMobile && (
					<Box sx={{ flexShrink: 0 }}>
						<CollectibleVoucherFilter
							permanent
							filters={filters}
							onFilterChange={handleFilterChange}
							onReset={handleResetFilters}
						/>
					</Box>
				)}

				<Box sx={{ flexGrow: 1 }}>
					{loading && (
						<Grid container spacing={3}>
							{[...Array(10)].map((_, index) => (
								<Grid key={index} size={{ xs: 12, sm: 6 }}>
									<SkeletonVoucher />
								</Grid>
							))}
						</Grid>
					)}
					{!loading && vouchers.length === 0 && (
						<Paper
							elevation={0}
							sx={{
								p: 6,
								textAlign: 'center',
								bgcolor: 'background.paper',
								borderRadius: 2,
								border: `1px dashed ${theme.palette.divider}`,
							}}
						>
							<SearchOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
							<Typography variant='h6' gutterBottom color='text.primary'>
								{t('voucher.description.no_collectible_title')}
							</Typography>
							<Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
								{t('voucher.description.no_collectible_subtitle')}
							</Typography>
						</Paper>
					)}
					{!loading && vouchers.length > 0 && (
						<>
							<Grid container spacing={2}>
								{vouchers.map((voucher) => (
									<Grid key={voucher.id || voucher.code} size={{ xs: 12, sm: 6 }}>
										<VoucherCard
											voucher={voucher}
											mode='collectible'
											onCollect={handleCollectClick}
											loading={collectLoading && collectingVoucherId === voucher.id}
											userRole={auth?.role}
										/>
									</Grid>
								))}
							</Grid>

							{totalPages > 1 && (
								<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
									<GenericPagination page={page} totalPage={totalPages} setPage={handlePageChange} />
								</Box>
							)}
						</>
					)}
				</Box>
			</Stack>
		</Box>
	)
}

export default CollectibleVoucherListPage
