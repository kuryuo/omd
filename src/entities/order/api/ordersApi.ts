import axios from 'axios'
import type { CreateOrderPayload, Order, UpdateOrderPayload } from '../model/types'

const ordersApi = axios.create({
  baseURL: 'https://69d0b59590cd06523d5d6996.mockapi.io/api/v1/orders',
  timeout: 10000,
})

export const fetchOrdersRequest = async (): Promise<Order[]> => {
  const { data } = await ordersApi.get<Order[]>('/')
  return data
}

export const createOrderRequest = async (payload: CreateOrderPayload): Promise<Order> => {
  const { data } = await ordersApi.post<Order>('/', {
    ...payload,
    createdAt: Math.floor(Date.now() / 1000),
  })
  return data
}

export const updateOrderRequest = async (payload: UpdateOrderPayload): Promise<Order> => {
  const { id, changes } = payload
  const { data } = await ordersApi.patch<Order>(`/${id}`, changes)
  return data
}

export const deleteOrderRequest = async (id: string): Promise<string> => {
  await ordersApi.delete(`/${id}`)
  return id
}
