<template>
	<div class="flex flex-col p-[16px]">
		<div class="flex justify-center items-center min-h-[44px] mb-[16px]">
			<h2 class="text-center text-lg text-darkGray">
				{{ t('reviews') }}
			</h2>
		</div>
		<RecipeCommentsInfoWithImage
			:recipe="recipe"
			class="mb-[24px]"
		>
			<template #action>
				<div class="w-max">
					<AddCommentButton
						:recipe-id="recipe?.id || 0"
						@submit="handleSubmitComment"
					/>
				</div>
			</template>
		</RecipeCommentsInfoWithImage>
		<div class="space-y-[12px]">
			<CommentList>
				<CommentItem
					v-for="comment in comments"
					:key="comment.id"
					:author-image="comment.user?.avatar"
					:author-name="comment.user.name"
					:images="comment?.images"
					:text="comment.text"
				>
					<ToggleComment
						:comment-id="comment.id"
						:recipe-id="recipe?.id || 0"
						:likes="comment.likes_count"
						:is-liked-init="comment.is_liked"
					/>
					<div class="w-full h-[1px] bg-[#1C1C1C0D]" />
				</CommentItem>
			</CommentList>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useTranslation } from '@/shared/lib/i18n'

import { getRecipe, Recipe, RecipeCommentsInfoWithImage } from '@/entities/Recipe'
import { CommentItem, CommentList, getCommentList, Comment } from '@/entities/Comment'

import { AddCommentButton } from '@/features/Comment/addComment'
import { ToggleComment } from '@/features/Comment/toggleComment'

import Localization from './AllComments.localization.json'

import { mockRecipe } from './mocks/mock-recipes-item'

const route = useRoute()

const { t } = useTranslation(Localization)

const recipeId = ref(route.params.id as string)

const recipe = ref<Recipe | null>(null)
const comments = ref<Comment[] | null>(null)

const fetchRecipe = async () => {
	const { data, loading, execute } = await getRecipe({ id: recipeId.value })

	await execute()

	// TODO: добавить какой-нибудь лоадер, скелетон

	// recipe.value = data.value
	recipe.value = mockRecipe[0]
}

const fetchComments = async () => {
	const { data, loading, execute } = await getCommentList({ recipeId: recipeId.value })

	await execute()

	// TODO: добавить какой-нибудь лоадер, скелетон

	// recipe.value = data.value
	comments.value = mockRecipe[0].comments
}

const handleSubmitComment = () => {
	fetchRecipe()
	fetchComments()
}

onMounted(() => {
    Promise.all([fetchRecipe(), fetchComments()])
})
</script>

<style scoped>

</style>