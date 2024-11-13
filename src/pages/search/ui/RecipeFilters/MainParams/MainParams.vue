<template>
	<VAccordion
		:title="t('mainParameters')"
		:is-open="true"
		class="flex-grow overflow-y-auto p-4 recipe-search"
	>
		<div class="mb-6">
			<h3 class="text-darkGray text-sm mb-[16px] mt-[20px]">
				{{ t('cuisine') }}
			</h3>
			<Simplebar
				class="h-[212px] pr-2"
				data-simplebar-auto-hide="false"
			>
				<CheckboxItem
					v-for="cuisine in (filterCatalogsStore.cuisineList || [])"
					:id="cuisine.id"
					:key="cuisine.id"
					:name="cuisine.name"
					:value="cuisine.id === filterStore.filter.cuisine_id"
					@change-checkbox="(_, id: number) => toggleCheckbox(id, 'cuisine_id')"
				/>
			</Simplebar>
			<h3 class="text-darkGray text-sm mb-[16px] mt-4">
				{{ t('dietType') }}
			</h3>
			<Simplebar
				class="h-[212px] pr-2"
				data-simplebar-auto-hide="false"
			>
				<CheckboxItem
					v-for="diet in (filterCatalogsStore.dietTypeList || [])"
					:id="diet.id"
					:key="diet.id"
					:name="diet.name"
					:value="diet.id === filterStore.filter.diet_type_id"
					@change-checkbox="(_, id: number) => toggleCheckbox(id, 'diet_type_id')"
				/>
			</Simplebar>
		</div>
		<!-- TODO: доработать -->
		<SearchSlider />
	</VAccordion>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { VAccordion } from '@/shared/components/Accordion'
import { useTranslation } from '@/shared/lib/i18n'

import { SearchSlider } from '@/features/search-filter'

import { useFilterStore, useFilterCatalogsStore } from '@/features/Search/filter'

import localization from './MainParams.localization.json'
import CheckboxItem from './CheckboxItem.vue'

import Simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

const filterStore = useFilterStore()
const filterCatalogsStore = useFilterCatalogsStore()

const { t } = useTranslation(localization)

const toggleCheckbox = (id: number, field: 'cuisine_id' | 'diet_type_id') => {
    // TODO: дать возможность выбирать несколько элементов, так как это checkbox
    // Поправить API
    const value = filterStore.filter[field] === id ? undefined : id

    filterStore.updateFilterAndFetchRecipeList({
        [field]: value
    })
}

onMounted(() => {
    filterCatalogsStore.fetchCuisineList()
    filterCatalogsStore.fetchDietTypeList()
})
</script>

<style lang="scss">
.simplebar-scrollbar {
    &::before {
        background-color: #319A6E;
        opacity: 1;
        border-radius: 1px;
        left: 0;
        right: 0;
    }

    &.simplebar-visible:before {
        opacity: 1;
    }
}

.simplebar-track.simplebar-vertical {
    width: 2px;
    background-color: #E5E7EB;
    right: 0;

    .simplebar-scrollbar {
        right: 0;
        width: 100%;
    }
}

.recipe-search {
    border-top: 1px solid #1C1C1C0D;
    border-bottom: 1px solid #1C1C1C0D;
    padding: 20px 16px;
    border-radius: 16px;
}

.border {
    border: 1px solid #E1E1E1;
}
.border-slide {
    border: 1px solid #319A6E33;
    border-radius: 4px;
}
</style>