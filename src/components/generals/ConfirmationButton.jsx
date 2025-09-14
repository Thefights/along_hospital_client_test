import useTranslation from '@/hooks/useTranslation'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Slide,
} from '@mui/material'
import { forwardRef, useState } from 'react'

/**
 * @typedef {Object} CustomProps
 * @property {string} props.confirmationTitle
 * @property {string} props.confirmationDescription
 * @property {import('@mui/material').DialogProps['maxWidth']} props.dialogWidth
 * @property {'top' | 'bottom' | 'center'} props.dialogPosition
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
	dialogWidth = 'xs',
	dialogPosition = 'top',
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
				<Dialog
					open={open}
					onClose={handleClose}
					scroll='paper'
					fullWidth
					maxWidth={'xs'}
					slots={{
						transition: dialogPosition === 'top' ? Down : dialogPosition === 'bottom' ? Up : undefined,
					}}
					sx={
						dialogPosition === 'top'
							? {
									'& .MuiDialog-container': {
										alignItems: 'flex-start',
										justifyContent: 'center',
									},
							  }
							: dialogPosition === 'bottom'
							? {
									'& .MuiDialog-container': {
										alignItems: 'flex-end',
										justifyContent: 'center',
									},
							  }
							: {}
					}
				>
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

const Down = forwardRef(function Down(props, ref) {
	return <Slide direction='down' ref={ref} {...props} />
})

const Up = forwardRef(function Up(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />
})

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
