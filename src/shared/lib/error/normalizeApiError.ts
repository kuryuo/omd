import axios from 'axios'

export const normalizeApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data
    if (typeof serverMessage === 'string' && serverMessage.length > 0) {
      return serverMessage
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Непредвиденная ошибка API'
}
