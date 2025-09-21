import { ShoppingCartOutlined } from '@mui/icons-material'
import { Badge, IconButton } from '@mui/material'

const CartButton = ({ count = 0, onClick }) => {
	return (
		<IconButton onClick={onClick} aria-label='Cart'>
			<Badge badgeContent={count} color='error' max={99} showZero>
				<ShoppingCartOutlined sx={{ color: 'common.black' }} />
			</Badge>
		</IconButton>
	)
}

export default CartButton
