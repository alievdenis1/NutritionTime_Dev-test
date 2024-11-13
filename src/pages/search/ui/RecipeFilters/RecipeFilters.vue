<template>
	<div class="flex flex-col bg-white mb-[100px] gap-[24px]">
		<div class="grid grid-cols-3 items-center p-[16px]">
			<h2 class="col-start-2 col-end-3 text-center text-lg text-darkGray">
				{{ t('filters') }}
			</h2>
			<!-- <div class="col-start-3 col-end-4 text-end">
				<div
					v-if="showResetButton"
					class="cursor-pointer text-slateGray text-sm"
					@click="resetFilters"
				>
					{{ t('reset') }}
				</div>
			</div> -->
		</div>

		<MainParams />
		<!-- TODO: доработать -->
		<!-- <SearchIngredients />
		<SearchNutritional /> -->
		<div class="px-[16px] absolute bottom-[20px] w-full">
			<VButton
				:color="ButtonColors.Green"
				@click="searchFilter"
			>
				440 {{ t('recipes') }}
			</VButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { VButton, ButtonColors } from '@/shared/components/Button'
// import { SearchSlider, SearchIngredients, SearchNutritional } from 'features/search-filter'
import { useTranslation } from '@/shared/lib/i18n'

import localization from './RecipeFilters.localization.json'

import { MainParams } from './MainParams'

const { t } = useTranslation(localization)
const router = useRouter()

const searchFilter = () => {
    router.push('/search/test')
}
</script>

<style lang="scss">
</style>