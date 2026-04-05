import { Button, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import { memo } from 'react'
import type { Order } from '../../../entities/order/model/types'

interface OrdersTableProps {
  orders: Order[]
  loading: boolean
  statuses: string[]
  onStatusChange: (orderId: string, status: string) => Promise<void>
  onDelete: (orderId: string) => Promise<void>
}

const amountFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const normalizeTimestamp = (value: number): number => {
  return value > 9999999999 ? value : value * 1000
}

const statusColorMap: Record<string, string> = {
  pending: '#d48806',
  processing: '#1677ff',
  paid: '#389e0d',
  shipped: '#08979c',
  delivered: '#52c41a',
  cancelled: '#cf1322',
}

export const OrdersTable = memo(({
  orders,
  loading,
  statuses,
  onStatusChange,
  onDelete,
}: OrdersTableProps) => {
  const columns: TableColumnsType<Order> = [
    {
      title: 'Клиент',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string) => <Typography.Text strong>{name}</Typography.Text>,
      ellipsis: true,
      width: 220,
      onHeaderCell: () => ({ style: { userSelect: 'none' } }),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 220,
      onHeaderCell: () => ({ style: { userSelect: 'none' } }),
      render: (status: string, record: Order) => (
        <Select
          className="order-status-select"
          variant="borderless"
          value={status}
          options={statuses.map((value) => ({
            label: (
              <span
                style={{
                  color: statusColorMap[value.toLowerCase()] ?? 'inherit',
                  fontWeight: 600,
                }}
              >
                {value}
              </span>
            ),
            value,
          }))}
          notFoundContent="Нет данных"
          onChange={(value) => {
            void onStatusChange(record.id, value)
          }}
          style={{ minWidth: 180 }}
        />
      ),
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (left, right) => left.amount - right.amount,
      render: (amount: number) => <Tag>{amountFormatter.format(amount)}</Tag>,
      width: 150,
      onHeaderCell: () => ({ style: { userSelect: 'none' } }),
    },
    {
      title: 'Создан',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (left, right) => left.createdAt - right.createdAt,
      render: (createdAt: number) => dateFormatter.format(new Date(normalizeTimestamp(createdAt))),
      width: 180,
      onHeaderCell: () => ({ style: { userSelect: 'none' } }),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 140,
      onHeaderCell: () => ({ style: { userSelect: 'none' } }),
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Удалить заказ?"
            description="Действие нельзя отменить"
            okText="Удалить"
            cancelText="Отмена"
            onConfirm={() => onDelete(record.id)}
          >
            <Button type="link" danger>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      rowKey="id"
      className="orders-table"
      columns={columns}
      dataSource={orders}
      loading={loading}
      locale={{ emptyText: 'Список заказов пуст' }}
      pagination={{
        pageSize: 6,
        showSizeChanger: true,
        pageSizeOptions: [6, 10, 20],
        showTotal: (total) => `Всего: ${total}`,
      }}
      showSorterTooltip={false}
      size="middle"
      scroll={{ x: 860 }}
    />
  )
})

OrdersTable.displayName = 'OrdersTable'
