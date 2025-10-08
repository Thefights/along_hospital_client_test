import useTranslation from '@/hooks/useTranslation'
import { ShoppingCartOutlined } from '@mui/icons-material'
import { Badge, IconButton, Tooltip } from '@mui/material'

const CartButton = ({ count = 0, onClick }) => {
	const { t } = useTranslation()

	return (
		<Tooltip title={t('tooltip.cart')}>
			<IconButton onClick={onClick}>
				<Badge badgeContent={count} color='error' max={99} showZero>
					<ShoppingCartOutlined />
				</Badge>
			</IconButton>
		</Tooltip>
	)
}

export default CartButton
