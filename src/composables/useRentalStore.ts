import { ref, computed } from 'vue'
import type { RentalOrder, OrderStatus } from '@/types'

const orders = ref<RentalOrder[]>([])

function generateOrderId(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

function generatePickupNumber(): string {
  const num = orders.value.length + 1
  return `A${String(num).padStart(3, '0')}`
}

export function useRentalStore() {
  const pendingOrders = computed(() =>
    orders.value.filter(o => o.status === 'pending')
  )

  const confirmedOrders = computed(() =>
    orders.value.filter(o => o.status === 'confirmed')
  )

  const allOrders = computed(() => orders.value)

  function createOrder(order: Omit<RentalOrder, 'orderId' | 'pickupNumber' | 'status' | 'createdAt'>): RentalOrder {
    const newOrder: RentalOrder = {
      ...order,
      orderId: generateOrderId(),
      pickupNumber: generatePickupNumber(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    orders.value.push(newOrder)
    return newOrder
  }

  function updateOrderStatus(orderId: string, status: OrderStatus): void {
    const order = orders.value.find(o => o.orderId === orderId)
    if (order) {
      order.status = status
    }
  }

  function getOrder(orderId: string): RentalOrder | undefined {
    return orders.value.find(o => o.orderId === orderId)
  }

  function getOrderByPickupNumber(pickupNumber: string): RentalOrder | undefined {
    return orders.value.find(o => o.pickupNumber === pickupNumber)
  }

  return {
    orders,
    pendingOrders,
    confirmedOrders,
    allOrders,
    createOrder,
    updateOrderStatus,
    getOrder,
    getOrderByPickupNumber,
  }
}
