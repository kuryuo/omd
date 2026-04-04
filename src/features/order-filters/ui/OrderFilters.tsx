import { Col, Input, Row, Select, Space } from 'antd'

interface OrderFiltersProps {
  searchValue: string
  statusValue: string | null
  statuses: string[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: string | null) => void
}

export const OrderFilters = ({
  searchValue,
  statusValue,
  statuses,
  onSearchChange,
  onStatusChange,
}: OrderFiltersProps) => {
  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} md={14}>
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
            options={statuses.map((status) => ({ label: status, value: status }))}
            onChange={(value) => onStatusChange(value ?? null)}
            style={{ width: 220 }}
          />
        </Space>
      </Col>
    </Row>
  )
}
