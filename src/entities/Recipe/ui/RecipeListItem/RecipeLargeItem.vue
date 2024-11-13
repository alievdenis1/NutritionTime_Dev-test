<template>
	<div class="recipe-card">
		<div class="recipe-card-inner">
			<div class="flex items-center mb-[12px]">
				<img
					class="w-8 h-8 rounded-full mr-2"
					:src="props.recipe.author.avatar"
					:alt="props.recipe.author.name"
				>
				<span class="text-sm text-gray-600">{{ props.recipe.author.name }}</span>
			</div>
			<!-- TODO: убрать /test тут и в других местах -->
			<div
				class="relative"
				@click="router.push(`/recipe/${props.recipe.id}/test`)"
			>
				<img
					class="w-full h-[343px] object-cover rounded-[12px]"
					:src="props.recipe.image"
					:alt="props.recipe.title"
				>
				<div class="absolute top-[8px] left-[8px]">
					<AverageRating :value="props.recipe.average_rating" />
				</div>
			</div>

			<div class="flex items-center text-sm text-gray-600 mb-4 mt-[12px]">
				<TotalTime :value="props.recipe.total_time" />
				<CaloriesBlock :value="props.recipe.calories" />
			</div>
			<h2 class="text-sm text-darkGray mb-[8px]">
				{{ recipe.title }}
			</h2>

			<slot name="controlPanel" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { AverageRating } from '@/shared/components/AverageRating'

import { Recipe } from '../../model'

import CaloriesBlock from './CaloriesBlock.vue'
import TotalTime from './TotalTime.vue'

const router = useRouter()

// TODO: может получится через v-bind снаружи передать весь recipe???
const props = defineProps<{
	recipe: Recipe
}>()
</script>

<style scoped>
.recipe-card {
	width: 100vw;
	margin-left: calc(-50vw + 50%);
	background-color: white;
	border-top: 1px solid #1C1C1C0D;
	border-bottom: 1px solid #1C1C1C0D;
	padding: 12px 16px;
	margin-top: 24px;
	border-radius: 16px;
}

.recipe-card-inner {
	max-width: 100%;
	margin: 0 auto;
}

@media (min-width: 640px) {
	.recipe-card-inner {
		max-width: 640px;
	}
}

@media (min-width: 768px) {
	.recipe-card-inner {
		max-width: 768px;
	}
}

@media (min-width: 1024px) {
	.recipe-card-inner {
		max-width: 1024px;
	}
}
</style>