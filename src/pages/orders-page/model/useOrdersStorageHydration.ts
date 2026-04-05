import { useEffect, useRef, useState } from 'react'
import type { Order } from '../../../entities/order/model/types'
import {
  loadOrdersFromStorage,
  saveOrdersToStorage,
} from '../../../entities/order/lib/ordersLocalStorage'

interface UseOrdersStorageHydrationParams {
  orders: Order[]
  loadOrders: () => Promise<void>
  hydrateOrders: (orders: Order[]) => void
}

export const useOrdersStorageHydration = ({
  orders,
  loadOrders,
  hydrateOrders,
}: UseOrdersStorageHydrationParams): void => {
  const hasLoadedOnceRef = useRef<boolean>(false)
  const [isStorageHydrated, setStorageHydrated] = useState<boolean>(false)

  useEffect(() => {
    if (hasLoadedOnceRef.current) {
      return
    }

    hasLoadedOnceRef.current = true
    const savedOrders = loadOrdersFromStorage()

    if (savedOrders.length > 0) {
      hydrateOrders(savedOrders)
      setStorageHydrated(true)
      return
    }

    void loadOrders().finally(() => {
      setStorageHydrated(true)
    })
  }, [hydrateOrders, loadOrders])

  useEffect(() => {
    if (!isStorageHydrated) {
      return
    }

    saveOrdersToStorage(orders)
  }, [isStorageHydrated, orders])
}
