import type { Order } from '../model/types'

const ORDERS_STORAGE_KEY = 'orders-dashboard-local'

export const loadOrdersFromStorage = (): Order[] => {
  if (typeof window === 'undefined') {
    return []
  }

  const rawValue = window.localStorage.getItem(ORDERS_STORAGE_KEY)
  if (rawValue === null) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is Order => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.customerName === 'string' &&
        typeof item.status === 'string' &&
        typeof item.amount === 'number' &&
        typeof item.createdAt === 'number'
      )
    })
  } catch {
    return []
  }
}

export const saveOrdersToStorage = (orders: Order[]): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}
