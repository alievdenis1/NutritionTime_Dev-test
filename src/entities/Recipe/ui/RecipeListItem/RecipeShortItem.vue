<template>
	<div class="flex bg-white border-custom gap-[10px]">
		<div class="relative">
			<img
				class="img object-cover rounded-[20px]"
				:src="props.recipe.image"
				alt="recipe image"
			>
			<div
				v-if="$slots.averageRating"
				class="absolute top-[8px] left-[8px]"
			>
				<slot
					name="averageRating"
					:average-rating="props.recipe.average_rating"
				/>
			</div>
		</div>

		<div class="p-[12px] flex flex-col justify-between w-[100%]">
			<div>
				<h2 class="truncated-text text-lg font-regular text-sm">
					{{ props.recipe.title }}
				</h2>
			</div>
			<div class="flex justify-between items-center mt-2 flex-wrap gap-[6px]">
				<TotalTime :value="props.recipe.total_time" />
				<CaloriesBlock :value="props.recipe.calories" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

import { Recipe } from '../../model'

import CaloriesBlock from './CaloriesBlock.vue'
import TotalTime from './TotalTime.vue'
// TODO: может получится через v-bind снаружи передать весь recipe???
const props = defineProps<{ recipe: Recipe }>()
</script>

<style scoped>
.border-custom {
	border: 1px solid #1C1C1C0D;
	border-radius: 20px;
}

.truncated-text {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	line-clamp: 2;
	max-height: 3em;
	line-height: 1.5em;
}

.img {
	height: 140px;
	min-width: 140px;
	max-width: 140px;
}
</style>