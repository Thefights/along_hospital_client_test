/* eslint-disable react-hooks/exhaustive-deps */
import { isEmptyValue } from '@/utils/handleBooleanUtil'
import { useEffect, useMemo } from 'react'
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
	url,
	selector,
	setStore,
	dataToGet = (x) => x,
	dataToStore = (x) => x,
}) {
	const dispatch = useDispatch()
	const storeData = useSelector(selector)

	const { loading, error, data: fetchedData, fetch } = useFetch(url, {}, [], false)

	const needFetch = isEmptyValue(storeData)
	useEffect(() => {
		if (needFetch) fetch()
	}, [needFetch, fetch])

	useEffect(() => {
		if (fetchedData != null) {
			const payload = dataToStore(fetchedData)
			dispatch(setStore(payload))
		}
	}, [fetchedData])

	const data = useMemo(() => dataToGet(storeData), [storeData])

	return { loading, error, data, fetch }
}
