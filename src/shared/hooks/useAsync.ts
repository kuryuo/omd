import { useCallback, useState } from 'react'

interface UseAsyncState {
  isLoading: boolean
  error: string | null
}

interface UseAsyncResult {
  isLoading: boolean
  error: string | null
  run: <T>(task: () => Promise<T>) => Promise<T>
  clearError: () => void
}

export const useAsync = (): UseAsyncResult => {
  const [state, setState] = useState<UseAsyncState>({
    isLoading: false,
    error: null,
  })

  const clearError = useCallback((): void => {
    setState((previous) => ({ ...previous, error: null }))
  }, [])

  const run = useCallback(async <T,>(task: () => Promise<T>): Promise<T> => {
    setState({ isLoading: true, error: null })

    try {
      const result = await task()
      setState({ isLoading: false, error: null })
      return result
    } catch (error) {
      const normalizedError = error instanceof Error ? error.message : 'Request failed'
      setState({ isLoading: false, error: normalizedError })
      throw error
    }
  }, [])

  return {
    isLoading: state.isLoading,
    error: state.error,
    run,
    clearError,
  }
}
