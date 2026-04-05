import type { Order } from '../model/types'

const ORDERS_STORAGE_KEY = 'orders-dashboard-local'

const isOrder = (value: unknown): value is Order => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const order = value as Partial<Order>
  return (
    typeof order.id === 'string' &&
    typeof order.customerName === 'string' &&
    typeof order.status === 'string' &&
    typeof order.amount === 'number' &&
    typeof order.createdAt === 'number'
  )
}

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

    return parsed.filter(isOrder)
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
