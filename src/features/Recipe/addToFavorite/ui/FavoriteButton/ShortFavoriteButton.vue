<template>
	<div class="flex items-center gap-1">
		<IconHeart
			:is-liked="isFavorite"
			@toggle="handleToggleLike"
		/>
		<span class="text-slateGray text-xs">{{ likesAmount }}</span>
	</div>
</template>

<script setup lang="ts">
import { IconHeart } from '@/shared/components/Icon'

import { useAddToFavorite } from './addToFavorite'

const props = defineProps<{
    recipeId: number;
    isFavoriteInit: boolean;
    likes: number;
}>()

const { handleClick: handleToggleLike, isFavorite, likesAmount, } = useAddToFavorite({
    isFavoriteInit: props.isFavoriteInit || false,
    likes: props.likes || 0,
    recipeId: props.recipeId,
})

// const isLiked = ref(props.isLikedInit || false)
// const likesAmount = ref(props.likes || 0)

// const handleToggleLike = async () => {
//     const like = isLiked.value ? -1 : 1
//     likesAmount.value = likesAmount.value + like
//     isLiked.value = !isLiked.value

//     const { data, execute } = toggleComment({ commentId: props.commentId, recipeId: props.recipeId })

//     await execute()

//     // isLiked.value = data.value.is_Liked
//     // likesAmount.value = data.value.likes_count
// }
</script>

<style scoped>

</style>