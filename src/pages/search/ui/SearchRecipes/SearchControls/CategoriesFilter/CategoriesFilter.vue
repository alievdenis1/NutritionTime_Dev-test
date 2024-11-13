<template>
	<div class="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide">
		<div class="inline-flex space-x-2">
			<div
				v-for="tag in (filterCatalogsStore.categoryList || [])"
				:key="tag.id"
				:class="[isActive(tag.id) ? 'bg-transparentGreen text-forestGreen' : 'bg-lightGray text-slateGray']"
				class="px-[16px] py-[10px] inline-flex items-center rounded-[100px] text-sm"
				@click="selectCategory(tag.id)"
			>
				{{ tag.name }}
				<button
					v-if="isActive(tag.id)"
					class="ml-2 text-forestGreen"
					@click.stop="resetCategory()"
				>
					<IconClose
						class="w-[12px] h-[12px] cursor-pointer"
						:icon-color="'#319A6E'"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { IconClose } from '@/shared/components/Icon'

import { useFilterStore, useFilterCatalogsStore } from '@/features/Search/filter'

const filterStore = useFilterStore()
const filterCatalogsStore = useFilterCatalogsStore()

const isActive = (id: number) => filterStore.filter.category_id === id

const selectCategory = (id: number) => {
    if (filterStore.filter.category_id === id) return

    filterStore.updateFilterAndFetchRecipeList({
        category_id: id
    })
}

const resetCategory = () => {
    filterStore.updateFilterAndFetchRecipeList({
        category_id: undefined
    })
}

onMounted(() => {
    filterCatalogsStore.fetchCategoryList()
})
</script>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

</style>