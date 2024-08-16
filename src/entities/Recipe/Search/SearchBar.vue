<template>
	<div class="flex items-center w-full bg-white mt-[20px] mb-[12px]">
		<div class="relative flex-grow">
			<input
				v-model="searchQuery"
				type="text"
				:placeholder="t('searchRecipes')"
				class="w-full px-[16px] py-[12px] h-[44px] rounded-[8px] text-sm text-darkGray placeholder-gray focus:border-forestGreen border-custom"
				@keyup.enter="handleSearch"
				@keyup.esc="clearSearch"
			>
			<IconSearch
				class="absolute right-[16px] top-1/2 transform -translate-y-1/2 cursor-pointer"
				:icon-color="'#9F9FA0'"
				@click="handleSearch"
			/>
		</div>
		<button
			class="w-[48px] h-[44px] ml-[12px] flex items-center justify-center bg-forestGreen text-white rounded-[8px] hover:bg-tealGreen transition-colors duration-200"
			@click="openFilters"
		>
			<IconFilter :icon-color="'#FFFFFF'" />
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconSearch, IconFilter } from 'shared/components/Icon'
import { useTranslation } from 'shared/lib/i18n'
import localization from './SearchBar.localization.json'
import { useSearchStore } from './store/search-store'
import { useRouter } from 'vue-router'
const router =useRouter()
const { t } = useTranslation(localization)
const store = useSearchStore()

const searchQuery = ref('')

const handleSearch = () => {
	if (searchQuery.value.trim()) {
		store.searchRecipes()
	}
}

const clearSearch = () => {
	searchQuery.value = ''
}

const openFilters = () => {
	router.push('/filter')
}

</script>

<style scoped>
.border-custom {
	border: 1px solid #E1E1E1;
}
</style>