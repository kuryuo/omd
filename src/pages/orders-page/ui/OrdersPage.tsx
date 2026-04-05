import { App, Card, Flex, Skeleton } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import {
  addOrderLocal,
  clearOrdersError,
  deleteOrderLocal,
  fetchOrders,
  hydrateOrdersLocal,
  selectOrders,
  selectOrdersError,
  selectOrdersLoading,
  updateOrderStatusLocal,
} from '../../../entities/order/model/ordersSlice'
import type { CreateOrderPayload, Order } from '../../../entities/order/model/types'
import { filterOrders } from '../../../entities/order/lib/filterOrders'
import { CreateOrderModal } from '../../../features/order-create/ui/CreateOrderModal'
import { OrderStats } from '../../../widgets/order-stats/ui/OrderStats'
import { OrdersTable } from '../../../widgets/orders-table/ui/OrdersTable'
import { useAsync } from '../../../shared/hooks/useAsync'
import { OrderFilters } from '../../../features/order-filters/ui/OrderFilters'
import { useOrdersQueryParams } from '../model/useOrdersQueryParams'
import { useOrdersStorageHydration } from '../model/useOrdersStorageHydration'

export const OrdersPage = () => {
  const { notification } = App.useApp()
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectOrders)
  const isLoading = useAppSelector(selectOrdersLoading)
  const error = useAppSelector(selectOrdersError)

  const { searchValue, setSearchValue, statusValue, setStatusValue } = useOrdersQueryParams()
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false)
  const { run: runFetch, isLoading: isFetchRunning } = useAsync()

  const loadOrders = useCallback(async (): Promise<void> => {
    try {
      await runFetch(async () => {
        await dispatch(fetchOrders()).unwrap()
      })
    } catch {
      return
    }
  }, [dispatch, runFetch])

  const hydrateOrders = useCallback(
    (savedOrders: Order[]): void => {
      dispatch(hydrateOrdersLocal(savedOrders))
    },
    [dispatch],
  )

  useOrdersStorageHydration({
    orders,
    loadOrders,
    hydrateOrders,
  })

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
  }, [dispatch, error, notification])

  const statuses = useMemo<string[]>(() => {
    const allStatuses = new Set<string>()
    orders.forEach((order) => {
      allStatuses.add(order.status)
    })
    return Array.from(allStatuses)
  }, [orders])

  const filteredOrders = useMemo<Order[]>(() => {
    return filterOrders(orders, {
      searchValue,
      statusValue,
    })
  }, [orders, searchValue, statusValue])

  const handleCreateOrder = useCallback(async (payload: CreateOrderPayload): Promise<void> => {
    dispatch(
      addOrderLocal({
        ...payload,
        customerName: payload.customerName.trim(),
        status: payload.status.trim(),
      }),
    )

    setSearchValue('')
    setStatusValue(null)
    setCreateModalOpen(false)
  }, [dispatch])

  const handleStatusChange = useCallback(async (orderId: string, status: string): Promise<void> => {
    dispatch(updateOrderStatusLocal({ id: orderId, status: status.trim() }))
  }, [dispatch])

  const handleDeleteOrder = useCallback(async (orderId: string): Promise<void> => {
    dispatch(deleteOrderLocal(orderId))
  }, [dispatch])

  return (
    <Card className="orders-page-card">
      <Flex vertical gap={16}>
        <OrderStats orders={filteredOrders} />

        <OrderFilters
          searchValue={searchValue}
          statusValue={statusValue}
          statuses={statuses}
          onSearchChange={setSearchValue}
          onStatusChange={setStatusValue}
          onCreateClick={() => setCreateModalOpen(true)}
        />

        {isLoading && orders.length === 0 ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <OrdersTable
            orders={filteredOrders}
            loading={isLoading || isFetchRunning}
            statuses={statuses}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteOrder}
          />
        )}

        <CreateOrderModal
          open={isCreateModalOpen}
          loading={false}
          statuses={statuses}
          onCancel={() => setCreateModalOpen(false)}
          onSubmit={handleCreateOrder}
        />
      </Flex>
    </Card>
  )
}
