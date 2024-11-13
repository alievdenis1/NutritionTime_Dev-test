<template>
	<!-- TODO: исправить background-color, чтобы был в цвет заднего фона -->
	<div class="relative flex-grow">
		<input
			type="text"
			class="w-full px-[16px] py-[12px] h-[44px] rounded-[8px] text-sm text-darkGray placeholder-gray bg-white border-custom searchInput"
			:placeholder="t('searchRecipes')"
			:value="filterStore.filter.search"
			@input="handleSearch"
		>
		<IconSearch
			class="absolute right-[16px] top-1/2 transform -translate-y-1/2 cursor-pointer"
			:icon-color="'#9F9FA0'"
		/>
	</div>
</template>

<script setup lang="ts">
import { useTranslation } from '@/shared/lib/i18n'
import { IconSearch } from '@/shared/components/Icon'

import { useFilterStore } from '@/features/Search/filter'

import localization from './SearchField.localization.json'

const { t } = useTranslation(localization)

const filterStore = useFilterStore()

// TODO: унести в хук
const debounce = (fn: () => void) => {
    let timeout: NodeJS.Timeout | null = null

    return () => {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            fn()
        }, 500)
    }
}

const updateFilter = () => {
    filterStore.fetchRecipeList()
}

const debouncedUpdateFilter = debounce(updateFilter)

const handleSearch = (e: Event) => {
    const target = (<HTMLInputElement>e.target)
    const value = target.value

    filterStore.updateFilter({ search: value })

    debouncedUpdateFilter()
}
</script>

<style scoped>
.searchInput:focus::placeholder {
	opacity: 0;
}

.border-custom {
	border: 1px solid #E1E1E1;
}

.border-custom:focus {
	border-color: rgba(49, 154, 110, 0.2);
}
</style>