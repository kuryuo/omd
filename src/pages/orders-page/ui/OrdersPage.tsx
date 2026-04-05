import { App, Card, Flex, Skeleton } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import {
  loadOrdersFromStorage,
  saveOrdersToStorage,
} from '../../../entities/order/lib/ordersLocalStorage'
import { CreateOrderModal } from '../../../features/order-create/ui/CreateOrderModal'
import { OrderFilters } from '../../../features/order-filters/ui/OrderFilters'
import { useAsync } from '../../../shared/hooks/useAsync'
import { OrderStats } from '../../../widgets/order-stats/ui/OrderStats'
import { OrdersTable } from '../../../widgets/orders-table/ui/OrdersTable'

export const OrdersPage = () => {
  const { notification } = App.useApp()
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectOrders)
  const isLoading = useAppSelector(selectOrdersLoading)
  const error = useAppSelector(selectOrdersError)

  const [searchValue, setSearchValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string | null>(null)
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false)
  const [isStorageHydrated, setStorageHydrated] = useState<boolean>(false)
  const { run: runFetch, isLoading: isFetchRunning } = useAsync()
  const hasLoadedOnceRef = useRef<boolean>(false)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const querySearch = queryParams.get('search')
    const queryStatus = queryParams.get('status')

    if (querySearch !== null) {
      setSearchValue(querySearch)
    }

    if (queryStatus !== null) {
      setStatusValue(queryStatus)
    }
  }, [])

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)

    if (searchValue.trim().length > 0) {
      queryParams.set('search', searchValue)
    } else {
      queryParams.delete('search')
    }

    if (statusValue !== null && statusValue.length > 0) {
      queryParams.set('status', statusValue)
    } else {
      queryParams.delete('status')
    }

    const query = queryParams.toString()
    const nextUrl = query.length > 0 ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState(null, '', nextUrl)
  }, [searchValue, statusValue])

  const loadOrders = useCallback(async (): Promise<void> => {
    try {
      await runFetch(async () => {
        await dispatch(fetchOrders()).unwrap()
      })
    } catch {
      return
    }
  }, [dispatch, runFetch])

  useEffect(() => {
    if (hasLoadedOnceRef.current) {
      return
    }

    hasLoadedOnceRef.current = true
    const savedOrders = loadOrdersFromStorage()

    if (savedOrders.length > 0) {
      dispatch(hydrateOrdersLocal(savedOrders))
      setStorageHydrated(true)
      return
    }

    void loadOrders().finally(() => {
      setStorageHydrated(true)
    })
  }, [dispatch, loadOrders])

  useEffect(() => {
    if (!isStorageHydrated) {
      return
    }

    saveOrdersToStorage(orders)
  }, [isStorageHydrated, orders])

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
