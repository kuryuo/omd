import { useCallback, useState } from 'react'

interface UseAsyncResult {
  isLoading: boolean
  run: <T>(task: () => Promise<T>) => Promise<T>
}

export const useAsync = (): UseAsyncResult => {
  const [isLoading, setLoading] = useState<boolean>(false)

  const run = useCallback(async <T,>(task: () => Promise<T>): Promise<T> => {
    setLoading(true)

    try {
      const result = await task()
      setLoading(false)
      return result
    } catch (error) {
      setLoading(false)
      throw error
    }
  }, [])

  return {
    isLoading,
    run,
  }
}
