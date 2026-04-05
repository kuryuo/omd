import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Select, Space } from 'antd'
import { memo, useEffect, useState } from 'react'

interface OrderFiltersProps {
  searchValue: string
  statusValue: string | null
  statuses: string[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: string | null) => void
  onCreateClick: () => void
}

export const OrderFilters = memo(({
  searchValue,
  statusValue,
  statuses,
  onSearchChange,
  onStatusChange,
  onCreateClick,
}: OrderFiltersProps) => {
  const [localSearchValue, setLocalSearchValue] = useState<string>(searchValue)

  useEffect(() => {
    setLocalSearchValue(searchValue)
  }, [searchValue])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      onSearchChange(localSearchValue)
    }, 250)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [localSearchValue, onSearchChange])

  return (
    <Row gutter={[12, 12]} justify="space-between" align="middle" className="filters-row">
      <Col xs={24} md={18}>
        <Space wrap className="filters-controls">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Поиск по имени клиента"
            value={localSearchValue}
            onChange={(event) => setLocalSearchValue(event.target.value)}
            className="filters-search"
          />
          <Select
            allowClear
            placeholder="Фильтр по статусу"
            value={statusValue ?? undefined}
            onChange={(value) => onStatusChange(value ?? null)}
            options={statuses.map((status) => ({ label: status, value: status }))}
            notFoundContent="Нет данных"
            className="filters-status"
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
})

OrderFilters.displayName = 'OrderFilters'
