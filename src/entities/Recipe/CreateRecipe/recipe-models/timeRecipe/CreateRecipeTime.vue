<template>
	<div>
		<VAccordion :title="t('timeRecipeTitle')">
			<div class="mt-[20px]">
				<div class="flex flex-col gap-4">
					<div class="relative">
						<span
							v-if="kitchenTime.length > 0"
							class="absolute text-[12px] top-[6px] left-[12px] text-gray"
						>
							{{ t('kitchenTimePlaceholder') }}
						</span>
						<input
							v-model="kitchenTime"
							type="text"
							:placeholder="t('kitchenTimePlaceholder')"
							class="border rounded text-base w-full h-[54px]"
							:class="{ 'padding-filled': kitchenTime.length > 0, 'padding-empty': kitchenTime.length === 0 }"
							@input="formatInput('kitchen')"
						>
						<p class="text-xs text-gray mt-1">
							{{ t('kitchenTimeDescription') }}
						</p>
					</div>
					<div class="relative">
						<span
							v-if="cookingTime.length > 0"
							class="absolute text-[12px] top-[6px] left-[12px] text-gray"
						>
							{{ t('cookingTimePlaceholder') }}
						</span>
						<input
							v-model="cookingTime"
							type="text"
							:placeholder="t('cookingTimePlaceholder')"
							class="border rounded text-base w-full h-[54px]"
							:class="{ 'padding-filled': cookingTime.length > 0, 'padding-empty': cookingTime.length === 0 }"
							@input="formatInput('cooking')"
						>
						<p class="text-xs text-gray mt-1">
							{{ t('cookingTimeDescription') }}
						</p>
					</div>
				</div>
			</div>
		</VAccordion>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { VAccordion } from '@/shared/components/Accordion'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './CreateRecipeTime.localization.json'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'
import { useRoute } from 'vue-router'

const { t } = useTranslation(localization)
const store = useRecipeStore()
const route = useRoute()

const kitchenTime = ref<string>('00 ч : 00 мин')
const cookingTime = ref<string>('00 ч : 00 мин')

const formatInput = (type: 'kitchen' | 'cooking') => {
	const input = type === 'kitchen' ? kitchenTime : cookingTime
	let value = input.value.replace(/[^0-9]/g, '')

	// Удаляем ведущие нули
	value = value.replace(/^0+/, '')

	// Если строка пустая, устанавливаем значение "0"
	if (value === '') {
		value = '0'
	}

	// Ограничиваем ввод до 4 цифр
	if (value.length > 4) {
		value = value.slice(0, 4)
	}

	const minutes = parseInt(value)
	const hours = Math.floor(minutes / 60)
	const remainingMinutes = minutes % 60

	input.value = `${String(hours).padStart(2, '0')} ${t('hour')} : ${String(remainingMinutes).padStart(2, '0')} ${t('minute')}`

	// Обновляем значение в store
	if (store.currentRecipe) {
		if (type === 'kitchen') {
			store.currentRecipe.recipeInfo['Время на кухне'] = minutes.toString()
		} else {
			store.currentRecipe.recipeInfo['Будет готово через'] = minutes.toString()
		}
	}
}

const setKitchenAndCookingTime = (recipeInfo: Record<string, string>) => {
	const kitchenTimeValue = recipeInfo['Время на кухне'] || '0'
	const cookingTimeValue = recipeInfo['Будет готово через'] || '0'

	const formatTimeValue = (value: string) => {
		const minutes = parseInt(value)
		const hours = Math.floor(minutes / 60)
		const remainingMinutes = minutes % 60
		return `${String(hours).padStart(2, '0')} ${t('hour')} : ${String(remainingMinutes).padStart(2, '0')} ${t('minute')}`
	}

	kitchenTime.value = formatTimeValue(kitchenTimeValue)
	cookingTime.value = formatTimeValue(cookingTimeValue)
}

onMounted(() => {
	const recipeId = route.params.id as string
	const currentRecipe = store.recipes.find(recipe => recipe.id === recipeId)
	if (currentRecipe && currentRecipe.recipeInfo) {
		setKitchenAndCookingTime(currentRecipe.recipeInfo)
	}
})

// Следим за изменениями в currentRecipe
watch(() => store.currentRecipe, (newRecipe) => {
	if (newRecipe && newRecipe.recipeInfo) {
		setKitchenAndCookingTime(newRecipe.recipeInfo)
	}
}, { deep: true })
</script>

<style scoped>
.border {
	border: 1px solid #E1E1E1;
}

.padding-filled {
	padding: 26px 0 10px 12px;
}

.padding-empty {
	padding: 16px 8px;
}
</style>