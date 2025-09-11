import useTimeout from './useTimeout'

export default function useDebounce(callback, delay = 500, dependencies = []) {
	const debounceTimeout = useTimeout(callback, delay)
	useEffect(debounceTimeout.reset, [...dependencies, debounceTimeout.reset])
	useEffect(debounceTimeout.clear, [])
}

// Usage example:
// const [searchValue, setSearchValue] = useState('')
// useDebounce(() => console.log(searchValue), 500, [searchValue])
