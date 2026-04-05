import type { Order } from '../model/types'

export interface OrderFilters {
  searchValue: string
  statusValue: string | null
}

const includesIgnoreCase = (source: string, query: string): boolean => {
  return source.toLowerCase().includes(query.toLowerCase())
}

export const filterOrders = (orders: Order[], filters: OrderFilters): Order[] => {
  const normalizedQuery = filters.searchValue.trim()

  return orders.filter((order) => {
    const byName = includesIgnoreCase(order.customerName, normalizedQuery)
    const byStatus = filters.statusValue === null ? true : order.status === filters.statusValue

    return byName && byStatus
  })
}
