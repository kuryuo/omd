import { describe, expect, it } from 'vitest'
import {
  addOrderLocal,
  deleteOrderLocal,
  fetchOrders,
  ordersReducer,
  updateOrderStatusLocal,
} from './ordersSlice'
import type { Order } from './types'

const fixtureOrder: Order = {
  id: '1',
  customerName: 'Ivan Ivanov',
  status: 'pending',
  amount: 12000,
  createdAt: 1775286353,
}

describe('ordersSlice reducers', () => {
  it('stores fetched orders', () => {
    const state = ordersReducer(
      undefined,
      fetchOrders.fulfilled([fixtureOrder], 'request-id', undefined),
    )

    expect(state.items).toHaveLength(1)
    expect(state.items[0]?.id).toBe('1')
    expect(state.isLoading).toBe(false)
  })

  it('prepends created local order', () => {
    const previousState = {
      items: [fixtureOrder],
      isLoading: false,
      error: null,
    }

    const state = ordersReducer(
      previousState,
      addOrderLocal({
        customerName: 'Anna Smirnova',
        status: 'paid',
        amount: 9000,
      }),
    )

    expect(state.items).toHaveLength(2)
    expect(state.items[0]?.customerName).toBe('Anna Smirnova')
    expect(state.items[1]?.id).toBe('1')
  })

  it('updates status for specific local order', () => {
    const previousState = {
      items: [fixtureOrder],
      isLoading: false,
      error: null,
    }

    const state = ordersReducer(
      previousState,
      updateOrderStatusLocal({ id: fixtureOrder.id, status: 'paid' }),
    )

    expect(state.items[0]?.status).toBe('paid')
  })

  it('removes order by id locally', () => {
    const previousState = {
      items: [fixtureOrder],
      isLoading: false,
      error: null,
    }

    const state = ordersReducer(previousState, deleteOrderLocal(fixtureOrder.id))

    expect(state.items).toHaveLength(0)
  })
})
