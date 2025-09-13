import useTranslation from '@/hooks/useTranslation'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material'
import { useState } from 'react'

/**
 * @typedef {Object} CustomProps
 * @property {string} props.confirmationTitle
 * @property {string} props.confirmationDescription
 * @property {string} props.confirmButtonText
 * @property {import('@mui/material').ButtonProps['color']} props.confirmButtonColor
 * @property {function} props.onConfirm
 * /

/**
 * @param {import('@mui/material').ButtonProps & CustomProps} props
 */
const ConfirmationButton = ({
	confirmationTitle,
	confirmationDescription,
	confirmButtonColor = 'primary',
	confirmButtonText = 'OK',
	onConfirm,
	children,
	...props
}) => {
	const [open, setOpen] = useState(false)
	const { t } = useTranslation()

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleConfirm = () => {
		onConfirm()
		handleClose()
	}

	return (
		<>
			<Button {...props} onClick={handleOpen}>
				{children}
			</Button>
			{open && (
				<Dialog open={open} onClose={handleClose} scroll='paper'>
					<DialogTitle>{confirmationTitle}</DialogTitle>
					<DialogContent>
						<DialogContentText>{confirmationDescription}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleConfirm} variant='contained' color={confirmButtonColor}>
							{confirmButtonText}
						</Button>
						<Button onClick={handleClose} color='inherit'>
							{t('button.cancel')}
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</>
	)
}

export default ConfirmationButton

/* <ConfirmationButton
	confirmationTitle='Title'
	confirmationDescription='Descripion'
	confirmButtonText='Delete'
	confirmButtonColor='error'
	onConfirm={() => alert('Hello world!')}
>
	Hello world
</ConfirmationButton> 
*/
