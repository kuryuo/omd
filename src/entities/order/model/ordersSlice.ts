import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchOrdersRequest } from '../api/ordersApi'
import { normalizeApiError } from '../../../shared/lib/error/normalizeApiError'
import type { Order } from './types'
import type { RootState } from '../../../app/store/store'

interface OrdersState {
  items: Order[]
  isLoading: boolean
  error: string | null
}

const initialState: OrdersState = {
  items: [],
  isLoading: false,
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

export const { clearOrdersError } = ordersSlice.actions
export const ordersReducer = ordersSlice.reducer

export const selectOrders = (state: RootState): Order[] => state.orders.items
export const selectOrdersLoading = (state: RootState): boolean => state.orders.isLoading
export const selectOrdersError = (state: RootState): string | null => state.orders.error
