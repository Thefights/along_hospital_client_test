import { defaultVoucherStatusStyle, defaultVoucherTypeStyle } from '@/configs/defaultStylesConfig'
import { EnumConfig } from '@/configs/enumConfig'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { formatDateBasedOnCurrentLanguage } from '@/utils/formatDateUtil'
import { formatCurrencyBasedOnCurrentLanguage } from '@/utils/formatNumberUtil'
import CloseIcon from '@mui/icons-material/Close'
import {
	Box,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	IconButton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import React from 'react'

const VoucherDetailDialog = ({ open, onClose, voucher }) => {
	const { t } = useTranslation()

	if (!voucher) return null

	const InfoRow = ({ label, value }) => (
		<Grid container spacing={2} sx={{ mb: 1.5 }}>
			<Grid size={4}>
				<Typography variant='body2' color='text.secondary' fontWeight={600}>
					{label}:
				</Typography>
			</Grid>
			<Grid size={8}>{React.isValidElement(value) ? value : <Typography>{value}</Typography>}</Grid>
		</Grid>
	)

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
			<DialogTitle>
				<Stack direction='row' alignItems='center' justifyContent='space-between'>
					<Typography variant='h6'>{t('voucher.title.detail')}</Typography>
					<IconButton onClick={onClose} size='small'>
						<CloseIcon />
					</IconButton>
				</Stack>
			</DialogTitle>
			<Divider />
			<DialogContent>
				<Stack spacing={3}>
					<Box>
						<Typography variant='subtitle1' fontWeight={600} gutterBottom>
							{t('voucher.section.basic_info')}
						</Typography>
						<InfoRow label={t('voucher.field.id')} value={voucher.id} />
						<InfoRow label={t('voucher.field.name')} value={voucher.name} />
						<InfoRow label={t('voucher.field.code')} value={voucher.code} />
						<InfoRow
							label={t('voucher.field.description')}
							value={voucher.description || t('voucher.placeholder.no_description')}
						/>
						<InfoRow
							label={t('voucher.field.voucher_status')}
							value={
								<Chip
									label={t(`voucher.status.${voucher.voucherStatus}`)}
									color={defaultVoucherStatusStyle(voucher.voucherStatus)}
									size='small'
								/>
							}
						/>
						<InfoRow
							label={t('voucher.field.voucher_type')}
							value={
								<Chip
									label={t(`voucher.type.${voucher.voucherType}`)}
									color={defaultVoucherTypeStyle(voucher.voucherType)}
									size='small'
								/>
							}
						/>
					</Box>

					<Divider />

					<Box>
						<Typography variant='subtitle1' fontWeight={600} gutterBottom>
							{t('voucher.section.discount_info')}
						</Typography>
						<InfoRow
							label={t('voucher.field.discount_type')}
							value={t(`voucher.discount_type.${voucher.discountType}`)}
						/>
						<InfoRow
							label={t('voucher.field.discount_value')}
							value={
								voucher.discountType === EnumConfig.VoucherDiscountType.Percentage
									? `${voucher.discountValue}%`
									: formatCurrencyBasedOnCurrentLanguage(voucher.discountValue)
							}
						/>
						<InfoRow
							label={t('voucher.field.max_discount')}
							value={voucher.maxDiscount ? formatCurrencyBasedOnCurrentLanguage(voucher.maxDiscount) : '-'}
						/>
						<InfoRow
							label={t('voucher.field.min_purchase_amount')}
							value={
								voucher.minPurchaseAmount
									? formatCurrencyBasedOnCurrentLanguage(voucher.minPurchaseAmount)
									: '-'
							}
						/>
					</Box>

					<Divider />

					<Box>
						<Typography variant='subtitle1' fontWeight={600} gutterBottom>
							{t('voucher.section.usage_info')}
						</Typography>
						{voucher.voucherType === EnumConfig.VoucherType.Patient && (
							<InfoRow label={t('voucher.field.quantity')} value={voucher.quantity || 0} />
						)}
						<InfoRow
							label={t('voucher.field.expire_date')}
							value={formatDateBasedOnCurrentLanguage(voucher.expireDate)}
						/>
					</Box>

					{voucher.voucherType === EnumConfig.VoucherType.Medicine &&
						voucher.medicines &&
						voucher.medicines.length > 0 && (
							<>
								<Divider />
								<Box>
									<Typography variant='subtitle1' fontWeight={600} gutterBottom>
										{t('voucher.section.applicable_medicines')} ({voucher.medicines.length})
									</Typography>
									<Table size='small'>
										<TableHead>
											<TableRow>
												<TableCell>{t('voucher.field.medicine_id')}</TableCell>
												<TableCell>{t('voucher.field.medicine_name')}</TableCell>
												<TableCell>{t('voucher.field.medicine_brand')}</TableCell>
												<TableCell align='right'>{t('voucher.field.medicine_price')}</TableCell>
												<TableCell>{t('voucher.field.medicine_category')}</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{voucher.medicines.map((medicine) => (
												<TableRow key={medicine.id}>
													<TableCell>{medicine.id}</TableCell>
													<TableCell>{medicine.name}</TableCell>
													<TableCell>{medicine.brand || '-'}</TableCell>
													<TableCell align='right'>
														{formatCurrencyBasedOnCurrentLanguage(medicine.price)}
													</TableCell>
													<TableCell>{medicine.categoryName || '-'}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</Box>
							</>
						)}

					{voucher.image && (
						<>
							<Divider />
							<Box>
								<Typography variant='subtitle1' fontWeight={600} gutterBottom>
									{t('voucher.field.image')}
								</Typography>
								<Box
									component='img'
									src={getImageFromCloud(voucher.image)}
									alt={voucher.name}
									sx={{
										width: '100%',
										maxWidth: 400,
										height: 'auto',
										borderRadius: 1,
										border: '1px solid',
										borderColor: 'divider',
									}}
								/>
							</Box>
						</>
					)}
				</Stack>
			</DialogContent>
		</Dialog>
	)
}

export default VoucherDetailDialog
