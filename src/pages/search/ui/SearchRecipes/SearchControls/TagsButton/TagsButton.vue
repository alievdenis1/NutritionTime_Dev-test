<template>
	<div>
		<div class="flex items-center">
			<button
				class="flex items-center justify-center gap-[6px] w-[88px] h-[40px] bg-forestGreen text-white rounded-[8px] px-[16px]"
				@click="openModal"
			>
				<span class="text-sm">{{ t('tags') }}</span>
				<IconTabs
					v-if="filterStore.tagsSelectedCount === 0"
					icon-color="#FFFFFF"
				/>
				<div
					v-else
					class="bg-orange text-white rounded-full px-2 py-1 text-xs"
				>
					{{ filterStore.tagsSelectedCount }}
				</div>
			</button>
		</div>
		<VModal
			:show="showModal"
			@close="closeModal"
		>
			<div class="h-[90vh] flex flex-col">
				<div class="flex justify-between mb-5">
					<h2 class="text-xl flex items-center">
						{{ t('SearchByTag') }}
					</h2>
					<div class="w-12 h-12 flex items-center justify-center bg-lightGray rounded-full">
						<IconClose
							class="w-6 h-6 cursor-pointer"
							icon-color="#9F9FA0"
						/>
					</div>
				</div>
				<!-- TODO: этот компонент поднять наверх, так как он ещё будет использоваться при создании/редактировании рецепта -->
				<TagsCollectionsItem
					class="flex-grow overflow-y-auto custom-scrollbar"
					:categories-tags="filterCatalogsStore.tagsByCategories"
					:active-tags="filterStore.filter.tags || []"
					@select-tag="handleSelectTag"
					@reset-tag="handleResetTag"
				/>
				<button
					class="block w-full mt-4 py-2 rounded-xl text-white text-center bg-forestGreen cursor-pointer"
					:class="{
						'bg-disabled cursor-not-allowed': filterStore.tagsSelectedCount === 0
					}"
					@click="closeModal"
				>
					{{ t('addSelectedTag', { count: filterStore.totalSearchedRecipes }) }}
				</button>
			</div>
		</VModal>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconTabs, IconClose } from '@/shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './SearchRecipes.localization.json'
import { useFilterStore, useFilterCatalogsStore } from '@/features/Search/filter'
import { VModal } from '@/shared/components/Modal'
import TagsCollectionsItem  from './TagsCollectionsItem.vue'

const { t } = useTranslation(localization)

const filterStore = useFilterStore()
const filterCatalogsStore = useFilterCatalogsStore()

const showModal = ref(false)

const openModal = () => {
	showModal.value = true
}

const closeModal = () => {
	showModal.value = false
}

const handleSelectTag = (tagId: number) => {
	if (filterStore.filter.tags?.includes(tagId)) return

	filterStore.updateFilterAndFetchRecipeList({
        tags: [...(filterStore.filter.tags || []), tagId]
    })
}

const handleResetTag = (tagId: number) => {
	const activeTags = (filterStore.filter.tags || []).filter((id) => id !== tagId)

	filterStore.updateFilterAndFetchRecipeList({
        tags: activeTags
    })
}

// TODO: добавить скелетон на загрузку как на лидерборде
watch(showModal, (isOpened) => {
	if (isOpened) {
		filterCatalogsStore.fetchTagList()
	}
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