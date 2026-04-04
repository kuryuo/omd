import { Button, Col, Input, Row, Select, Space } from 'antd'

interface OrderFiltersProps {
  searchValue: string
  statusValue: string | null
  statuses: string[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: string | null) => void
  onCreateClick: () => void
}

export const OrderFilters = ({
  searchValue,
  statusValue,
  statuses,
  onSearchChange,
  onStatusChange,
  onCreateClick,
}: OrderFiltersProps) => {
  return (
    <Row gutter={[12, 12]} justify="space-between" align="middle">
      <Col xs={24} md={18}>
        <Space wrap>
          <Input.Search
            allowClear
            placeholder="Поиск по имени клиента"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            style={{ width: 260 }}
          />
          <Select
            allowClear
            placeholder="Фильтр по статусу"
            value={statusValue ?? undefined}
            onChange={(value) => onStatusChange(value ?? null)}
            options={statuses.map((status) => ({ label: status, value: status }))}
            style={{ width: 220 }}
          />
        </Space>
      </Col>
      <Col xs={24} md={6}>
        <Button type="primary" onClick={onCreateClick} block>
          Новый заказ
        </Button>
      </Col>
    </Row>
  )
}
