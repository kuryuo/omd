import { App, Button, Card, Flex, Skeleton } from 'antd'
import { DatabaseOutlined, ReloadOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import {
  clearOrdersError,
  createOrder,
  deleteOrder,
  fetchOrders,
  seedTestOrders,
  selectOrders,
  selectOrdersError,
  selectOrdersLoading,
  selectOrdersSubmitting,
  updateOrder,
} from '../../../entities/order/model/ordersSlice'
import type { CreateOrderPayload, Order } from '../../../entities/order/model/types'
import { filterOrders } from '../../../entities/order/lib/filterOrders'
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
  const isSubmitting = useAppSelector(selectOrdersSubmitting)
  const error = useAppSelector(selectOrdersError)

  const [searchValue, setSearchValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string | null>(null)
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false)
  const { run: runFetch, isLoading: isFetchRunning } = useAsync()
  const isSeedInProgressRef = useRef<boolean>(false)
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
    void loadOrders()
  }, [loadOrders])

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
    try {
      await dispatch(
        createOrder({
          ...payload,
          customerName: payload.customerName.trim(),
          status: payload.status.trim(),
        }),
      ).unwrap()
    } catch (error) {
      void notification.error({
        message: 'Ошибка создания заказа',
        description: error instanceof Error ? error.message : 'Не удалось создать заказ',
        placement: 'topRight',
      })
      return
    }

    setSearchValue('')
    setStatusValue(null)
    setCreateModalOpen(false)
  }, [dispatch])

  const handleStatusChange = useCallback(async (orderId: string, status: string): Promise<void> => {
    try {
      await dispatch(updateOrder({ id: orderId, changes: { status: status.trim() } })).unwrap()
    } catch (error) {
      void notification.error({
        message: 'Ошибка обновления',
        description: error instanceof Error ? error.message : 'Не удалось обновить заказ',
        placement: 'topRight',
      })
    }
  }, [dispatch])

  const handleDeleteOrder = useCallback(async (orderId: string): Promise<void> => {
    try {
      await dispatch(deleteOrder(orderId)).unwrap()
    } catch (error) {
      void notification.error({
        message: 'Ошибка удаления',
        description: error instanceof Error ? error.message : 'Не удалось удалить заказ',
        placement: 'topRight',
      })
    }
  }, [dispatch])

  const handleSeedOrders = useCallback(async (): Promise<void> => {
    if (isSeedInProgressRef.current) {
      return
    }

    isSeedInProgressRef.current = true
    try {
      await dispatch(seedTestOrders(30)).unwrap()
      void notification.success({
        message: 'Тестовые заказы созданы',
        description: 'Добавлено 30 заказов',
        placement: 'topRight',
      })
    } catch {
      void notification.error({
        message: 'Ошибка создания тестовых заказов',
        description: 'Не удалось создать тестовые заказы. Проверьте API endpoint.',
        placement: 'topRight',
      })
      return
    } finally {
      isSeedInProgressRef.current = false
    }
  }, [dispatch])

  return (
    <Card className="orders-page-card">
      <Flex vertical gap={16}>
        <OrderStats orders={filteredOrders} />

        <Flex justify="flex-end" gap={8} wrap className="orders-actions">
          <Button
            icon={<DatabaseOutlined />}
            loading={isSubmitting}
            onClick={() => {
              void handleSeedOrders()
            }}
          >
            Создать 30 тестовых
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => void loadOrders()}>
            Обновить
          </Button>
        </Flex>

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
          loading={isSubmitting}
          statuses={statuses}
          onCancel={() => setCreateModalOpen(false)}
          onSubmit={handleCreateOrder}
        />
      </Flex>
    </Card>
  )
}
