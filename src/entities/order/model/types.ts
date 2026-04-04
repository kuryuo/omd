export interface Order {
  id: string
  customerName: string
  status: string
  amount: number
  createdAt: number
}

export interface CreateOrderPayload {
  customerName: string
  status: string
  amount: number
}

export interface UpdateOrderPayload {
  id: string
  changes: Partial<Pick<Order, 'customerName' | 'status' | 'amount'>>
}
