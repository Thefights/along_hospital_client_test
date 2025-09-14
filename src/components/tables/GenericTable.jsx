import { getObjectValueFromStringPath } from '@/utils/handleObjectUtil'
import { ArrowDownward, ArrowUpward, UnfoldMore } from '@mui/icons-material'
import {
	Checkbox,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material'
import { alpha, Box } from '@mui/system'
import { useMemo } from 'react'
import SkeletonTableRow from '../skeletons/SkeletonTableRow'
import EmptyRow from './EmptyRow'

const GenericTable = ({
	data = [],
	fields = [],
	rowKey,
	sort = { key: null, direction: 'asc' },
	setSort = () => {},
	canSelectRows = false,
	selectedRows = [],
	setSelectedRows = () => {},
	loading = false,
	stickyHeader = true,
	defaultMinWidthPx = 140,
}) => {
	const { stickyMeta, widthsPct, totalMinWidthPx } = useMemo(() => {
		const specified = fields.map((f) => (typeof f.width === 'number' ? f.width : null))
		const sumSpecified = specified.reduce((a, b) => a + (b ?? 0), 0)
		const unspecifiedCount = specified.filter((v) => v == null).length
		const leftover = Math.max(0, 100 - sumSpecified)
		const each = unspecifiedCount > 0 ? leftover / unspecifiedCount : 0

		const finalPct = fields.map((f, i) => (specified[i] == null ? each : specified[i]))

		const meta = []
		let acc = 0
		fields.forEach((f, i) => {
			if (f.fixedColumn) meta[i] = { left: acc }
			else meta[i] = null
			acc += finalPct[i] || 0
		})

		const totalMin = fields.reduce((sum, f) => sum + (f?.minWidthPx ?? defaultMinWidthPx), 0)

		return { stickyMeta: meta, widthsPct: finalPct, totalMinWidthPx: totalMin }
	}, [fields, defaultMinWidthPx])

	const makeHeaderCell = (f, i) => {
		const active = sort?.key === f.key
		const dir = active ? sort?.direction : undefined
		const canSort = !!f.sortable && !!setSort

		const sticky = stickyMeta[i]
		const stickySx = sticky
			? {
					position: 'sticky',
					left: `${sticky.left}%`,
					zIndex: 3,
					backgroundColor: (theme) => theme.palette.background.paper,
					boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.08)',
			  }
			: null

		return (
			<TableCell
				key={i}
				align={f.isNumeric ? 'right' : 'left'}
				sx={(theme) => ({
					position: 'relative',
					width: `${widthsPct[i]}%`,
					minWidth: f.minWidthPx ?? defaultMinWidthPx,
					fontWeight: 700,
					color: '#444',
					bgcolor: alpha(theme.palette.primary.light, 0.04),
					borderBottom: `1px solid ${theme.palette.divider}`,
					userSelect: canSort ? 'none' : undefined,
					cursor: canSort ? 'pointer' : 'default',
					'&:hover .sortIcon:not(.active)': {
						opacity: 0.9,
					},
					'&:not(:last-of-type)::after': !sticky
						? {
								content: '""',
								position: 'absolute',
								top: '25%',
								bottom: '25%',
								right: 0,
								width: '1px',
								backgroundColor: theme.palette.divider,
						  }
						: {},
					...stickySx,
				})}
				onClick={() => {
					if (!canSort) return
					const next = active ? (dir === 'asc' ? 'desc' : 'asc') : 'asc'
					setSort && setSort({ key: f.key, direction: next })
				}}
			>
				<Stack alignItems='center' justifyContent='space-between' direction={'row'} gap={1}>
					<Box component='span' sx={{ fontSize: 15, letterSpacing: 0.2 }}>
						{f.title}
					</Box>
					{f.sortable && (
						<Box
							component='span'
							aria-hidden
							className={`sortIcon${active ? ' active' : ''}`}
							sx={{
								display: 'inline-flex',
								opacity: active ? 1 : 0.4,
								transition: 'opacity 120ms linear',
							}}
						>
							{active ? (
								dir === 'asc' ? (
									<ArrowUpward fontSize='inherit' />
								) : (
									<ArrowDownward fontSize='inherit' />
								)
							) : (
								<UnfoldMore fontSize='inherit' />
							)}
						</Box>
					)}
				</Stack>
			</TableCell>
		)
	}

	const makeBodyCell = (f, row, rowIndex, colIndex) => {
		const value = getObjectValueFromStringPath(row, f.key)

		const sticky = stickyMeta[colIndex]
		const stickySx = sticky
			? {
					position: 'sticky',
					left: `${sticky.left}%`,
					zIndex: 2,
					backgroundColor: (theme) => theme.palette.background.paper,
					boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.06)',
			  }
			: null

		return (
			<TableCell
				key={colIndex}
				align={f.isNumeric ? 'right' : 'left'}
				sx={{
					width: `${widthsPct[colIndex]}%`,
					minWidth: f.minWidthPx ?? defaultMinWidthPx,
					p: 1,
					...stickySx,
				}}
			>
				<Box
					sx={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{f.render ? f.render(value, row, rowIndex) : value ?? ''}
				</Box>
			</TableCell>
		)
	}

	const handleSelectAll = (e) => {
		if (e.target.checked) {
			const allIds = data.map((d) => getObjectValueFromStringPath(d, rowKey))
			setSelectedRows(allIds)
		} else {
			setSelectedRows([])
		}
	}

	const handleSelectOne = (value) => {
		if (selectedRows.includes(value)) {
			setSelectedRows(selectedRows.filter((v) => v !== value))
		} else {
			setSelectedRows([...selectedRows, value])
		}
	}

	return (
		<TableContainer
			component={Paper}
			sx={{
				maxHeight: 560,
				border: (theme) => `1px solid ${theme.palette.divider}`,
				borderRadius: 2,
			}}
		>
			<Table stickyHeader={stickyHeader} sx={{ tableLayout: 'fixed', minWidth: totalMinWidthPx }}>
				<TableHead>
					<TableRow hover={false} sx={{ '&:hover': { bgcolor: 'inherit' } }}>
						{canSelectRows && (
							<TableCell padding='checkbox'>
								<Checkbox
									color='primary'
									indeterminate={selectedRows?.length > 0 && selectedRows?.length < data?.length}
									checked={data?.length > 0 && selectedRows?.length >= data?.length}
									onChange={handleSelectAll}
								/>
							</TableCell>
						)}
						{fields.map(makeHeaderCell)}
					</TableRow>
				</TableHead>
				<TableBody>
					{loading ? (
						<SkeletonTableRow colSpan={fields.length} />
					) : data?.length ? (
						data.map((row, rowIndex) => {
							const isItemSelected = canSelectRows
								? selectedRows.includes(getObjectValueFromStringPath(row, rowKey))
								: false

							return (
								<TableRow
									hover
									onClick={
										canSelectRows
											? () => handleSelectOne(getObjectValueFromStringPath(row, rowKey))
											: undefined
									}
									key={rowKey ? getObjectValueFromStringPath(row, rowKey) : rowIndex}
								>
									{canSelectRows && (
										<TableCell padding='checkbox'>
											<Checkbox
												color='primary'
												checked={isItemSelected}
												onChange={() => handleSelectOne(getObjectValueFromStringPath(row, rowKey))}
											/>
										</TableCell>
									)}
									{fields.map((f, colIndex) => makeBodyCell(f, row, rowIndex, colIndex))}
								</TableRow>
							)
						})
					) : (
						<EmptyRow colSpan={fields.length} />
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default GenericTable

// Usage Example:
/*
const { loading, error, data } = useFetch('/users', { sort }, [sort])
const [sort, setSort] = React.useState({ key: 'name', direction: 'asc' })

const fields = [
    { key: 'id', title: 'ID', width: 10, sortable: true, fixedColumn: true },
    { key: 'name', title: 'Name', width: 30, sortable: true },
    { key: 'age', title: 'Age', width: 10, isNumeric: true, sortable: true, render: (value) => value ? `${value} VND` : 'N/A' },
    { key: 'address.city', title: 'City', width: 20, sortable: false },
    { key: 'address.country', title: 'Country', width: 20, sortable: false },
    { key: '', title: 'Actions', width: 10, render: (value, row) => <Button onClick={() => handleEdit(row.id)}>Edit</Button> },
]

const testData = [
    { id: 1, name: 'John Doe', age: 28, address: { city: 'New York', country: 'USA' } },
    { id: 2, name: 'Jane Smith', age: 34, address: { city: 'London', country: 'UK' } },
]

<GenericTable
    data={data}
    fields={fields}
    sort={sort}
    onSortChange={setSort}
    rowKey="id"
    loading={loading}
    stickyHeader={true}
/>

*/
