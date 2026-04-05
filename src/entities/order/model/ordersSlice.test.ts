import { describe, expect, it } from 'vitest'
import {
  createOrder,
  deleteOrder,
  fetchOrders,
  ordersReducer,
  updateOrder,
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

  it('prepends created order', () => {
    const previousState = {
      items: [fixtureOrder],
      isLoading: false,
      isSubmitting: true,
      error: null,
    }

    const newOrder: Order = {
      ...fixtureOrder,
      id: '2',
      customerName: 'Anna Smirnova',
    }

    const state = ordersReducer(
      previousState,
      createOrder.fulfilled(newOrder, 'request-id', {
        customerName: newOrder.customerName,
        status: newOrder.status,
        amount: newOrder.amount,
      }),
    )

    expect(state.items[0]?.id).toBe('2')
    expect(state.items[1]?.id).toBe('1')
    expect(state.isSubmitting).toBe(false)
  })

  it('updates status for specific order', () => {
    const previousState = {
      items: [fixtureOrder],
      isLoading: false,
      isSubmitting: true,
      error: null,
    }

    const updated: Order = {
      ...fixtureOrder,
      status: 'paid',
    }

    const state = ordersReducer(
      previousState,
      updateOrder.fulfilled(updated, 'request-id', {
        id: fixtureOrder.id,
        changes: { status: 'paid' },
      }),
    )

    expect(state.items[0]?.status).toBe('paid')
    expect(state.isSubmitting).toBe(false)
  })

  it('removes order by id', () => {
    const previousState = {
      items: [fixtureOrder],
      isLoading: false,
      isSubmitting: true,
      error: null,
    }

    const state = ordersReducer(
      previousState,
      deleteOrder.fulfilled(fixtureOrder.id, 'request-id', fixtureOrder.id),
    )

    expect(state.items).toHaveLength(0)
    expect(state.isSubmitting).toBe(false)
  })
})
