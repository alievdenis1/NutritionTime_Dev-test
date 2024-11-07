<template>
	<div class="flex items-center gap-1">
		<IconHeart
			:is-liked="isLiked"
			@toggle="handleToggleLike"
		/>
		<span class="text-slateGray text-xs">{{ likesAmount }}</span>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { IconHeart } from '@/shared/components/Icon'

import { toggleComment } from '../../api'

const props = defineProps<{
    commentId: number;
    recipeId: number;
    isLikedInit: boolean;
    likes: number;
}>()

const isLiked = ref(props.isLikedInit || false)
const likesAmount = ref(props.likes || 0)

const handleToggleLike = async () => {
    if (isLiked.value) {
        likesAmount.value--
    } else {
        likesAmount.value++
    }
    isLiked.value = !isLiked.value

    const { data, execute } = toggleComment({ commentId: props.commentId, recipeId: props.recipeId })

    await execute()

    // isLiked.value = data.value.is_Liked
    // likesAmount.value = data.value.likes_count
}
</script>

<style scoped>

</style>