import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchOrdersRequest } from '../api/ordersApi'
import { normalizeApiError } from '../../../shared/lib/error/normalizeApiError'
import type { CreateOrderPayload, Order } from './types'
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

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null
    },
    hydrateOrdersLocal: (state, action: PayloadAction<Order[]>) => {
      state.items = action.payload
    },
    addOrderLocal: (state, action: PayloadAction<CreateOrderPayload>) => {
      const localOrder: Order = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        customerName: action.payload.customerName,
        status: action.payload.status,
        amount: action.payload.amount,
        createdAt: Math.floor(Date.now() / 1000),
      }

      state.items = [localOrder, ...state.items]
    },
    updateOrderStatusLocal: (
      state,
      action: PayloadAction<{ id: string; status: string }>,
    ) => {
      state.items = state.items.map((order) =>
        order.id === action.payload.id
          ? {
              ...order,
              status: action.payload.status,
            }
          : order,
      )
    },
    deleteOrderLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((order) => order.id !== action.payload)
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
  },
})

export const {
  clearOrdersError,
  hydrateOrdersLocal,
  addOrderLocal,
  updateOrderStatusLocal,
  deleteOrderLocal,
} = ordersSlice.actions
export const ordersReducer = ordersSlice.reducer

export const selectOrders = (state: RootState): Order[] => state.orders.items
export const selectOrdersLoading = (state: RootState): boolean => state.orders.isLoading
export const selectOrdersSubmitting = (state: RootState): boolean => state.orders.isSubmitting
export const selectOrdersError = (state: RootState): string | null => state.orders.error
