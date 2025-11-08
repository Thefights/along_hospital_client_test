import { ApiUrls } from '@/configs/apiUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import { useCsvImport } from '@/hooks/useCsvImport'
import useTranslation from '@/hooks/useTranslation'
import { Button, Stack } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CsvImportSection = ({ onImportSuccess }) => {
	const { t } = useTranslation()
	const [pendingFile, setPendingFile] = useState(null)

	const bulkImportSubmit = useAxiosSubmit({
		url: ApiUrls.IMPORT.MANAGEMENT.BULK_IMPORT_FROM_EXCEL,
		method: 'POST',
		onError: async (error) => {
			const message = error?.response?.data?.message || error?.message || t('error.unknown_error')
			toast.error(message)
			return error
		},
	})

	const handleCsvError = useCallback(
		(error) => {
			const message = error?.message || t('error.unknown_error')
			toast.error(message)
		},
		[t]
	)

	const {
		fileInputRef,
		handleFileChange,
		selectFile,
		reset: resetCsvImport,
	} = useCsvImport({
		onSuccess: (_, selectedFile) => {
			if (selectedFile) setPendingFile(selectedFile)
		},
		onError: handleCsvError,
	})

	useEffect(() => {
		if (!pendingFile) return

		let isMounted = true

		const upload = async () => {
			const formData = new FormData()
			formData.append('File', pendingFile)

			const response = await bulkImportSubmit.submit(formData)
			if (!isMounted) return

			if (response) {
				if (onImportSuccess) {
					await onImportSuccess()
				}
			}

			setPendingFile(null)
			resetCsvImport()
		}

		upload()

		return () => {
			isMounted = false
		}
	}, [pendingFile, bulkImportSubmit, onImportSuccess, resetCsvImport])

	return (
		<>
			<input
				type='file'
				ref={fileInputRef}
				onChange={handleFileChange}
				accept='.csv'
				style={{ display: 'none' }}
			/>
			<Stack direction='row' spacing={2}>
				<Button
					variant='outlined'
					color='secondary'
					onClick={selectFile}
					disabled={bulkImportSubmit.loading}
				>
					{t('import_management.button.import_csv')}
				</Button>
			</Stack>
		</>
	)
}

export default CsvImportSection
