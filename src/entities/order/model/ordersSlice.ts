import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createTestOrdersRequest,
  createOrderRequest,
  deleteOrderRequest,
  fetchOrdersRequest,
  updateOrderRequest,
} from '../api/ordersApi'
import { normalizeApiError } from '../../../shared/lib/error/normalizeApiError'
import type { CreateOrderPayload, Order, UpdateOrderPayload } from './types'
import type { RootState } from '../../../app/store/store'

interface OrdersState {
  items: Order[]
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
}

const initialState: OrdersState = {
  items: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
}

export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOrdersRequest()
    } catch (error) {
      return rejectWithValue(normalizeApiError(error))
    }
  },
)

export const createOrder = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { rejectValue: string }
>('orders/create', async (payload, { rejectWithValue }) => {
  try {
    return await createOrderRequest(payload)
  } catch (error) {
    return rejectWithValue(normalizeApiError(error))
  }
})

export const updateOrder = createAsyncThunk<
  Order,
  UpdateOrderPayload,
  { rejectValue: string }
>('orders/update', async (payload, { rejectWithValue }) => {
  try {
    return await updateOrderRequest(payload)
  } catch (error) {
    return rejectWithValue(normalizeApiError(error))
  }
})

export const deleteOrder = createAsyncThunk<string, string, { rejectValue: string }>(
  'orders/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteOrderRequest(id)
    } catch (error) {
      return rejectWithValue(normalizeApiError(error))
    }
  },
)

export const seedTestOrders = createAsyncThunk<Order[], number, { rejectValue: string }>(
  'orders/seedTestOrders',
  async (count, { rejectWithValue }) => {
    try {
      return await createTestOrdersRequest(count)
    } catch (error) {
      return rejectWithValue(normalizeApiError(error))
    }
  },
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Не удалось загрузить заказы'
      })
      .addCase(createOrder.pending, (state) => {
        state.isSubmitting = true
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.items = [action.payload, ...state.items]
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload ?? 'Не удалось создать заказ'
      })
      .addCase(updateOrder.pending, (state) => {
        state.isSubmitting = true
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.items = state.items.map((order) =>
          order.id === action.payload.id ? action.payload : order,
        )
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload ?? 'Не удалось обновить заказ'
      })
      .addCase(deleteOrder.pending, (state) => {
        state.isSubmitting = true
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.items = state.items.filter((order) => order.id !== action.payload)
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload ?? 'Не удалось удалить заказ'
      })
      .addCase(seedTestOrders.pending, (state) => {
        state.isSubmitting = true
      })
      .addCase(seedTestOrders.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.items = [...action.payload, ...state.items]
      })
      .addCase(seedTestOrders.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload ?? 'Не удалось создать тестовые заказы'
      })
  },
})

export const {
  clearOrdersError,
} = ordersSlice.actions
export const ordersReducer = ordersSlice.reducer

export const selectOrders = (state: RootState): Order[] => state.orders.items
export const selectOrdersLoading = (state: RootState): boolean => state.orders.isLoading
export const selectOrdersSubmitting = (state: RootState): boolean =>
  state.orders.isSubmitting
export const selectOrdersError = (state: RootState): string | null => state.orders.error
