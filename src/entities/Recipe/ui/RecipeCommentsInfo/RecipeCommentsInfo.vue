<template>
	<div class="shadow-custom p-[16px] rounded-[12px]">
		<div class="flex items-center justify-between">
			<div v-if="props.recipe?.total_comments_count">
				<span
					class="text-sm text-white w-[32px] h-[32px] rounded-[50%] bg-forestGreen flex items-center justify-center mb-[12px]"
				>
					{{ props.recipe?.average_rating }}
				</span>
				<span class="text-nowrap">{{ t('reviews', { count: props.recipe.total_comments_count }) }}</span>
			</div>
			<div
				v-else
				class="text-sm text-darkGray"
			>
				{{ t('noReviews') }}
			</div>
			<slot name="action" />
		</div>
		<slot name="bottomContent" />
	</div>
</template>

<script setup lang="ts">
import { Recipe } from '@/entities/Recipe'

import Localization from './RecipeCommentsInfo.localization.json'
import { useTranslation } from 'shared/lib/i18n'

const { t } = useTranslation(Localization)

const props = defineProps<{
	recipe: Recipe | null,
}>()
</script>

<style scoped>

</style>