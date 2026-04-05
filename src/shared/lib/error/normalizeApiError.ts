import axios from 'axios'

export const normalizeApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return 'Сеть недоступна или API endpoint истек. Проверьте текущую ссылку API.'
    }

    const serverMessage = error.response?.data
    if (typeof serverMessage === 'string' && serverMessage.length > 0) {
      return serverMessage
    }

    if (error.response?.status === 400) {
      return 'Ошибка запроса к API (400). Проверьте корректность payload и доступность endpoint.'
    }

    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Непредвиденная ошибка API'
}
