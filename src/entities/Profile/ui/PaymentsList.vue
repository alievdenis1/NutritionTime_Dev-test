<template>
	<div class="space-y-4">
		<div
			v-if="loading"
			class="flex justify-center p-8"
		>
			<VLoading />
		</div>

		<template v-else>
			<div
				v-for="payment in sortedPayments"
				:key="payment.id"
				class="p-4 rounded-lg border border-gray-700 bg-gray-800/50"
			>
				<div class="flex justify-between items-start">
					<div>
						<p class="font-medium">
							Подписка на {{ payment.months ?? 1 }} мес.
						</p>
						<div class="mt-1 text-sm text-gray-400 space-y-1">
							<p>{{ formatDate(payment.created_at) }}</p>
							<p>{{ formatAmount(payment) }}</p>
						</div>
					</div>

					<div class="text-right">
						<span
							class="px-2 py-1 rounded text-sm font-medium"
							:class="getStatusClasses(payment.status)"
						>
							{{ getStatusText(payment.status) }}
						</span>
					</div>
				</div>
			</div>

			<div
				v-if="!payments.length"
				class="text-center text-gray-400 py-8"
			>
				История платежей пуста
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
 import { computed } from 'vue'
 import { VLoading } from '@/shared/components/Loading'
 import type { SubscriptionPayment } from '../model'

 const { payments, loading } = defineProps<{
  payments: SubscriptionPayment[]
  loading: boolean
 }>()

 // Сортировка платежей по дате (новые сверху)
 const sortedPayments = computed(() => {
  return [...payments].sort((a, b) =>
   new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
 })

 // Форматирование даты
 const formatDate = (date: string) => {
  return new Date(date).toLocaleString('ru-RU', {
   year: 'numeric',
   month: 'long',
   day: 'numeric',
   hour: '2-digit',
   minute: '2-digit'
  })
 }

 // Форматирование суммы платежа
 const formatAmount = (payment: SubscriptionPayment) => {
  let amount = ''

  if (payment.payment_type === 'ton') {
   amount = `${payment.amount_ton} TON`
  } else {
   amount = `${payment.amount_rub} ₽`
  }

  return `Сумма: ${amount}`
 }

 // Получение текста статуса
 const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
   'PENDING': 'Ожидает оплаты',
   'COMPLETED': 'Оплачен',
   'CANCELLED': 'Отменён'
  }

  return statusMap[status] || status
 }

 // Получение классов для статуса
 const getStatusClasses = (status: string) => {
  const baseClasses = 'inline-block'

  const statusClassMap: Record<string, string> = {
   'PENDING': 'bg-yellow-900/50 text-yellow-400',
   'COMPLETED': 'bg-green-900/50 text-green-400',
   'CANCELLED': 'bg-red-900/50 text-red-400'
  }

  return `${baseClasses} ${statusClassMap[status] || 'bg-gray-900/50 text-gray-400'}`
 }
</script>