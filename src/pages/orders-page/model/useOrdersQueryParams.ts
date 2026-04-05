import { useEffect, useState } from 'react'

interface UseOrdersQueryParamsResult {
  searchValue: string
  statusValue: string | null
  setSearchValue: (value: string) => void
  setStatusValue: (value: string | null) => void
}

const getInitialQueryState = (): { searchValue: string; statusValue: string | null } => {
  const queryParams = new URLSearchParams(window.location.search)

  return {
    searchValue: queryParams.get('search') ?? '',
    statusValue: queryParams.get('status'),
  }
}

export const useOrdersQueryParams = (): UseOrdersQueryParamsResult => {
  const initialState = getInitialQueryState()
  const [searchValue, setSearchValue] = useState<string>(initialState.searchValue)
  const [statusValue, setStatusValue] = useState<string | null>(initialState.statusValue)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)

    if (searchValue.trim().length > 0) {
      queryParams.set('search', searchValue)
    } else {
      queryParams.delete('search')
    }

    if (statusValue !== null && statusValue.length > 0) {
      queryParams.set('status', statusValue)
    } else {
      queryParams.delete('status')
    }

    const query = queryParams.toString()
    const nextUrl = query.length > 0 ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState(null, '', nextUrl)
  }, [searchValue, statusValue])

  return {
    searchValue,
    statusValue,
    setSearchValue,
    setStatusValue,
  }
}
