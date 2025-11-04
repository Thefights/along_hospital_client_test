import { routeUrls } from '@/configs/routeUrls'
import useReduxStore from '@/hooks/useReduxStore'
import SpecialtyDetailDialog from '@/pages/patients/specialtyPage/sections/SpecialtyDetailDialog'
import SpecialtyListSection from '@/pages/patients/specialtyPage/sections/SpecialtyListSection'
import { setSpecialtiesStore } from '@/redux/reducers/managementReducer'
import { Stack } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LETTERS = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]

const normalizeLetter = (value) => {
	if (!value || typeof value !== 'string') return '#'
	const letter = value.trim().charAt(0).toUpperCase()
	return /[A-Z]/.test(letter) ? letter : '#'
}

const pickDescription = (specialty) => {
	return specialty?.description
}

const SpecialtyPage = () => {
	const navigate = useNavigate()

	const specialtiesStore = useReduxStore({
		selector: (state) => state.management.specialties,
		setStore: setSpecialtiesStore,
	})

	const [searchTerm, setSearchTerm] = useState('')
	const [activeLetter, setActiveLetter] = useState('ALL')
	const [selectedSpecialty, setSelectedSpecialty] = useState(null)

	const specialties = useMemo(() => {
		if (!Array.isArray(specialtiesStore.data)) return []
		return specialtiesStore.data
	}, [specialtiesStore.data])

	const lettersWithData = useMemo(() => {
		return new Set(specialties.map((item) => normalizeLetter(item?.name)))
	}, [specialties])

	const filteredSpecialties = useMemo(() => {
		const needle = searchTerm.trim().toLowerCase()
		return specialties.filter((specialty) => {
			const matchesSearch =
				needle.length === 0 ||
				specialty?.name?.toLowerCase().includes(needle) ||
				pickDescription(specialty).toLowerCase().includes(needle)

			if (!matchesSearch) return false

			if (activeLetter === 'ALL') return true
			return normalizeLetter(specialty?.name) === activeLetter
		})
	}, [specialties, searchTerm, activeLetter])

	const groupedSpecialties = useMemo(() => {
		const map = new Map()
		filteredSpecialties.forEach((specialty) => {
			const letter = normalizeLetter(specialty?.name)
			if (!map.has(letter)) map.set(letter, [])
			map.get(letter).push(specialty)
		})

		return Array.from(map.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([letter, items]) => ({
				letter,
				items: items.sort((a, b) => (a?.name || '').localeCompare(b?.name || '')),
			}))
	}, [filteredSpecialties])

	const handleViewDetail = (specialty) => {
		setSelectedSpecialty(specialty)
	}

	const handleCloseDialog = () => {
		setSelectedSpecialty(null)
	}

	const handleBookAppointment = () => {
		handleCloseDialog()
		navigate(routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.APPOINTMENT.CREATE))
	}

	return (
		<Stack spacing={{ xs: 5, md: 6 }} py={{ xs: 2, md: 4 }}>
			<SpecialtyListSection
				letters={LETTERS}
				activeLetter={activeLetter}
				onLetterChange={(letter) => setActiveLetter(letter)}
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				groupedSpecialties={groupedSpecialties}
				onViewDetail={handleViewDetail}
				loading={specialtiesStore.loading}
				availableLetters={lettersWithData}
			/>
			<SpecialtyDetailDialog
				open={Boolean(selectedSpecialty)}
				specialty={selectedSpecialty}
				onClose={handleCloseDialog}
				onBook={handleBookAppointment}
			/>
		</Stack>
	)
}

export default SpecialtyPage
