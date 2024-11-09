<template>
	<div class="space-y-4">
		<!-- Заголовок с календарем -->
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm">
			<h3 class="text-lg font-medium">
				{{ t('dailyStats') }}
			</h3>
			<div class="flex items-center gap-2 w-full sm:w-auto">
				<VInput
					v-model="localDate"
					type="date"
					:max="today"
					class="w-full sm:w-auto"
				/>
				<VButton
					v-if="!hasGoals"
					class="whitespace-nowrap"
					@click="$emit('setGoals')"
				>
					{{ t('setGoals') }}
				</VButton>
			</div>
		</div>

		<VLoading
			v-if="loading"
			class="h-64"
		/>

		<!-- Основная статистика -->
		<VAccordion
			v-else
			:title="t('dailyNutrition')"
			is-open
		>
			<div
				v-if="dayStats"
				class="p-4 space-y-3"
			>
				<!-- Калории -->
				<div class="stats-row">
					<div class="flex items-center gap-2">
						<span>{{ t('calories') }}</span>
						<span
							v-if="hasGoals"
							class="text-xs text-gray-500"
						>
							({{ t('target') }}: {{ formatNumber(profile?.target_calories) }} {{ t('kcal') }})
						</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="font-medium">
							{{ formatNumber(dayStats.total_calories) }} {{ t('kcal') }}
						</span>
						<template v-if="hasGoals && profile?.target_calories">
							<span
								class="text-xs px-2 py-0.5 rounded"
								:class="getProgressColorClass(
									Number(dayStats.total_calories),
									profile.target_calories
								)"
							>
								{{ calculatePercentage(dayStats.total_calories, profile.target_calories) }}%
							</span>
						</template>
					</div>
				</div>

				<!-- Макронутриенты -->
				<template
					v-for="nutrient in nutrients"
					:key="nutrient.key"
				>
					<div class="stats-row">
						<div class="flex items-center gap-2">
							<span>{{ t(nutrient.label) }}</span>
							<span
								v-if="hasGoals"
								class="text-xs text-gray-500"
							>
								({{ t('target') }}: {{ formatNumber(profile?.[nutrient.targetKey]) }} {{ t('gram') }})
							</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="font-medium">
								{{ formatNumber(dayStats[nutrient.valueKey]) }} {{ t('gram') }}
							</span>
							<template v-if="hasGoals && profile?.[nutrient.targetKey]">
								<span
									class="text-xs px-2 py-0.5 rounded"
									:class="getProgressColorClass(
										Number(dayStats[nutrient.valueKey]),
										profile[nutrient.targetKey]
									)"
								>
									{{ calculatePercentage(dayStats[nutrient.valueKey], profile[nutrient.targetKey]) }}%
								</span>
							</template>
						</div>
					</div>
				</template>

				<!-- Количество приёмов пищи -->
				<div class="text-sm text-gray-500 pt-2 border-t">
					{{ t('mealsCount').replace('{count}', dayStats.meals_count) }}
				</div>
			</div>
			<div
				v-else
				class="p-4 text-center text-gray-500"
			>
				{{ t('noDataForDate') }}
			</div>
		</VAccordion>
	</div>
</template>

<script setup lang="ts">
 import { computed } from 'vue'
 import { useTranslation } from '@/shared/lib/i18n'
 import { VInput } from '@/shared/components/Input'
 import { VButton } from '@/shared/components/Button'
 import { VAccordion } from '@/shared/components/Accordion'
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

 // Константы
 const today = new Date().toISOString().split('T')[0]

 const nutrients = [
  {
   key: 'proteins',
   label: 'proteins',
   valueKey: 'total_proteins' as const,
   targetKey: 'macro_proteins' as const
  },
  {
   key: 'fats',
   label: 'fats',
   valueKey: 'total_fats' as const,
   targetKey: 'macro_fats' as const
  },
  {
   key: 'carbs',
   label: 'carbs',
   valueKey: 'total_carbs' as const,
   targetKey: 'macro_carbs' as const
  }
 ] as const

 // v-model для даты
 const localDate = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
 })

 // Вычисляемые свойства
 const hasGoals = computed(() => {
  return !!(
   props.profile?.target_calories ||
   props.profile?.macro_proteins ||
   props.profile?.macro_fats ||
   props.profile?.macro_carbs
  )
 })

 const dayStats = computed(() => {
  if (!props.mealStats?.daily_stats?.length) return null
  return props.mealStats.daily_stats.find(
   day => day.date === props.modelValue
  ) ?? null
 })

 // Утилиты
 const formatNumber = (value: string | number | undefined | null): string => {
  if (value == null) return '0'
  return Number(value).toFixed(1)
 }

 const calculatePercentage = (current: string | number, target: number): string => {
  if (!target) return '0'
  return Math.round((Number(current) / target) * 100).toString()
 }

 const getProgressColorClass = (current: number, target: number): string => {
  const percentage = (current / target) * 100
  if (percentage > 100) return 'bg-red-100 text-red-800'
  if (percentage >= 90) return 'bg-green-100 text-green-800'
  return 'bg-yellow-100 text-yellow-800'
 }
</script>

<style scoped>
 .stats-row {
  @apply flex justify-between items-center py-2 border-b last:border-0;
 }
</style>