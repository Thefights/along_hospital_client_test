/* eslint-disable react-hooks/exhaustive-deps */
import { isEmptyValue } from '@/utils/handleBooleanUtil'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useFetch from './useFetch'

/**
 * @typedef {import('@/redux/store').RootState} RootState
 */

/**
 * @param {object} params
 * @param {string} params.url
 * @param {(state: RootState) => any} params.selector
 * @param {(payload: any) => any} params.setStore
 * @param {(storeValue: any) => any} [params.dataToGet=(x)=>x]
 * @param {(apiValue: any) => any} [params.dataToStore=(x)=>x]
 */
export default function useReduxStore({
	url: overrideUrl,
	selector,
	setStore,
	dataToGet = (x) => x,
	dataToStore = (x) => x,
}) {
	const dispatch = useDispatch()
	const storeData = useSelector(selector)

	const finalUrl = overrideUrl || setStore?.defaultUrl || ''

	const { loading, error, data: fetchedData, fetch } = useFetch(finalUrl, {}, [], false)

	const [fetchedOnce, setFetchedOnce] = useState(false)
	const needFetch = isEmptyValue(storeData)

	useEffect(() => {
		if (needFetch) fetch()
	}, [needFetch, fetch])

	useEffect(() => {
		if (fetchedData != null) {
			const payload = dataToStore(fetchedData)
			dispatch(setStore(payload))
			setFetchedOnce(true)
		}
	}, [fetchedData])

	const data = useMemo(() => dataToGet(storeData), [storeData])

	const resetStore = useCallback(
		(next) => {
			const payload = typeof next === 'function' ? next(storeData) : next
			dispatch(setStore(payload))
		},
		[dispatch, setStore, storeData]
	)

	return { loading, error, data, fetch, resetStore, fetchedOnce }
}
