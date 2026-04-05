import { describe, expect, it } from 'vitest'
import { filterOrders } from './filterOrders'
import type { Order } from '../model/types'

const ordersFixture: Order[] = [
  {
    id: '1',
    customerName: 'Ivan Ivanov',
    status: 'pending',
    amount: 12000,
    createdAt: 1775286353,
  },
  {
    id: '2',
    customerName: 'Petr Petrov',
    status: 'paid',
    amount: 9000,
    createdAt: 1775286293,
  },
  {
    id: '3',
    customerName: 'Anna Smirnova',
    status: 'pending',
    amount: 22000,
    createdAt: 1775286233,
  },
]

describe('filterOrders', () => {
  it('filters by customer name case-insensitively', () => {
    const result = filterOrders(ordersFixture, {
      searchValue: 'iVan',
      statusValue: null,
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('1')
  })

  it('filters by selected status', () => {
    const result = filterOrders(ordersFixture, {
      searchValue: '',
      statusValue: 'pending',
    })

    expect(result).toHaveLength(2)
    expect(result.map((item) => item.id)).toEqual(['1', '3'])
  })

  it('combines search and status filters', () => {
    const result = filterOrders(ordersFixture, {
      searchValue: 'anna',
      statusValue: 'pending',
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('3')
  })
})
