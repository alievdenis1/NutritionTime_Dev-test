<template>
	<div class="space-y-4">
		<!-- Заголовок с календарем -->
		<div class="flex items-center justify-between p-4">
			<div class="flex items-center justify-center w-full gap-2">
				<!-- Стрелка влево -->
				<button
					class="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold"
					@click="handlePrevDay"
				>
					{{ '<' }}
				</button>

				<!-- Заголовок -->
				<h3
					class="text-lg"
					@click="toggleCalendar"
				>
					{{ headerTitle }}
				</h3>

				<!-- Стрелка вправо -->
				<button
					class="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold"
					:disabled="isToday"
					:class="{ 'opacity-50 cursor-not-allowed': isToday }"
					@click="handleNextDay"
				>
					{{ '>' }}
				</button>
			</div>

			<!-- Календарь -->
			<div class="relative">
				<el-calendar
					v-if="showCalendar"
					v-model="calendarDate"
					class="absolute top-[calc(100%+8px)] right-0 z-50 shadow-lg rounded-lg"
					@click.stop
				>
					<template #date-cell="{ data }">
						<div
							class="text-center"
							:class="{
								'text-gray-400': !isFilledDate(formatDate(data.day)),
								'font-bold': isFilledDate(formatDate(data.day))
							}"
						>
							{{ new Date(data.day).getDate() }}
						</div>
					</template>
				</el-calendar>
			</div>
		</div>

		<VLoading
			v-if="loading"
			class="h-64"
		/>

		<div
			v-if="dayStats"
			class="p-6 bg-white rounded-lg shadow-sm"
		>
			<!-- Калории и приемы пищи -->
			<div class="mb-6">
				<div class="flex flex-col items-center mb-2">
					<div class="text-base text-gray-500 mb-1">
						{{ t('mealsCount').replace('{count}', dayStats.meals_count.toString()) }}
					</div>
					<div>
						<span class="text-gray-500">{{ t('calories') }}: </span>
						<span>{{ formatNumber(dayStats.total_calories) }} / {{ formatNumber(profile?.target_calories) }} {{ t('kcal') }}</span>
						<span
							v-if="isExceeded(dayStats.total_calories, profile?.target_calories)"
							class="font-bold"
							style="color: #F04F4F"
						>
							(+{{ formatNumber(Number(dayStats.total_calories) - (Number(profile?.target_calories) || 0)) }})
						</span>
					</div>
				</div>
				<!-- Прогресс бар -->
				<div class="relative w-full h-2 bg-beige rounded-full overflow-hidden">
					<div
						class="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
						:style="{
							width: `${Math.min(calculatePercentage(dayStats.total_calories, profile?.target_calories), 100)}%`,
							backgroundColor: getProgressBarColor()
						}"
					/>
				</div>
			</div>

			<!-- БЖУ -->
			<div class="flex flex-col items-center">
				<!-- График БЖУ -->
				<div class="w-40 mb-4">
					<apexchart
						type="radialBar"
						height="240"
						:options="getMacrosChartOptions()"
						:series="macrosPercentages"
					/>
				</div>

				<!-- Подписи БЖУ -->
				<div class="space-y-3 w-full flex flex-col justify-center">
					<div class="flex items-center gap-2 m-auto">
						<div
							class="w-3 h-3 rounded-full"
							style="background-color: #319A6E"
						/>
						<span class="text-gray-500">
							{{ t('proteins') }}: {{ formatNumber(dayStats.total_proteins) }} / {{ formatNumber(profile?.macro_proteins) }} {{ t('gram') }}
							<span
								class="font-semibold"
								style="color: #319A6E"
							>({{ macrosPercentages[0] }}%)</span>
						</span>
					</div>
					<div class="flex items-center gap-2 m-auto">
						<div
							class="w-3 h-3 rounded-full"
							style="background-color: #FDC755"
						/>
						<span class="text-gray-500">
							{{ t('fats') }}: {{ formatNumber(dayStats.total_fats) }} / {{ formatNumber(profile?.macro_fats) }} {{ t('gram') }}
							<span
								class="font-semibold"
								style="color: #FDC755"
							>({{ macrosPercentages[1] }}%)</span>
						</span>
					</div>
					<div class="flex items-center gap-2 m-auto">
						<div
							class="w-3 h-3 rounded-full"
							style="background-color: #FFA767"
						/>
						<span class="text-gray-500">
							{{ t('carbs') }}: {{ formatNumber(dayStats.total_carbs) }} / {{ formatNumber(profile?.macro_carbs) }} {{ t('gram') }}
							<span
								class="font-semibold"
								style="color: #FFA767"
							>({{ macrosPercentages[2] }}%)</span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<div
			v-else
			class="p-4 text-center text-gray-500"
		>
			{{ t('noDataForDate') }}
		</div>
	</div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
 import { useTranslation } from '@/shared/lib/i18n'
 import { ElCalendar } from 'element-plus'
 import { VLoading } from '@/shared/components/Loading'
 import type { Profile, MealStats } from '../model'
 import localization from './ProfileStats.localization.json'

 interface Props {
  modelValue: string
  profile: Profile | null
  mealStats: MealStats | null
  loading: boolean
  error: string | null
 }

 const props = withDefaults(defineProps<Props>(), {
  modelValue: () => new Date().toISOString().split('T')[0],
  profile: null,
  mealStats: null,
  loading: false,
  error: null
 })

 const emit = defineEmits<{
  (e: 'update:modelValue', date: string): void
  (e: 'setGoals'): void
  (e: 'retry'): void
 }>()

 // Локализация
 const { t } = useTranslation(localization)

 // Состояние
 const showCalendar = ref(false)
 const today = new Date().toISOString().split('T')[0]

 // Календарь
 const calendarDate = computed({
  get: () => new Date(props.modelValue),
  set: (value: Date) => {
   emit('update:modelValue', formatDate(value))
   showCalendar.value = false
  }
 })

 // Закрытие календаря при клике вне
 const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.el-calendar') && showCalendar.value) {
   showCalendar.value = false
  }
 }

 onMounted(() => {
  document.addEventListener('click', handleClickOutside)
 })

 onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
 })

 // Вычисляемые свойства
 const isToday = computed(() => props.modelValue === today)

 const headerTitle = computed(() => {
  const date = new Date(props.modelValue)
  const currentDate = new Date()

  currentDate.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  if (date.getTime() === currentDate.getTime()) {
   return 'Статистика за сегодня'
  }

  if (date.getTime() === currentDate.getTime() - 86400000) {
   return 'Статистика за вчера'
  }

  return `Статистика за ${date.toLocaleDateString('ru-RU')}`
 })

 const dayStats = computed(() => {
  if (!props.mealStats?.daily_stats?.length) return null
  return props.mealStats.daily_stats.find(
   day => day.date === props.modelValue
  ) ?? null
 })

 const macrosPercentages = computed(() => {
  if (!dayStats.value || !props.profile) return [0, 0, 0]

  return [
   calculatePercentage(dayStats.value.total_proteins, props.profile.macro_proteins),
   calculatePercentage(dayStats.value.total_fats, props.profile.macro_fats),
   calculatePercentage(dayStats.value.total_carbs, props.profile.macro_carbs)
  ]
 })

 // Методы
 const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
 }

 const formatNumber = (value: string | number | undefined | null): string => {
  if (value == null) return '0'
  return Math.round(Number(value)).toString()
 }

 const calculatePercentage = (current: string | number | null | undefined, target: number | null | undefined): number => {
  if (!current || !target) return 0
  return Math.round((Number(current) / target) * 100)
 }

 const isExceeded = (current: string | number | null | undefined, target: number | null | undefined): boolean => {
  if (!current || !target) return false
  return Number(current) > target
 }

 const handlePrevDay = () => {
  const date = new Date(props.modelValue)
  date.setDate(date.getDate() - 1)
  emit('update:modelValue', formatDate(date))
 }

 const handleNextDay = () => {
  if (isToday.value) return
  const date = new Date(props.modelValue)
  date.setDate(date.getDate() + 1)
  emit('update:modelValue', formatDate(date))
 }

 const toggleCalendar = (event: MouseEvent) => {
  event.stopPropagation()
  showCalendar.value = !showCalendar.value
 }

 const isFilledDate = (date: string) => {
  return props.mealStats?.filled_dates?.includes(date) ?? false
 }

 const getProgressBarColor = () => {
  const percentage = calculatePercentage(
   dayStats.value?.total_calories,
   props.profile?.target_calories
  )

  if (percentage > 100) return '#F04F4F'
  if (percentage >= 90) return '#10B981'
  return '#F59E0B'
 }

 const getMacrosChartOptions = () => ({
  chart: {
   fontFamily: 'inherit',
   toolbar: { show: false }
  },
  plotOptions: {
   radialBar: {
    hollow: {
     margin: 0,
     size: '35%'
    },
    track: {
     background: '#e5e7eb',
     margin: 1,
     strokeWidth: '12'
    },
    dataLabels: {
     show: false
    }
   }
  },
  stroke: {
   lineCap: 'round',
   dashArray: 0
  },
  colors: ['#319A6E', '#FDC755', '#FFA767']
 })
</script>