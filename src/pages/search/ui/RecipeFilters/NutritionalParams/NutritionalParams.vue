<template>
	<VAccordion
		:title="t('nutritionalValue')"
		class="flex-grow overflow-y-auto p-4 recipe-search"
	>
		<!-- TODO: точно ли хотим тут выставлять ограничения на максимальньные значения? -->
		<!-- Может убрать range-slider и оставить только поля ввода??? -->
		<VRange
			class="mb-[20px] mt-[20px]"
			:title="t('caloriesPer100g')"
			:max="500"
			:min="10"
			:step="10"
			:value="spiciness"
			:unit="t('caloriesUnit')"
			@on-change="handleChangeSpiciness"
		/>
		<VRange
			class="mb-[20px]"
			:title="t('proteinPer100g')"
			:max="24"
			:min="1"
			:step="1"
			:value="cookingTime"
			:unit="t('gramUnit')"
			@on-change="handleChangeCookingTime"
		/>
		<VRange
			class="mb-[20px]"
			:title="t('fatPer100g')"
			:max="24"
			:min="1"
			:step="1"
			:value="cookingTime"
			:unit="t('gramUnit')"
			@on-change="handleChangeCookingTime"
		/>
		<VRange
			:title="t('carbsPer100g')"
			:max="5"
			:min="1"
			:step="1"
			:value="cookingTime"
			:unit="t('gramUnit')"
			@on-change="handleChangeCookingTime"
		/>
	</VAccordion>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { VAccordion } from '@/shared/components/Accordion'
import { VRange } from '@/shared/components/Range'
import { useTranslation } from '@/shared/lib/i18n'

import { useFilterStore } from '@/features/Search/filter'

import localization from './NutritionalParams.localization.json'

const filterStore = useFilterStore()

const { t } = useTranslation(localization)

// TODO: заменить на нужные поля
const spiciness = computed<[number, number]>(
	() => [filterStore.filter.min_spiciness || 1, filterStore.filter.max_spiciness || 5]
)
const cookingTime = computed<[number, number]>(
	() => [filterStore.filter.min_cooking_time || 1, filterStore.filter.max_cooking_time || 5]
)

const handleChangeSpiciness = (spiciness: [number, number]) => {
	filterStore.updateFilterAndFetchRecipeList({
        min_spiciness: spiciness[0],
		max_spiciness: spiciness[1],
    })
}

const handleChangeCookingTime = (cookingTime: [number, number]) => {
	filterStore.updateFilterAndFetchRecipeList({
        min_cooking_time: cookingTime[0],
		max_cooking_time: cookingTime[1],
    })
}
</script>

<style lang="scss">
.recipe-search {
    border-top: 1px solid #1C1C1C0D;
    border-bottom: 1px solid #1C1C1C0D;
    padding: 20px 16px;
    border-radius: 16px;
}
</style>