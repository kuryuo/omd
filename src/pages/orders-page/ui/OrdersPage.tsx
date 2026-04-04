import { Card, Flex, Skeleton, notification } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import {
  clearOrdersError,
  fetchOrders,
  selectOrders,
  selectOrdersError,
  selectOrdersLoading,
} from '../../../entities/order/model/ordersSlice'
import type { Order } from '../../../entities/order/model/types'
import { OrderFilters } from '../../../features/order-filters/ui/OrderFilters'
import { OrdersTable } from '../../../widgets/orders-table/ui/OrdersTable'

const includesIgnoreCase = (source: string, query: string): boolean => {
  return source.toLowerCase().includes(query.toLowerCase())
}

export const OrdersPage = () => {
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectOrders)
  const isLoading = useAppSelector(selectOrdersLoading)
  const error = useAppSelector(selectOrdersError)

  const [searchValue, setSearchValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string | null>(null)

  useEffect(() => {
    void dispatch(fetchOrders())
  }, [dispatch])

  useEffect(() => {
    if (error === null) {
      return
    }

    void notification.error({
      message: 'Ошибка запроса',
      description: error,
      placement: 'topRight',
    })
    dispatch(clearOrdersError())
  }, [dispatch, error])

  const statuses = useMemo<string[]>(() => {
    return Array.from(new Set(orders.map((order) => order.status)))
  }, [orders])

  const filteredOrders = useMemo<Order[]>(() => {
    const normalized = searchValue.trim()

    return orders.filter((order) => {
      const byName = includesIgnoreCase(order.customerName, normalized)
      const byStatus = statusValue === null ? true : order.status === statusValue
      return byName && byStatus
    })
  }, [orders, searchValue, statusValue])

  return (
    <Card>
      <Flex vertical gap={16}>
        <OrderFilters
          searchValue={searchValue}
          statusValue={statusValue}
          statuses={statuses}
          onSearchChange={setSearchValue}
          onStatusChange={setStatusValue}
        />

        {isLoading && orders.length === 0 ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <OrdersTable orders={filteredOrders} loading={isLoading} />
        )}
      </Flex>
    </Card>
  )
}
