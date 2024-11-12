<template>
	<div class="min-h-screen pt-5 bg-gradient-to-br from-green-800 to-green-900 flex flex-col relative overflow-hidden">
		<TabsMain :default-value="activeTab">
			<TabsList>
				<TabsTrigger value="plans">
					Тарифы
				</TabsTrigger>
				<TabsTrigger value="payments">
					Платежи
				</TabsTrigger>
			</TabsList>

			<!-- Тарифы -->
			<TabsContent value="plans">
				<!-- Выбор плана -->
				<div
					v-if="!selectedPlan"
					class="grid md:grid-cols-3 gap-6 p-4"
				>
					<SubscriptionPlan
						v-for="plan in subscriptionPlans"
						:key="plan.months"
						:months="plan.months"
						:price="plan.price"
						:features="plan.features"
						:selected="false"
						@select="selectPlan(plan)"
					/>
				</div>

				<!-- Выбор метода оплаты -->
				<div
					v-else
					class="p-4 space-y-6"
				>
					<div class="flex items-center justify-between">
						<h3 class="text-xl font-semibold">
							Подписка на {{ selectedPlan.months }} {{ monthDeclension }}
						</h3>
						<VButton
							variant="outline"
							size="sm"
							@click="handleBack"
						>
							Назад к тарифам
						</VButton>
					</div>

					<div class="space-y-4">
						<p class="text-lg">
							Выберите способ оплаты:
						</p>
						<div class="grid grid-cols-3 gap-4">
							<PaymentMethod
								v-for="method in paymentMethods"
								:key="method.type"
								:type="method.type"
								:title="method.title"
								:selected="selectedPaymentMethod?.type === method.type"
								@select="selectPaymentMethod(method)"
							/>
						</div>
					</div>

					<div
						v-if="calculatedAmount"
						class="text-center text-lg"
					>
						К оплате: {{ calculatedAmount.amount }} {{ calculatedAmount.currency }}
					</div>

					<!-- Кнопка оплаты -->
					<VButton
						class="w-full"
						:disabled="!selectedPaymentMethod || isProcessing"
						@click="handlePayment"
					>
						<div class="flex items-center justify-center">
							<VLoading
								v-if="isProcessing"
								class="mr-2"
							/>
							<span>{{ isProcessing ? 'Обработка...' : 'Оплатить' }}</span>
						</div>
					</VButton>
				</div>
			</TabsContent>

			<!-- Платежи -->
			<TabsContent value="payments">
				<div class="p-4">
					<PaymentsList
						:payments="userPayments"
						:loading="paymentsLoading"
					/>
				</div>
			</TabsContent>
		</TabsMain>
	</div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted } from 'vue'
 import { storeToRefs } from 'pinia'
 import { openLink } from '@telegram-apps/sdk'
 import { useSessionStore } from '@/entities/Session'
 import { TabsContent, TabsList, TabsMain, TabsTrigger } from 'shared/components/ui/tabs'
 import { VButton } from '@/shared/components/Button'
 import { VLoading } from '@/shared/components/Loading'
 import { SubscriptionPlan, PaymentMethod, PaymentsList } from './index.ts'
 import { createPayment, getUserPayments, calculateAmount } from '../api'
 import type { SubscriptionPayment } from '../model'

 // Store и telegram_id
 const userStore = useSessionStore()
 const { userInfo } = storeToRefs(userStore)
 const telegramId = ref(~~(userInfo.value?.telegram_id ?? ''))

 // Состояние
 const activeTab = ref('plans')
 const selectedPlan = ref<{
  months: number
  price: number
  features: string[]
 } | null>(null)
 const selectedPaymentMethod = ref<{
  type: 'ton' | 'yummy' | 'gram'
  title: string
 } | null>(null)
 const isProcessing = ref(false)
 const userPayments = ref<SubscriptionPayment[]>([])
 const paymentsLoading = ref(false)
 const calculatedAmount = ref<{ amount: string; currency: string } | null>(null)

 // Вычисляемые свойства
 const monthDeclension = computed(() => {
  const months = selectedPlan.value?.months || 0
  if (months === 1) return 'месяц'
  if (months > 1 && months < 5) return 'месяца'
  return 'месяцев'
 })

 // Данные тарифных планов
 const subscriptionPlans = [
  {
   months: 1,
   price: 490,
   features: ['Базовый функционал', 'Поддержка 24/7']
  },
  {
   months: 3,
   price: 1290,
   features: ['Все с базового тарифа', 'Скидка 12%', 'Расширенная статистика']
  },
  {
   months: 12,
   price: 4490,
   features: ['Все с квартального тарифа', 'Скидка 24%', 'Премиум поддержка']
  }
 ]

 // Методы оплаты
 const paymentMethods = [
  { type: 'ton' as const, title: 'TON' },
  { type: 'yummy' as const, title: 'Yummy' },
  { type: 'gram' as const, title: 'Gram' }
 ]

 // Методы
 const selectPlan = (plan: typeof subscriptionPlans[0]) => {
  selectedPlan.value = plan
  selectedPaymentMethod.value = null
  calculatedAmount.value = null
 }

 const handleBack = () => {
  selectedPlan.value = null
  selectedPaymentMethod.value = null
  calculatedAmount.value = null
 }

 const selectPaymentMethod = async (method: typeof paymentMethods[0]) => {
  selectedPaymentMethod.value = method

  if (selectedPlan.value) {
   try {
    const calculateApi = calculateAmount({
     payment_type: method.type,
     months: selectedPlan.value.months
    })

    await calculateApi.execute()

    if (!calculateApi.error.value && calculateApi.data.value) {
     calculatedAmount.value = calculateApi.data.value
    }
   } catch (error) {
    console.error('Calculate amount error:', error)
   }
  }
 }

 const handlePayment = async () => {
  if (!selectedPlan.value || !selectedPaymentMethod.value) return

  try {
   isProcessing.value = true
   const paymentApi = createPayment({
    telegram_id: telegramId.value,
    payment_type: selectedPaymentMethod.value.type,
    months: selectedPlan.value.months
   })

   await paymentApi.execute()

   if (!paymentApi.error.value && paymentApi.data.value?.paymentUrl) {
    const paymentUrl = paymentApi.data.value.paymentUrl

    if (openLink.isAvailable()) {
     openLink(paymentUrl, {
      tryInstantView: true
     })
    } else {
     window.open(paymentUrl, '_blank')
    }
    fetchUserPayments()
   }
  } catch (error) {
   console.error('Payment creation error:', error)
  } finally {
   isProcessing.value = false
  }
 }

 const fetchUserPayments = async () => {
  paymentsLoading.value = true
  try {
   const paymentsApi = getUserPayments()
   await paymentsApi.execute()

   if (!paymentsApi.error.value && paymentsApi.data.value) {
    userPayments.value = paymentsApi.data.value
   }
  } catch (error) {
   console.error('Fetch payments error:', error)
  } finally {
   paymentsLoading.value = false
  }
 }

 // Инициализация
 onMounted(() => {
  fetchUserPayments()
 })
</script>