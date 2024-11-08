<template>
	<button
		class="flex items-center justify-center rounded-full shadow-custom transition-colors duration-300 gap-1"
		:class="[props.bgColor, 'w-[62px] h-[44px]']"
		@click="handleClick"
	>
		<IconHeart
			class="w-[20px] h-[20px]"
			:is-liked="isFavorite"
			active-color="#319A6E"
		/>
		<span
			:class="['text-slateGray text-sm font-medium', { 'text-green-500': isFavorite }]"
		>
			{{ likesAmount }}
		</span>
	</button>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
import { IconHeart } from '@/shared/components/Icon'

import { useAddToFavorite } from './addToFavorite'

const props = withDefaults(defineProps<{
    bgColor?: string,
    recipeId: number,
    likes: number,
	isFavoriteInit: boolean,
}>(), {
    bgColor: 'bg-white',
})

const { handleClick, isFavorite, likesAmount, } = useAddToFavorite({
    isFavoriteInit: props.isFavoriteInit || false,
    likes: props.likes || 0,
    recipeId: props.recipeId,
})
</script>

<style>
</style>