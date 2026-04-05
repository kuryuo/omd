import { AutoComplete, Form, Input, InputNumber, Modal } from 'antd'
import type { CreateOrderPayload } from '../../../entities/order/model/types'

interface CreateOrderModalProps {
  open: boolean
  loading: boolean
  statuses: string[]
  onCancel: () => void
  onSubmit: (payload: CreateOrderPayload) => Promise<void>
}

export const CreateOrderModal = ({
  open,
  loading,
  statuses,
  onCancel,
  onSubmit,
}: CreateOrderModalProps) => {
  const [form] = Form.useForm<CreateOrderPayload>()

  const handleCancel = (): void => {
    form.resetFields()
    onCancel()
  }

  const handleFinish = async (values: CreateOrderPayload): Promise<void> => {
    await onSubmit(values)
    form.resetFields()
  }

  return (
    <Modal
      title="Новый заказ"
      open={open}
      okText="Создать"
      cancelText="Отмена"
      confirmLoading={loading}
      onCancel={handleCancel}
      onOk={() => {
        void form.submit()
      }}
    >
      <Form form={form} layout="vertical" onFinish={(values) => void handleFinish(values)}>
        <Form.Item
          name="customerName"
          label="Имя клиента"
          rules={[{ required: true, message: 'Введите имя клиента' }]}
        >
          <Input placeholder="Например: Иван Петров" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Статус"
          rules={[
            { required: true, message: 'Введите или выберите статус' },
            {
              validator: (_, value: string | undefined) => {
                if (typeof value === 'string' && value.trim().length > 0) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Статус не должен быть пустым'))
              },
            },
          ]}
        >
          <AutoComplete
            placeholder="Например: pending"
            options={statuses.map((status) => ({ label: status, value: status }))}
            notFoundContent="Нет данных"
            filterOption={(input, option) => {
              const optionValue = typeof option?.value === 'string' ? option.value : ''
              return optionValue.toLowerCase().includes(input.toLowerCase())
            }}
          />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Сумма"
          rules={[
            { required: true, message: 'Введите сумму' },
            { type: 'number', min: 1, message: 'Сумма должна быть больше 0' },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Введите сумму" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
