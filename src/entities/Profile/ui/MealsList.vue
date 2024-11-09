<template>
	<!-- Список приемов пищи -->
	<div
		v-if="dayStats"
		class="mt-6 space-y-4"
	>
		<h4 class="text-lg font-medium mt-5">
			{{ t('meals') }}:
		</h4>

		<div
			v-if="dayStats.meals?.length"
			class="space-y-3"
		>
			<div
				v-for="meal in dayStats.meals"
				:key="meal.id"
				class="p-4 bg-gray-50 rounded-lg bg-white shadow-sm"
			>
				<!-- Заголовок и время -->
				<div class="flex items-center justify-between mb-2">
					<h5 class="font-medium">
						{{ meal.dish_name }}
					</h5>
					<span class="text-sm text-gray-500  text-slateGray">
						{{ formatTime(meal.created_at) }}
					</span>
				</div>

				<!-- Макронутриенты -->
				<div class="text-sm">
					<div class="flex">
						<!-- Белки -->
						<div class="flex items-center gap-2">
							<div
								class="w-2 h-2 rounded-full"
								style="background-color: #319A6E"
							/>
							<span class="text-gray-600">{{ t('proteinsShort') }}: {{ formatNumber(meal.proteins) }} {{ t('gram') }}.</span>
						</div>

						<!-- Жиры -->
						<div class="flex items-center gap-2 ml-5">
							<div
								class="w-2 h-2 rounded-full"
								style="background-color: #FDC755"
							/>
							<span class="text-gray-600">{{ t('fatsShort') }}: {{ formatNumber(meal.fats) }} {{ t('gram') }}.</span>
						</div>

						<!-- Углеводы -->
						<div class="flex items-center gap-2 ml-5">
							<div
								class="w-2 h-2 rounded-full"
								style="background-color: #FFA767"
							/>
							<span class="text-gray-600">{{ t('carbsShort') }}: {{ formatNumber(meal.carbs) }} {{ t('gram') }}.</span>
						</div>
					</div>
					<div class="flex mt-3 text-slateGray">
						<!-- Вес -->
						<div class="col-span-2 sm:col-span-4 text-gray-500">
							{{ formatNumber(meal.weight) }} {{ t('gram') }}.
						</div>
						<!-- Калории -->
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 rounded-full" />
							<span class="text-gray-600">{{ formatNumber(meal.calories) }} {{ t('kcal') }}.</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Сообщение при отсутствии данных -->
		<div
			v-else
			class="text-center text-gray-500 py-8"
		>
			{{ t('noMealsForDate') }}
		</div>
	</div>
</template>

<script setup lang="ts">
 import { useTranslation } from '@/shared/lib/i18n'
 import type { MealItem } from '../model'
 import localization from './ProfileStats.localization.json'

 // Добавляем в существующий файл локализации
 const mealLocalization = {
  'meals': 'Приемы пищи',
  'noMealsForDate': 'На выбранную дату нет приемов пищи',
  'weight': 'Вес',
  'proteinsShort': 'Б',
  'fatsShort': 'Ж',
  'carbsShort': 'У'
 }

 const { t } = useTranslation({ ...localization, ...mealLocalization })

 // Используем существующие пропсы из родительского компонента
defineProps<{
  dayStats: {
   meals: MealItem[]
  } | null
 }>()

 // Форматирование времени
 const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('ru-RU', {
   hour: '2-digit',
   minute: '2-digit'
  })
 }

 // Используем существующую функцию форматирования чисел из родительского компонента
 const formatNumber = (value: string | number | undefined | null): string => {
  if (value == null) return '0'
  return Math.round(Number(value)).toString()
 }
</script>