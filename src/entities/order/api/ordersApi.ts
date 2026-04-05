import axios from 'axios'
import type { CreateOrderPayload, Order, UpdateOrderPayload } from '../model/types'

const ordersApi = axios.create({
  baseURL: 'https://crudcrud.com/api/a1f611c1656245eda1948e63b556118d/orders',
  timeout: 10000,
})

interface CrudCrudOrder {
  _id: string
  customerName: string
  status: string
  amount: number
  createdAt: number
}

const TEST_STATUSES = ['pending', 'processing', 'paid', 'shipped', 'delivered']
const TEST_CUSTOMERS = [
  'Иван Иванов',
  'Мария Петрова',
  'Анна Смирнова',
  'Олег Сидоров',
  'Екатерина Орлова',
  'Дмитрий Кузнецов',
  'Алина Воронцова',
  'Сергей Морозов',
  'Наталья Фомина',
  'Павел Никитин',
]

const mapCrudCrudOrder = (order: CrudCrudOrder): Order => ({
  id: order._id,
  customerName: order.customerName,
  status: order.status,
  amount: order.amount,
  createdAt: order.createdAt,
})

export const fetchOrdersRequest = async (): Promise<Order[]> => {
  const { data } = await ordersApi.get<CrudCrudOrder[]>('/')
  return data.map(mapCrudCrudOrder)
}

export const createOrderRequest = async (payload: CreateOrderPayload): Promise<Order> => {
  const { data } = await ordersApi.post<CrudCrudOrder>('/', {
    ...payload,
    createdAt: Math.floor(Date.now() / 1000),
  })
  return mapCrudCrudOrder(data)
}

export const updateOrderRequest = async (payload: UpdateOrderPayload): Promise<Order> => {
  const { id, changes } = payload
  const { data } = await ordersApi.patch<CrudCrudOrder>(`/${id}`, changes)
  return mapCrudCrudOrder(data)
}

export const deleteOrderRequest = async (id: string): Promise<string> => {
  await ordersApi.delete(`/${id}`)
  return id
}

export const createTestOrdersRequest = async (count: number): Promise<Order[]> => {
  const now = Math.floor(Date.now() / 1000)

  const requests: Array<Promise<CrudCrudOrder>> = Array.from({ length: count }, (_, index) => {
    const customerName = `${TEST_CUSTOMERS[index % TEST_CUSTOMERS.length]} #${index + 1}`
    const status = TEST_STATUSES[index % TEST_STATUSES.length]
    const amount = 1200 + ((index * 731) % 38000)
    const createdAt = now - index * 3600

    return ordersApi
      .post<CrudCrudOrder>('/', {
        customerName,
        status,
        amount,
        createdAt,
      })
      .then((response) => response.data)
  })

  const created = await Promise.all(requests)
  return created.map(mapCrudCrudOrder)
}
