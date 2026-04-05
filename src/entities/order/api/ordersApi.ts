import axios from 'axios'
import type { Order } from '../model/types'

const ordersApi = axios.create({
  baseURL: 'https://69d0b59590cd06523d5d6996.mockapi.io/api/v1/orders',
  timeout: 10000,
})

interface MockApiOrder {
  id: string
  customerName: string
  status: string
  amount: number | string
  createdAt: number | string
}

const toNumber = (value: number | string): number => {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const mapMockApiOrder = (order: MockApiOrder): Order => ({
  id: order.id,
  customerName: order.customerName,
  status: order.status,
  amount: toNumber(order.amount),
  createdAt: toNumber(order.createdAt),
})

export const fetchOrdersRequest = async (): Promise<Order[]> => {
  const { data } = await ordersApi.get<MockApiOrder[]>('')
  return data.map(mapMockApiOrder)
}
