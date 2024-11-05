<template>
	<div class="profile-stats space-y-4 p-4">
		<!-- Фильтры -->
		<div class="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
				<VInput
					v-model="dateRange.startDate"
					:title="t('startDate')"
					type="date"
					:max="today"
				/>
				<VInput
					v-model="dateRange.endDate"
					:title="t('endDate')"
					type="date"
					:min="dateRange.startDate"
					:max="today"
				/>
			</div>
			<VButton
				:disabled="!isDateRangeValid"
				:loading="loading"
				class="w-full sm:w-auto"
				@click="fetchData"
			>
				{{ t('update') }}
			</VButton>
		</div>

		<VLoading
			v-if="loading"
			class="h-64"
		/>

		<div
			v-else-if="error"
			class="flex flex-col items-center justify-center gap-4 h-64 bg-white rounded-lg p-4"
		>
			<p class="text-red-500">
				{{ error }}
			</p>
			<VButton @click="fetchData">
				{{ t('tryAgain') }}
			</VButton>
		</div>

		<template v-else>
			<!-- Основные блоки статистики -->
			<VAccordion
				v-for="section in statsData"
				:key="section.title"
				:title="t(section.title)"
				is-open
			>
				<div class="p-4 space-y-3">
					<div
						v-for="item in section.items"
						:key="item.key"
						class="stats-row"
					>
						<span>{{ t(item.label) }}</span>
						<span class="font-medium">
							{{ item.value }}
							<template v-if="item.unit">
								{{ t(item.unit) }}
							</template>
						</span>
					</div>
				</div>
			</VAccordion>

			<!-- Последние приемы пищи -->
			<VAccordion
				v-if="meals.length > 0"
				:title="t('recentMeals')"
				is-open
			>
				<div class="p-4 space-y-3">
					<div
						v-for="meal in meals"
						:key="meal.id"
						class="stats-row"
					>
						<span>{{ meal.dish_name }}</span>
						<div class="text-right">
							<div>{{ formatNumber(meal.calories) }} {{ t('kcal') }}</div>
							<div class="text-sm text-gray-500">
								{{ formatDate(meal.created_at) }}
							</div>
						</div>
					</div>
				</div>
			</VAccordion>

			<!-- Платежи -->
			<VAccordion
				v-if="payments.length > 0"
				:title="t('payments')"
			>
				<div class="p-4 space-y-3">
					<div
						v-for="payment in payments"
						:key="payment.id"
						class="stats-row"
					>
						<span>{{ payment.payment_comment }}</span>
						<div class="text-right">
							<div>{{ payment.amount_ton }} TON</div>
							<div
								class="text-sm"
								:class="payment.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'"
							>
								{{ t(`paymentStatus.${(payment.status as string).toLowerCase()}`) }}
							</div>
						</div>
					</div>
				</div>
			</VAccordion>

			<!-- Уведомления -->
			<VAccordion
				v-if="notifications.length > 0"
				:title="t('notifications')"
			>
				<div class="p-4 space-y-3">
					<div
						v-for="notification in notifications"
						:key="notification.id"
						class="stats-row"
					>
						<span>{{ notification.message_text }}</span>
						<div class="text-sm text-gray-500">
							{{ formatDateTime(notification.scheduled_for) }}
						</div>
					</div>
				</div>
			</VAccordion>
		</template>
	</div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted } from 'vue'
 import { useTranslation } from '@/shared/lib/i18n'
 import { VAccordion } from '@/shared/components/Accordion'
 import { VInput } from '@/shared/components/Input'
 import { VButton } from '@/shared/components/Button'
 import { VLoading } from '@/shared/components/Loading'
 import { getProfile, getMealStats, getMeals, getPayments, getNotifications } from '../api'
 import type { Profile, MealStats, Meal, Payment, Notification, MealsResponse } from '../model'
 import localization from './ProfileStats.localization.json'

 const { t } = useTranslation(localization)

 // Состояние с правильной типизацией
 const profile = ref<Profile | null>(null)
 const mealStats = ref<MealStats | null>(null)
 const meals = ref<Meal[]>([])
 const payments = ref<Payment[]>([])
 const notifications = ref<Notification[]>([])
 const loading = ref(false)
 const error = ref<string | null>(null)

 // Диапазон дат
 const today = new Date().toISOString().split('T')[0]
 const dateRange = ref({
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: today
 })

 // Типы для структуры данных
 interface StatsItem {
  key: string;
  label: string;
  value: string | number;
  unit?: string;
 }

 interface StatsSection {
  title: string;
  items: StatsItem[];
 }

 // Проверка корректности диапазона дат
 const isDateRangeValid = computed(() => {
  return dateRange.value.startDate &&
   dateRange.value.endDate &&
   dateRange.value.startDate <= dateRange.value.endDate
 })

 // Вычисление статистики
 const totalCalories = computed(() => {
  if (!mealStats.value?.daily_stats) return 0
  return mealStats.value.daily_stats.reduce((sum, day) => sum + parseFloat(day.total_calories), 0)
 })

 const totalProteins = computed(() => {
  if (!mealStats.value?.daily_stats) return 0
  return mealStats.value.daily_stats.reduce((sum, day) => sum + parseFloat(day.total_proteins), 0)
 })

 const totalFats = computed(() => {
  if (!mealStats.value?.daily_stats) return 0
  return mealStats.value.daily_stats.reduce((sum, day) => sum + parseFloat(day.total_fats), 0)
 })

 const totalCarbs = computed(() => {
  if (!mealStats.value?.daily_stats) return 0
  return mealStats.value.daily_stats.reduce((sum, day) => sum + parseFloat(day.total_carbs), 0)
 })

 // Формирование данных для отображения статистики
 const statsData = computed((): StatsSection[] => [
  {
   title: 'mainMetrics',
   items: [
    { key: 'baseCalories', label: 'baseCalories', value: formatNumber(profile.value?.base_calories), unit: 'kcal' },
    { key: 'targetCalories', label: 'targetCalories', value: formatNumber(profile.value?.target_calories), unit: 'kcal' },
    { key: 'goal', label: 'goal', value: profile.value?.goal ?? '—' },
    { key: 'activityLevel', label: 'activityLevel', value: profile.value?.activity_level ?? '—' }
   ]
  },
  {
   title: 'nutritionStats',
   items: [
    { key: 'avgCalories', label: 'avgCalories', value: formatNumber(mealStats.value?.daily_averages.calories), unit: 'kcal' },
    { key: 'avgProteins', label: 'avgProteins', value: formatNumber(mealStats.value?.daily_averages.proteins), unit: 'gram' },
    { key: 'avgFats', label: 'avgFats', value: formatNumber(mealStats.value?.daily_averages.fats), unit: 'gram' },
    { key: 'avgCarbs', label: 'avgCarbs', value: formatNumber(mealStats.value?.daily_averages.carbs), unit: 'gram' }
   ]
  },
  {
   title: 'totalStats',
   items: [
    { key: 'totalCalories', label: 'totalCalories', value: formatNumber(totalCalories.value), unit: 'kcal' },
    { key: 'totalProteins', label: 'totalProteins', value: formatNumber(totalProteins.value), unit: 'gram' },
    { key: 'totalFats', label: 'totalFats', value: formatNumber(totalFats.value), unit: 'gram' },
    { key: 'totalCarbs', label: 'totalCarbs', value: formatNumber(totalCarbs.value), unit: 'gram' }
   ]
  },
  {
   title: 'additionalInfo',
   items: [
    { key: 'recommendedSteps', label: 'recommendedSteps', value: formatNumber(profile.value?.recommended_steps) },
    { key: 'waterIntake', label: 'waterIntake', value: formatNumber((profile.value?.water_intake ?? 0) / 1000), unit: 'liter' },
    { key: 'lastUpdated', label: 'lastUpdated', value: formatDateTime(profile.value?.last_updated) },
    { key: 'dietType', label: 'dietType', value: profile.value?.diet_type ?? '—' }
   ]
  }
 ])

 // Методы форматирования
 const formatNumber = (value: number | undefined | null): string => {
  if (value == null) return '—'
  return new Intl.NumberFormat('ru-RU').format(value)
 }

 const formatDateTime = (dateString: string | undefined | null): string => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
   day: '2-digit',
   month: '2-digit',
   year: 'numeric',
   hour: '2-digit',
   minute: '2-digit'
  }).format(date)
 }

 const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
   day: '2-digit',
   month: '2-digit',
   year: 'numeric'
  }).format(date)
 }

 // Получение данных
 const fetchData = async () => {
  if (loading.value) return

  loading.value = true
  error.value = null

  try {
   const [
    profileApi,
    statsApi,
    mealsApi,
    paymentsApi,
    notificationsApi
   ] = [
    getProfile(),
    getMealStats({
     start_date: dateRange.value.startDate,
     end_date: dateRange.value.endDate
    }),
    getMeals({
     start_date: dateRange.value.startDate,
     end_date: dateRange.value.endDate
    }),
    getPayments(),
    getNotifications()
   ]

   await Promise.all([
    profileApi.execute(),
    statsApi.execute(),
    mealsApi.execute(),
    paymentsApi.execute(),
    notificationsApi.execute()
   ])

   // Проверяем ошибки
   const apis = [
    { name: 'Profile', api: profileApi },
    { name: 'Stats', api: statsApi },
    { name: 'Meals', api: mealsApi },
    { name: 'Payments', api: paymentsApi },
    { name: 'Notifications', api: notificationsApi }
   ]

   for (const { name, api } of apis) {
    if (api.error.value) {
     throw new Error(`${name}: ${api.error.value}`)
    }
   }

   // Обновляем данные
   if (profileApi.data.value) {
    profile.value = profileApi.data.value.profile
   } else {
    throw new Error('Profile data is null')
   }
   mealStats.value = statsApi.data.value

   // Обработка meals
   meals.value = []
   if (mealsApi.data.value) {
    const mealsData: MealsResponse = mealsApi.data.value
    for (const date in mealsData) {
     meals.value.push(...mealsData[date].meals)
    }
    // Сортируем приемы пищи по дате в порядке убывания
    meals.value.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
   }

   payments.value = paymentsApi.data.value ?? []
   notifications.value = notificationsApi.data.value ?? []
  } catch (e) {
   error.value = e instanceof Error ? e.message : t('errorLoadingData')
   console.error('Failed to load data:', e)
  } finally {
   loading.value = false
  }
 }

 onMounted(fetchData)
</script>

<style scoped>
 .stats-row {
  @apply flex justify-between items-center py-2 border-b last:border-0;
 }
</style>
