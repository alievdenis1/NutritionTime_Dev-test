<template>
	<RecipeCommentsInfo :recipe="props.recipe">
		<template #action>
			<slot name="action" />
		</template>
		<template #bottomContent>
			<div
				v-if="recipe"
				class="flex items-center justify-between gap-[4px] pt-[24px]"
			>
				<img
					:src="recipe.image"
					:alt="recipe.title"
					class="w-[80px] h-[80px] rounded-[12px] object-cover object-center shadow-sm"
				>
				<div class="text-sm text-darkGray">
					{{ recipe.title }}
				</div>
			</div>
		</template>
	</RecipeCommentsInfo>
</template>

<script setup lang="ts">
import { Recipe } from '@/entities/Recipe'

import RecipeCommentsInfo from './RecipeCommentsInfo.vue'

const props = defineProps<{
	recipe: Recipe | null,
}>()
</script>

<style scoped>

</style>