import { Skeleton, Stack, TableCell, TableRow } from '@mui/material'

const TableRowSkeleton = ({ numberOfRow = 3 }) => {
  return (
    <>
      {Array.from({ length: numberOfRow }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={100000000}>
            <Stack spacing={1}>
              <Skeleton variant='text' animation='wave' />
              <Skeleton variant='text' animation='wave' width={'90%'} />
              <Skeleton variant='text' animation='wave' width={'80%'} />
              <Skeleton variant='text' animation='wave' width={'70%'} />
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default TableRowSkeleton
