import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import { useAxiosSubmit } from '@/hooks/useAxiosSubmit'
import useEnum from '@/hooks/useEnum'
import useFetch from '@/hooks/useFetch'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { ArrowBack } from '@mui/icons-material'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlogUpsertFormSection from './sections/BlogUpsertFormSection'

const BlogUpsertPage = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { id: blogIdParam } = useParams()
	const blogId = blogIdParam
	const isEditMode = Boolean(blogId)
	const { blogTypeOptions } = useEnum()
	const editorRef = useRef(null)

	const { values, handleChange, setField, reset } = useForm({
		title: '',
		blogType: '',
		content: '',
		image: null,
	})

	const [errors, setErrors] = useState({})
	const [imagePreview, setImagePreview] = useState(null)
	const [shouldRemoveImage, setShouldRemoveImage] = useState(false)
	const [editorLoaded, setEditorLoaded] = useState(false)
	const dataLoadedRef = useRef(false)

	const getBlogDetail = useFetch(
		ApiUrls.BLOG.MANAGEMENT.DETAIL(blogId),
		{},
		blogId && isEditMode ? [blogId] : []
	)

	const blogSubmit = useAxiosSubmit({
		url: isEditMode ? ApiUrls.BLOG.MANAGEMENT.DETAIL(blogId) : ApiUrls.BLOG.MANAGEMENT.INDEX,
		method: isEditMode ? 'PUT' : 'POST',
	})

	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://cdn.ckeditor.com/4.22.1/standard-all/ckeditor.js'
		script.async = true
		document.head.appendChild(script)

		script.onload = () => {
			if (!window.CKEDITOR || !editorRef.current) return

			const css = document.createElement('style')
			css.textContent = `
				figure[class*=easyimage-gradient]::before { 
					content: ""; 
					position: absolute; 
					top: 0; 
					bottom: 0; 
					left: 0; 
					right: 0; 
				}
				figure[class*=easyimage-gradient] figcaption { 
					position: relative; 
					z-index: 2; 
				}
				.easyimage-gradient-1::before { 
					background-image: linear-gradient( 135deg, rgba( 115, 110, 254, 0 ) 0%, rgba( 66, 174, 234, .72 ) 100% ); 
				}
				.easyimage-gradient-2::before { 
					background-image: linear-gradient( 135deg, rgba( 115, 110, 254, 0 ) 0%, rgba( 228, 66, 234, .72 ) 100% ); 
				}
			`
			document.head.appendChild(css)

			const editorInstance = window.CKEDITOR.replace(editorRef.current, {
				versionCheck: false,
				extraPlugins: 'easyimage',
				removePlugins: 'image',
				removeDialogTabs: 'link:advanced',
				toolbar: [
					{ name: 'document', items: ['Undo', 'Redo'] },
					{ name: 'styles', items: ['Format'] },
					{ name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat'] },
					{ name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
					{ name: 'links', items: ['Link', 'Unlink'] },
					{ name: 'insert', items: ['EasyImageUpload'] },
				],
				height: 400,
				cloudServices_uploadUrl: 'https://33333.cke-cs.com/easyimage/upload/',
				cloudServices_tokenUrl:
					'https://33333.cke-cs.com/token/dev/ijrDsqFix838Gh3wGO3F77FSW94BwcLXprJ4APSp3XQ26xsUHTi0jcb1hoBt',
				easyimage_styles: {
					gradient1: {
						group: 'easyimage-gradients',
						attributes: { class: 'easyimage-gradient-1' },
						label: 'Blue Gradient',
						icon:
							'https://ckeditor.com/docs/ckeditor4/4.25.1-lts/examples/assets/easyimage/icons/gradient1.png',
						iconHiDpi:
							'https://ckeditor.com/docs/ckeditor4/4.25.1-lts/examples/assets/easyimage/icons/hidpi/gradient1.png',
					},
					gradient2: {
						group: 'easyimage-gradients',
						attributes: { class: 'easyimage-gradient-2' },
						label: 'Pink Gradient',
						icon:
							'https://ckeditor.com/docs/ckeditor4/4.25.1-lts/examples/assets/easyimage/icons/gradient2.png',
						iconHiDpi:
							'https://ckeditor.com/docs/ckeditor4/4.25.1-lts/examples/assets/easyimage/icons/hidpi/gradient2.png',
					},
					noGradient: {
						group: 'easyimage-gradients',
						attributes: { class: 'easyimage-no-gradient' },
						label: 'No Gradient',
						icon:
							'https://ckeditor.com/docs/ckeditor4/4.25.1-lts/examples/assets/easyimage/icons/nogradient.png',
						iconHiDpi:
							'https://ckeditor.com/docs/ckeditor4/4.25.1-lts/examples/assets/easyimage/icons/hidpi/nogradient.png',
					},
				},
				easyimage_toolbar: [
					'EasyImageFull',
					'EasyImageSide',
					'EasyImageGradient1',
					'EasyImageGradient2',
					'EasyImageNoGradient',
					'EasyImageAlt',
				],
				removeButtons: 'PasteFromWord',
			})

			editorInstance?.on('instanceReady', () => {
				setEditorLoaded(true)
			})
		}

		return () => {
			if (window.CKEDITOR && editorRef.current) {
				window.CKEDITOR.instances[editorRef.current.id]?.destroy()
			}
		}
	}, [])

	useEffect(() => {
		if (!editorLoaded) return
		const instance = window.CKEDITOR?.instances?.[editorRef.current?.id]
		if (!instance) return
		const desiredData = values.content || ''
		if (instance.getData() !== desiredData) {
			instance.setData(desiredData)
		}
	}, [editorLoaded, values.content])

	useEffect(() => {
		dataLoadedRef.current = false
	}, [blogId])

	useEffect(() => {
		if (!isEditMode || !blogId || !getBlogDetail.data || dataLoadedRef.current) return
		const blog = getBlogDetail.data
		dataLoadedRef.current = true
		reset({
			title: blog.title ?? '',
			blogType: blog.blogType ?? '',
			content: blog.content ?? '',
			image: null,
		})
		setImagePreview(blog.image ? getImageFromCloud(blog.image) : null)
		setShouldRemoveImage(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getBlogDetail.data, isEditMode, blogId])

	const handleImageChange = (event) => {
		const file = event.target.files?.[0]
		if (file) {
			setField('image', file)

			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreview(e.target.result)
			}
			reader.readAsDataURL(file)
			setShouldRemoveImage(false)
		}

		if (event.target) {
			event.target.value = ''
		}
	}

	const handleRemoveImage = () => {
		setField('image', null)
		setImagePreview(null)
		setShouldRemoveImage(true)
	}

	const headerTitle = `${t(`button.${isEditMode ? 'update' : 'create'}`)} Blog`
	const submitButtonLabel = blogSubmit.loading
		? isEditMode
			? t('button.submitting')
			: t('button.creating')
		: t(`button.${isEditMode ? 'update' : 'create'}`)
	const isFormDisabled = getBlogDetail.loading || blogSubmit.loading

	const handleSubmit = async (event) => {
		event.preventDefault()
		if (isFormDisabled) return

		const editorContent =
			window.CKEDITOR?.instances?.[editorRef.current?.id]?.getData() || values.content
		const updatedContent = { ...values, content: editorContent }

		const newErrors = {}
		if (!updatedContent.title?.trim()) {
			newErrors.title = t('error.required')
		} else if (updatedContent.title.length > 255) {
			newErrors.title = t('error.max_length', { max: 255 })
		}

		if (!updatedContent.blogType) {
			newErrors.blogType = t('error.required')
		}

		if (!editorContent?.trim()) {
			newErrors.content = t('error.required')
		} else if (editorContent.length > 10000) {
			newErrors.content = t('error.max_length', { max: 10000 })
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}

		try {
			const formDataToSend = new FormData()
			formDataToSend.append('Title', updatedContent.title)
			formDataToSend.append('Content', editorContent)
			formDataToSend.append('BlogType', updatedContent.blogType)
			if (updatedContent.image) {
				formDataToSend.append('Image', updatedContent.image)
			}
			if (shouldRemoveImage && isEditMode) {
				formDataToSend.append('RemoveImage', 'true')
			}

			const response = await blogSubmit.submit(formDataToSend)
			if (response) {
				navigate(routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.BLOG.INDEX))
			}
		} catch (error) {}
	}

	const handleBack = () => {
		navigate(routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.BLOG.INDEX))
	}

	return (
		<Paper sx={{ py: 2, px: 3, mt: 2 }}>
			<Stack direction='row' alignItems='center' spacing={2} mb={3}>
				<Button
					startIcon={<ArrowBack />}
					onClick={handleBack}
					variant='outlined'
					disabled={blogSubmit.loading}
				>
					{t('button.back')}
				</Button>
				<Typography variant='h5' fontWeight='bold'>
					{headerTitle}
				</Typography>
			</Stack>
			<BlogUpsertFormSection
				isEditMode={isEditMode}
				detailLoading={getBlogDetail.loading}
				t={t}
				onSubmit={handleSubmit}
				formData={values}
				errors={errors}
				onInputChange={setField}
				onImageChange={handleImageChange}
				onRemoveImage={handleRemoveImage}
				blogTypeOptions={blogTypeOptions}
				imagePreview={imagePreview}
				submitButtonLabel={submitButtonLabel}
				isFormDisabled={isFormDisabled}
				editorRef={editorRef}
				onBack={handleBack}
				isSubmitting={blogSubmit.loading}
				canRemoveImage={Boolean(imagePreview)}
			/>
		</Paper>
	)
}

export default BlogUpsertPage
