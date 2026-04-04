import { Table, Tag, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import type { Order } from '../../../entities/order/model/types'

interface OrdersTableProps {
  orders: Order[]
  loading: boolean
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

export const OrdersTable = ({ orders, loading }: OrdersTableProps) => {
  const columns: TableColumnsType<Order> = [
    {
      title: 'Клиент',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string) => <Typography.Text strong>{name}</Typography.Text>,
      width: 220,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag>{status}</Tag>,
      width: 160,
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (left, right) => left.amount - right.amount,
      render: (amount: number) => <Tag color="blue">{amountFormatter.format(amount)}</Tag>,
      width: 150,
    },
    {
      title: 'Создан',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (left, right) => left.createdAt - right.createdAt,
      render: (createdAt: number) => dateFormatter.format(new Date(normalizeTimestamp(createdAt))),
      width: 180,
    },
  ]

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={orders}
      loading={loading}
      locale={{ emptyText: 'Список заказов пуст' }}
      pagination={{ pageSize: 6, showSizeChanger: true, pageSizeOptions: [6, 10, 20] }}
      scroll={{ x: 820 }}
    />
  )
}
