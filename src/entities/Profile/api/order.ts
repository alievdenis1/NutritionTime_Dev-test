import useApi from '@/shared/lib/api/use-api'
import type { Order, PaymentStatus } from '../model'
import { PreparedPayment } from '../model'

export function getOrder(id: number) {
 return useApi<Order>('get', `/orders/${id}`)
}

export function createOrder(orderData: Partial<Order>) {
 return useApi<Order>('post', '/orders', orderData)
}

export function updateOrder(id: number, orderData: Partial<Order>) {
 return useApi<Order>('patch', `/orders/${id}`, orderData)
}

export function cancelPayment(paymentId: number) {
 return useApi<{ message: string }>('post', `/payments/${paymentId}/cancel`)
}

export function checkPaymentStatus(orderId: number) {
 return useApi<{ status: PaymentStatus }>('get', `/payments/status/${orderId}`)
}

export function preparePayment(orderId: number) {
 return useApi<PreparedPayment>('post', '/payments/prepare', { order_id: orderId })
}
