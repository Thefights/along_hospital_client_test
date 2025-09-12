import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone'
import { Stack, TableCell, TableRow, Typography } from '@mui/material'

const EmptyRow = ({
	colSpan = 1,
	title = 'No data yet…',
	description,
	icon = <ArchiveTwoToneIcon sx={{ fontSize: { xs: 72, sm: 96, md: 120 } }} />,
	buttons,
	minHeight = 200,
}) => {
	return (
		<TableRow hover={false}>
			<TableCell colSpan={colSpan} sx={{ py: 4 }}>
				<Stack
					direction='row'
					justifyContent='center'
					alignItems='center'
					spacing={3}
					sx={{ color: (t) => t.palette.text.secondary, minHeight }}
				>
					{icon}
					<Stack spacing={0.75}>
						<Typography variant='h6' sx={{ fontWeight: 600 }}>
							{title}
						</Typography>
						{description && (
							<Typography variant='body2' color='text.secondary'>
								{description}
							</Typography>
						)}
						{buttons && (
							<Stack direction='row' spacing={1.5} sx={{ mt: 1 }}>
								{buttons}
							</Stack>
						)}
					</Stack>
				</Stack>
			</TableCell>
		</TableRow>
	)
}

export default EmptyRow
