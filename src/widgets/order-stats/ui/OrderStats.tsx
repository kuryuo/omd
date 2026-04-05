import { Card, Col, Row, Statistic } from 'antd'
import type { Order } from '../../../entities/order/model/types'

interface OrderStatsProps {
  orders: Order[]
}

const amountFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export const OrderStats = ({ orders }: OrderStatsProps) => {
  const totalAmount = orders.reduce((accumulator, item) => accumulator + item.amount, 0)
  const averageAmount = orders.length > 0 ? Math.round(totalAmount / orders.length) : 0

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic title="Всего заказов" value={orders.length} />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic title="Общая сумма" value={amountFormatter.format(totalAmount)} />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic title="Средний чек" value={amountFormatter.format(averageAmount)} />
        </Card>
      </Col>
    </Row>
  )
}
