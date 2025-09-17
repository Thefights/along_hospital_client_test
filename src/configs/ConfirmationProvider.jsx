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
import { createContext, forwardRef, useCallback, useMemo, useRef, useState } from 'react'

export const ConfirmationContext = createContext(
	/** @type {null | ((opts: ConfirmOptions)=>Promise<boolean>)} */ (null)
)

const Down = forwardRef(function Down(props, ref) {
	return <Slide direction='down' ref={ref} {...props} />
})
const Up = forwardRef(function Up(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />
})

export default function ConfirmationProvider({ children }) {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const resolverRef = useRef(null)
	const [opts, setOpts] = useState({
		title: '',
		description: '',
		confirmColor: 'primary',
		confirmText: 'OK',
		width: 'xs',
		position: 'top',
	})

	const confirm = useCallback(
		(options = {}) => {
			return new Promise((resolve) => {
				setOpts((prev) => ({
					title: options.title ?? prev.title,
					description: options.description ?? prev.description,
					confirmColor: options.confirmColor ?? 'primary',
					confirmText: options.confirmText ?? 'OK',
					width: options.width ?? 'xs',
					position: options.position ?? 'top',
				}))
				resolverRef.current = resolve
				setOpen(true)
			})
		},
		[t]
	)

	const handleClose = useCallback((result) => {
		setOpen(false)
		if (resolverRef.current) {
			resolverRef.current(result)
			resolverRef.current = null
		}
	}, [])

	const transition = useMemo(() => {
		if (opts.position === 'top') return Down
		if (opts.position === 'bottom') return Up
		return undefined
	}, [opts.position])

	const containerSx = useMemo(() => {
		if (opts.position === 'top') {
			return { '& .MuiDialog-container': { alignItems: 'flex-start', justifyContent: 'center' } }
		}
		if (opts.position === 'bottom') {
			return { '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' } }
		}
		return {}
	}, [opts.position])

	const onClose = useCallback(
		(_, reason) => {
			if (opts.disableBackdropClose && (reason === 'backdropClick' || reason === 'escapeKeyDown'))
				return
			handleClose(false)
		},
		[handleClose]
	)

	const ctxValue = useMemo(() => confirm, [confirm])

	return (
		<ConfirmationContext.Provider value={ctxValue}>
			{children}
			<Dialog
				open={open}
				onClose={onClose}
				fullWidth
				maxWidth={opts.width}
				scroll='paper'
				slots={{ transition }}
				sx={containerSx}
			>
				{opts.title ? <DialogTitle>{opts.title}</DialogTitle> : null}
				{opts.description ? (
					<DialogContent>
						{typeof opts.description === 'string' ? (
							<DialogContentText>{opts.description}</DialogContentText>
						) : (
							opts.description
						)}
					</DialogContent>
				) : null}
				<DialogActions>
					<Button onClick={() => handleClose(false)} color='inherit'>
						{t('button.cancel')}
					</Button>
					<Button onClick={() => handleClose(true)} variant='contained' color={opts.confirmColor}>
						{opts.confirmText}
					</Button>
				</DialogActions>
			</Dialog>
		</ConfirmationContext.Provider>
	)
}
