import useTranslation from '@/hooks/useTranslation'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

const ReportFeedbackDialog = ({ open, onClose, onSubmit, loading = false, initialReason = '' }) => {
	const { t } = useTranslation()
	const [reason, setReason] = useState(initialReason)

	useEffect(() => {
		if (open) setReason(initialReason || '')
	}, [open, initialReason])

	return (
		<Dialog open={!!open} onClose={onClose} fullWidth>
			<DialogTitle>{t('feedback.report_title') || 'Report feedback'}</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					multiline
					minRows={3}
					label={t('feedback.report_reason') || 'Reason'}
					value={reason}
					onChange={(e) => setReason(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					{t('button.cancel')}
				</Button>
				<Button
					variant='contained'
					color='warning'
					onClick={() => onSubmit?.(reason)}
					disabled={loading || !reason?.trim()}
				>
					{t('button.report') || 'Report'}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ReportFeedbackDialog
