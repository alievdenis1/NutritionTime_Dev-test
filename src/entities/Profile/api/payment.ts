import useApi from '@/shared/lib/api/use-api'
import type { PaymentStatus } from '../model'
import { PreparedPayment, PaymentMethodType } from '../model'

export function cancelPayment(paymentId: number) {
 return useApi<{ message: string }>('post', `/payments/${paymentId}/cancel`)
}

export function checkPaymentStatus(orderId: number) {
 return useApi<{ status: PaymentStatus }>('get', `/payments/status/${orderId}`)
}

export function preparePayment(
 telegramId: number,
 paymentType: PaymentMethodType,
 months: 1 | 3
) {
 return useApi<PreparedPayment>('post', '/payments/prepare', {
  telegram_id: telegramId,
  payment_type: paymentType,
  months
 })
}