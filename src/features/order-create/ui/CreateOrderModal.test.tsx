import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CreateOrderModal } from './CreateOrderModal'

describe('CreateOrderModal validation', () => {
  it('shows required validation and blocks submit for empty form', async () => {
    const onSubmit = vi.fn(async () => undefined)

    render(
      <CreateOrderModal
        open
        loading={false}
        statuses={['pending', 'paid']}
        onCancel={() => undefined}
        onSubmit={onSubmit}
      />, 
    )

    fireEvent.click(screen.getByRole('button', { name: 'Создать' }))

    expect(await screen.findByText('Введите имя клиента')).toBeInTheDocument()
    expect(await screen.findByText('Введите или выберите статус')).toBeInTheDocument()
    expect(await screen.findByText('Введите сумму')).toBeInTheDocument()

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })
})
