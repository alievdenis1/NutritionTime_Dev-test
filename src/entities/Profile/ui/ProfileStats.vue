<template>
	<div class="profile-stats space-y-4 p-4">
		<TabsMain
			default-value="report"
		>
			<TabsList>
				<TabsTrigger value="report">
					Отчет
				</TabsTrigger>
				<TabsTrigger value="statistic">
					Статистика
				</TabsTrigger>
			</TabsList>
			<TabsContent value="report">
				<DailyNutritionStats
					v-model="selectedDate"
					:profile="profile"
					:meal-stats="mealStats"
					:loading="loading"
					:error="error"
					class="mt-4"
					@set-goals="handleSetGoals"
					@retry="fetchMealStats"
				/>
			</TabsContent>
			<TabsContent value="statistic">
				В разработке
			</TabsContent>
		</TabsMain>
	</div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted, watch } from 'vue'
 import { DailyNutritionStats } from './index'
 import { getProfile, getMealStats } from '../api'
 import { TabsContent, TabsList, TabsMain, TabsTrigger } from 'shared/components/ui/tabs'

 // Состояние
 const selectedDate = ref(new Date().toISOString().split('T')[0])

 // API запросы
 const profileApi = getProfile()
 const mealStatsApi = getMealStats({
  start_date: selectedDate.value,
  end_date: selectedDate.value
 })

 // Вычисляемые свойства
 const loading = computed(() => profileApi.loading.value || mealStatsApi.loading.value)
 const error = computed(() => {
  if (profileApi.error.value) return profileApi.error.value
  if (mealStatsApi.error.value) return mealStatsApi.error.value
  return null
 })
 const profile = computed(() => profileApi.data.value?.profile ?? null)
 const mealStats = computed(() => mealStatsApi.data.value)

 // Методы
 const fetchMealStats = async () => {
  const newApi = getMealStats({
   start_date: selectedDate.value,
   end_date: selectedDate.value
  })
  await newApi.execute()
  if (!newApi.error.value) {
   mealStatsApi.data.value = newApi.data.value
  }
 }

 const fetchData = async () => {
  await Promise.all([
   profileApi.execute(),
   fetchMealStats()
  ])
 }

 const handleSetGoals = () => {
  // TODO: Реализовать логику установки целей
  console.log('Setting goals...')
 }

 // Обработчики
 watch(selectedDate, () => {
  fetchMealStats()
 })

 // Инициализация
 onMounted(() => {
  fetchData()
 })
</script>