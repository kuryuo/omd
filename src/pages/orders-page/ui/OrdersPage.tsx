import { Button, Card, Flex, Skeleton, notification } from 'antd'
import { DatabaseOutlined, ReloadOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectOrders)
  const isLoading = useAppSelector(selectOrdersLoading)
  const isSubmitting = useAppSelector(selectOrdersSubmitting)
  const error = useAppSelector(selectOrdersError)

  const [searchValue, setSearchValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string | null>(null)
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

  useEffect(() => {
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

  const handleCreateOrder = async (payload: CreateOrderPayload): Promise<void> => {
    await dispatch(
      createOrder({
        ...payload,
        customerName: payload.customerName.trim(),
        status: payload.status.trim(),
      }),
    ).unwrap()

    setSearchValue('')
    setStatusValue(null)
    setCreateModalOpen(false)
  }

  const handleStatusChange = async (orderId: string, status: string): Promise<void> => {
    await dispatch(updateOrder({ id: orderId, changes: { status: status.trim() } })).unwrap()
  }

  const handleDeleteOrder = async (orderId: string): Promise<void> => {
    await dispatch(deleteOrder(orderId)).unwrap()
  }

  const handleSeedOrders = async (): Promise<void> => {
    try {
      await dispatch(seedTestOrders(30)).unwrap()
      void notification.success({
        message: 'Тестовые заказы созданы',
        description: 'Добавлено 30 заказов',
        placement: 'topRight',
      })
    } catch {
      return
    }
  }

  return (
    <Card className="orders-page-card">
      <Flex vertical gap={16}>
        <OrderStats orders={filteredOrders} />

        <Flex justify="flex-end" gap={8}>
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
