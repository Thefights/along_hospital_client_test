import { Button, Stack } from '@mui/material'

const GenericTab = ({ label, icon, active = false, onClick, disabled = false }) => {
	return (
		<Button
			variant='outlined'
			onClick={onClick}
			disabled={disabled}
			size='medium'
			sx={(theme) => ({
				bgcolor: active ? '#E0ECFC' : '#E4E4E4',
				borderColor: active ? theme.palette.primary.light : '#C4C4C4',
				color: active ? '#204888' : '#161616',
				textTransform: 'none',
				fontWeight: active ? 'bold' : 'normal',
			})}
			startIcon={icon}
		>
			{label}
		</Button>
	)
}

/**
 *
 * @param {Array<{key: string, title: string}>} tabs
 * @param {string} currentTab
 * @param {function} setCurrentTab
 * @param {'row' | 'column'} direction
 * @returns
 */
const GenericTabs = ({
	tabs = [],
	currentTab,
	setCurrentTab = () => {},
	direction = 'row',
	maxWidth = '100%',
	maxHeight,
}) => {
	return (
		<Stack
			width={'100%'}
			spacing={1}
			justifyContent={'flex-start'}
			alignItems={'center'}
			direction={direction}
			maxWidth={maxWidth}
			maxHeight={maxHeight}
		>
			{tabs.map((tab) => (
				<GenericTab
					key={tab.key}
					label={tab.title}
					icon={tab.icon}
					active={currentTab.key === tab.key}
					disabled={tab.disabled}
					onClick={() => setCurrentTab(tab)}
				/>
			))}
		</Stack>
	)
}

export default GenericTabs

// Usage example:
/*
const statusTabs = [
	{ key: 'all', title: 'All', icon: <ListAlt /> },
	{ key: 'active', title: 'Active', icon: <Settings /> },
	{ key: 'inactive', title: 'Inactive', icon: <DisabledVisible /> },
]

const [currentStatusTab, setCurrentStatusTab] = useState(statusTabs.find((tab) => tab.key === 'all'))

<GenericTabs
	tabs={statusTabs}
	currentTab={currentCategoryTab}
	setCurrentTab={setCurrentCategoryTab}
/>

*/
