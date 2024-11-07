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
import { ref, defineProps, withDefaults } from 'vue'
import { IconHeart } from '@/shared/components/Icon'

import { toggleFavorite } from '../../api'

const props = withDefaults(defineProps<{
    bgColor?: string,
    recipeId: string,
    likes: number,
	isFavoriteInit: boolean,
}>(), {
    bgColor: 'bg-white',
})

const isFavorite = ref(props.isFavoriteInit || false)
const likesAmount = ref(props.likes || 0)

const { data, execute } = toggleFavorite({ recipeId: props.recipeId })

const handleClick = async () => {
	if (isFavorite.value) {
        likesAmount.value--
    } else {
        likesAmount.value++
    }
    isFavorite.value = !isFavorite.value

    await execute()

    // isFavorite.value = data.value.is_Liked
    // likesAmount.value = data.value.likes_count
}
</script>

<style>
</style>