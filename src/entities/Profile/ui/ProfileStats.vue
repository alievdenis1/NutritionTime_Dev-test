<template>
	<div class="profile-stats pt-5">
		<VAccordion
			:title="t('statsTitle')"
			is-open
		>
			<!-- Период статистики -->
			<div class="mb-6 flex items-center gap-4">
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
				<VButton
					:disabled="!isDateRangeValid"
					:loading="loading"
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
				class="flex flex-col items-center justify-center gap-4 h-64"
			>
				<p class="text-red-500">
					{{ error }}
				</p>
				<VButton @click="fetchData">
					{{ t('tryAgain') }}
				</VButton>
			</div>

			<div
				v-else
				class="grid grid-cols-1 md:grid-cols-2 gap-6"
			>
				<!-- Основная информация -->
				<VContentBlock
					:image="'https://i.pinimg.com/originals/1f/28/c6/1f28c68d2c35f389966b5a363b992d06.png'"
					:text="t('mainMetricsDescription')"
					:button-text="t('details')"
					:button-icon="IconRadio"
					button-class="bg-primary"
				>
					<div class="space-y-3">
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('baseCalories') }}</span>
							<span class="font-medium">{{ profile?.base_calories ?? '—' }} {{ t('kcal') }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('targetCalories') }}</span>
							<span class="font-medium">{{ profile?.target_calories ?? '—' }} {{ t('kcal') }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('goal') }}</span>
							<span class="font-medium">{{ profile?.goal ?? '—' }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('activityLevel') }}</span>
							<span class="font-medium">{{ profile?.activity_level ?? '—' }}</span>
						</div>
					</div>
				</VContentBlock>

				<!-- Статистика питания -->
				<VContentBlock
					:image="'https://i.pinimg.com/originals/1f/28/c6/1f28c68d2c35f389966b5a363b992d06.png'"
					:text="t('nutritionStatsDescription')"
					:button-text="t('details')"
					:button-icon="IconRadio"
					button-class="bg-secondary"
				>
					<div class="space-y-3">
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('avgCalories') }}</span>
							<span class="font-medium">{{ formatNumber(mealStats?.avg_calories_per_day) }} {{ t('kcal') }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('avgProteins') }}</span>
							<span class="font-medium">{{ formatNumber(mealStats?.avg_proteins_per_day) }}{{ t('gram') }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('avgFats') }}</span>
							<span class="font-medium">{{ formatNumber(mealStats?.avg_fats_per_day) }}{{ t('gram') }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('avgCarbs') }}</span>
							<span class="font-medium">{{ formatNumber(mealStats?.avg_carbs_per_day) }}{{ t('gram') }}</span>
						</div>
					</div>
				</VContentBlock>

				<!-- Общая статистика -->
				<VContentBlock
					:image="'https://i.pinimg.com/originals/1f/28/c6/1f28c68d2c35f389966b5a363b992d06.png'"
					:text="t('totalStatsDescription')"
					:button-text="t('details')"
					:button-icon="IconRadio"
					button-class="bg-info"
				>
					<div class="space-y-3">
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('totalCalories') }}</span>
							<span class="font-medium">{{ formatNumber(mealStats?.total_calories) }} {{ t('kcal') }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('totalProteins') }}</span>
							<span class="font-medium">{{ formatNumber(mealStats?.total_proteins) }}{{ t('gram') }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('totalFats') }}</span>
							<span class="font-medium">{{ formatNumber(mealStats?.total_fats) }}{{ t('gram') }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('totalCarbs') }}</span>
							<span class="font-medium">{{ formatNumber(mealStats?.total_carbs) }}{{ t('gram') }}</span>
						</div>
					</div>
				</VContentBlock>

				<!-- Дополнительная информация -->
				<VContentBlock
					:image="'https://i.pinimg.com/originals/1f/28/c6/1f28c68d2c35f389966b5a363b992d06.png'"
					:text="t('additionalInfoDescription')"
					:button-text="t('details')"
					:button-icon="IconRadio"
					button-class="bg-success"
				>
					<div class="space-y-3">
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('recommendedSteps') }}</span>
							<span class="font-medium">{{ formatNumber(profile?.recommended_steps) }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('waterIntake') }}</span>
							<span class="font-medium">{{ profile?.water_intake }}{{ t('liter') }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('lastUpdated') }}</span>
							<span class="font-medium">{{ formatDateTime(profile?.last_updated) }}</span>
						</div>
						<div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
							<span>{{ t('dietType') }}</span>
							<span class="font-medium">{{ profile?.diet_type ?? '—' }}</span>
						</div>
					</div>
				</VContentBlock>
			</div>
		</VAccordion>
	</div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted } from 'vue'
 import { useTranslation } from '@/shared/lib/i18n'
 import { VAccordion } from '@/shared/components/Accordion'
 import { VContentBlock } from '@/shared/components/ContentBlock'
 import { VInput } from '@/shared/components/Input'
 import { VButton } from '@/shared/components/Button'
 import { VLoading } from '@/shared/components/Loading'
 import { IconRadio } from '@/shared/components/Icon'
 import { getProfile, getMealStats } from '../api'
 import type { Profile, MealStats } from '../model'
 import localization from './ProfileStats.localization.json'

 const { t } = useTranslation(localization)

 // State
 const profile = ref<Profile | null>(null)
 const mealStats = ref<MealStats | null>(null)
 const loading = ref(false)
 const error = ref<string | null>(null)

 // Date range state
 const today = new Date().toISOString().split('T')[0]
 const dateRange = ref({
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
  endDate: today
 })

 // Computed
 const isDateRangeValid = computed(() => {
  return dateRange.value.startDate &&
   dateRange.value.endDate &&
   dateRange.value.startDate <= dateRange.value.endDate
 })

 // Methods
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

 const fetchData = async () => {
  if (loading.value) return

  loading.value = true
  error.value = null

  try {
   const profileApi = getProfile()
   const statsApi = getMealStats({
    start_date: dateRange.value.startDate,
    end_date: dateRange.value.endDate
   })

   await Promise.all([
    profileApi.execute(),
    statsApi.execute()
   ])

   if (profileApi.error.value) throw new Error(profileApi.error.value)
   if (statsApi.error.value) throw new Error(statsApi.error.value)

   profile.value = profileApi.data.value
   mealStats.value = statsApi.data.value
  } catch (e) {
   error.value = e instanceof Error ? e.message : t('errorLoadingData')
   console.error('Failed to load profile data:', e)
  } finally {
   loading.value = false
  }
 }

 // Lifecycle
 onMounted(fetchData)
</script>