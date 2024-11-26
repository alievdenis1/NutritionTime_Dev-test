<template>
	<VAccordion :title="t('ingredients')">
		<VueMultiselect
			v-model="selected"
			class="mb-[20px] mt-[20px]"
			:options="filterCatalogsStore.ingredientList || []"
			:placeholder="t('requiredIngredients')"
			label="name"
			track-by="id"
			:multiple="true"
			:close-on-select="false"
		>
			<template #tag="{ option, remove }">
				<div class="inline-flex items-center bg-gray-100 rounded-full px-4 py-2">
					<span class="mr-2 text-sm">{{ option.name }}</span>
					<button
						class="text-gray-400 hover:text-gray-600"
						@click="remove(option)"
					>
						<IconClose class="w-4 h-4" />
					</button>
				</div>
			</template>

			<!-- TODO: добавить ArrowIcon и реализовать корректное открытие/закрытие -->
			<!-- TODO: вынести в UI -->

			<!-- <template #caret="{ toggle }">
				<div
					:class="['absolute right-[12px] top-1/2 transform -translate-y-1/2 transition-transform w-[24px] h-[24px]']"
					@click.stop="open"
				>
					<IconArrow
						:class="['w-[24px] h-[24px]']"
						icon-color="#1C1C1C"
					/>
				</div>
			</template> -->
		</VueMultiselect>
		<VueMultiselect
			v-model="excluded"
			:options="filterCatalogsStore.ingredientList || []"
			:placeholder="t('excludeIngredients')"
			label="name"
			track-by="id"
			:multiple="true"
			:close-on-select="false"
		>
			<template #tag="{ option, remove }">
				<div class="inline-flex items-center bg-gray-100 rounded-full px-4 py-2">
					<span class="mr-2 text-sm">{{ option.name }}</span>
					<button
						class="text-gray-400 hover:text-gray-600"
						@click="remove(option)"
					>
						<IconClose class="w-4 h-4" />
					</button>
				</div>
			</template>
		</VueMultiselect>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import VueMultiselect from 'vue-multiselect'
import { VAccordion } from '@/shared/components/Accordion'
import { IconClose } from '@/shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'

import { IngredientList } from '@/entities/Ingredient'

import { useFilterStore, useFilterCatalogsStore } from '@/features/Search/filter'

import localization from './IngredientsParams.localization.json'

const { t } = useTranslation(localization)

const filterStore = useFilterStore()
const filterCatalogsStore = useFilterCatalogsStore()

const selected = ref<IngredientList>([])
const excluded = ref<IngredientList>([])

watch([selected, excluded], ([sel, exc]) => {
	filterStore.updateFilterAndFetchRecipeList({
        required_ingredients: sel.map(item => item.id),
		excluded_ingredients: exc.map(item => item.id),
    })
})

onMounted(() => {
    filterCatalogsStore.fetchIngredientList()
})
</script>

<style scoped>
:deep(.multiselect) {
	position: relative;

	padding: 12px;

	border: 1px solid #e1e1e1;

	border-radius: 4px;

	min-height: 60px;
}

:deep(.multiselect__placeholder) {
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;

	color: #6F6F6F;

	display: flex;
	min-height: 36px;
	align-items: center;
}

:deep(.multiselect__content-wrapper) {
    max-height: 300px;
    position: absolute;
    display: block;
    background: #fff;
    width: 100%;
    max-height: 240px;
    overflow: auto;
    border: 1px solid #e8e8e8;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    z-index: 50;
    -webkit-overflow-scrolling: touch;
}

:deep(.multiselect__content) {
	width: 100%;
}

:deep(.multiselect__tags-wrap) {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
}

:deep(.multiselect__content-wrapper) {
	@apply bg-white border rounded-md shadow-lg absolute left-0 right-0 z-10
}

:deep(.multiselect__element) {
	display: block;
}

:deep(.multiselect__option) {
	display: block;
	width: 100%;
	@apply px-4 py-2 hover:bg-lightGray
}

:deep(.multiselect__input) {
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;

	color: #6F6F6F;
}

.border {
    border-color: #E5E7EB;
}

.bg-gray-100 {
    background-color: #F3F4F6;
}

.text-gray-400 {
    color: #9CA3AF;
}

.text-gray-600 {
    color: #4B5563;
}
</style>