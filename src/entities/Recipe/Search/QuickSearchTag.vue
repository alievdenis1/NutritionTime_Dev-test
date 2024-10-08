<template>
	<div class="mt-[16px] mb-[12px]">
		<div class="flex items-center">
			<button
				class="flex items-center justify-center w-[88px] h-[40px] bg-forestGreen text-white rounded-[8px] px-[16px]"
				@click="openModal"
			>
				<span class="text-sm">{{ t('tags') }}</span>
				<IconTabs
					v-if="tabCount <= 0"
					icon-color="#FFFFFF"
					class="ml-[6px]"
				/>
				<div
					v-else
					class="ml-[6px] bg-orange text-white rounded-full px-2 py-1 text-xs"
				>
					{{ tabCount }}
				</div>
			</button>
			<div class="w-[2px] h-[40px] bg-lightGray ml-[12px] mr-[12px]" />
			<div class="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide">
				<div class="inline-flex space-x-2">
					<div
						v-for="tag in quickSearchTags"
						:key="tag.id"
						:class="getTagClasses(tag)"
						@click="selectTag(tag)"
					>
						{{ tag.text }}
						<button
							v-if="tag.isActive"
							class="ml-2 text-forestGreen"
							@click.stop="deselectTag()"
						>
							<IconClose
								class="w-[12px] h-[12px] cursor-pointer"
								:icon-color="'#319A6E'"
							/>
						</button>
					</div>
				</div>
			</div>
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
				<TagsCollectionsItem
					class="flex-grow overflow-y-auto custom-scrollbar"
					:categories-tags="categories"
					:modal-selected-tags="modalSelectedTags"
					@tag-changed="handleTagChanged"
				/>
				<button
					:class="['block w-full mt-4 py-2 rounded-xl text-white text-center cursor-pointer', buttonClass]"
					@click="closeModal"
				>
					0{{ t('addSelectedTag') }}
				</button>
			</div>
		</VModal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconTabs, IconClose } from 'shared/components/Icon'
import { useTranslation } from 'shared/lib/i18n'
import localization from './QuickSearchTag.localization.json'
import { useSearchStore } from './store/search-store'
import { VModal } from 'shared/components/Modal'
import TagsCollectionsItem  from '../CreateRecipe/recipe-models/tagsRecipe/TagsCollectionsItem.vue'

const store = useSearchStore()
const { t } = useTranslation(localization)
const openModal = () => {
	showModal.value = true
}
interface Tag {
    id: number;
    text: string;
    isActive: boolean;
}
const showModal = ref(false)
const modalSelectedTags = ref<string[]>([])
const tabCount = ref(0)

const closeModal = () => {
	showModal.value = false
	updateTabCount()
}
const updateTabCount = () => {
	tabCount.value = modalSelectedTags.value.length
}
const handleTagChanged = (updatedTags: string[]) => {
	modalSelectedTags.value = updatedTags
	// tabCount.value = updatedTags.length
}

const buttonClass = computed(() => {
	return modalSelectedTags.value.length > 0 ? 'bg-forestGreen' : 'bg-disabled cursor-not-allowed'
})
const quickSearchTags = ref<Tag[]>([
    { id: 1, text: 'Из индейки', isActive: false },
    { id: 2, text: 'Завтраки', isActive: false },
    { id: 3, text: 'Обед', isActive: false },
    { id: 4, text: 'Ужин', isActive: false },
    { id: 5, text: 'Белковые', isActive: false },
])

const categories = ref([
	{ name: 'Категория 1', tags: ['#тег', '#тег1', '#тег2', '#тег3', '#тег4', '#тег5', '#тег6', '#тег7', '#тег8', '#тег9', '#тег10', '#тег11'] },
	{ name: 'Категория 2', tags: ['#тег12', '#тег13', '#тег14', '#тег15', '#тег16', '#тег17', '#тег18', '#тег19', '#тег20', '#тег21', '#тег22', '#тег23'] },
	{ name: 'Категория 3', tags: ['#тег24', '#тег25', '#тег26', '#тег27', '#тег28', '#тег29', '#тег30', '#тег31', '#тег32', '#тег33', '#тег34', '#тег35'] },
	{ name: 'Категория 4', tags: ['#тег36', '#тег37', '#тег38', '#тег39', '#тег40', '#тег41', '#тег42', '#тег43', '#тег44', '#тег45', '#тег46', '#тег47'] },
	{ name: 'Категория 5', tags: ['#тег48', '#тег49', '#тег50', '#тег51', '#тег52', '#тег53', '#тег54', '#тег55', '#тег56', '#тег57', '#тег58', '#тег59'] },
])

const getTagClasses = computed(() => (tag: Tag) => {
    return [
        'px-[16px] py-[10px] inline-flex items-center rounded-[100px] text-sm',
        tag.isActive
            ? 'bg-transparentGreen text-forestGreen'
            : 'bg-lightGray text-slateGray cursor-pointer'
    ]
})

const selectTag = (selectedTag: Tag) => {
	store.searchRecipes()
    quickSearchTags.value.forEach(tag => {
        tag.isActive = tag.id === selectedTag.id
    })
}

const deselectTag = () => {
    quickSearchTags.value.forEach(tag => {
        tag.isActive = false
    })
}
</script>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

</style>@/entities/Recipe/Search