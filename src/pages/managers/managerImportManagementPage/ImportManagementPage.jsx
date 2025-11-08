import { ApiUrls } from '@/configs/apiUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { Paper, Stack, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import CsvImportSection from './sections/CsvImportSection'
import ImportManagementTableSection from './sections/ImportManagementTableSection'

const toCollection = (payload) => {
	if (Array.isArray(payload?.collection)) return payload.collection
	if (Array.isArray(payload?.data)) return payload.data
	return Array.isArray(payload) ? payload : []
}

const ImportManagementPage = () => {
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [sort, setSort] = useState({ key: 'id', direction: 'asc' })
	const { t } = useTranslation()

	const sortParam = useMemo(() => `${sort.key ?? 'id'} ${sort.direction ?? 'asc'}`, [sort])

	const getImports = useFetch(
		ApiUrls.IMPORT.MANAGEMENT.INDEX,
		{ Page: page, PageSize: pageSize, Sort: sortParam },
		[page, pageSize, sortParam]
	)

	const handleImportSuccess = useCallback(async () => {
		if (page !== 1) {
			setPage(1)
			return
		}
		await getImports.fetch()
	}, [page, getImports])

	const imports = useMemo(() => toCollection(getImports.data), [getImports.data])
	const totalPage = useMemo(() => getImports.data?.totalPage ?? 1, [getImports.data?.totalPage])

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>{t('import_management.title')}</Typography>
				<CsvImportSection onImportSuccess={handleImportSuccess} />
				<ImportManagementTableSection
					imports={imports}
					loading={getImports.loading}
					refetch={getImports.fetch}
					sort={sort}
					setSort={setSort}
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					totalPage={totalPage}
				/>
			</Stack>
		</Paper>
	)
}

export default ImportManagementPage
