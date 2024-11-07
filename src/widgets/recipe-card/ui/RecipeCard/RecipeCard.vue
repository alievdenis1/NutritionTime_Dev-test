<template>
	<div class="relative">
		<div
			class="fixed top-0 left-0 z-20 w-full transition-all duration-300"
			:class="{ 'bg-white': !isImageVisible }"
		>
			<div class="flex justify-end items-center p-[16px]">
				<div class="flex space-x-2">
					<!-- TODO: остальные кнопки добавить, когда будет функционал -->

					<ToggleFavoriteButton
						:bg-color="isImageVisible ? 'bg-white' : 'bg-lightGray'"
						:likes="recipe?.likes_count || 0"
						:recipe-id="recipeId"
						:is-favorite-init="recipe?.is_favorited || false"
					/>
				</div>
			</div>
		</div>
		<div
			ref="imageContainer"
			class="w-full h-[361px]"
		>
			<RecipeImage
				:image="recipe?.image || ''"
				:title="recipe?.title || ''"
			/>
		</div>
		<div class="p-[16px] shadow-custom mx-[16px] mt-[24px] mb-[16px] rounded-[16px]">
			<div class="text-slateGray text-lg mb-[12px]">
				{{ t('yourRecipe') }}
			</div>
			<div class="text-xs text-slateGray mb-[12px]">
				{{ t('editInstructions') }}
			</div>
			<VButton
				:color="ButtonColors.White"
				@click="editingRecipe"
			>
				<div class="flex items-center justify-center gap-[12px]">
					<div>{{ t('editButton') }}</div>
					<div>
						<IconArrowRight icon-color="#319A6E" />
					</div>
				</div>
			</VButton>
		</div>

		<div class="p-[16px]">
			<div class="flex items-center mb-[16px] mt-[24px]">
				<img
					:src="recipe?.author.avatar"
					:alt="recipe?.author.name"
					class="w-8 h-8 rounded-full mr-2"
				>
				<span class="text-sm text-slateGray">{{ recipe?.author.name }}</span>
				<div
					v-if="recipe?.total_comments_count"
					class=" ml-auto flex items-center"
				>
					<span class="text-xs text-slateGray mr-[8px]">
						{{ t('reviews', { count: recipe.total_comments_count }) }}
					</span>
					<span
						class="text-sm text-white w-[32px] h-[32px] rounded-[50%] bg-forestGreen flex items-center justify-center"
					>
						{{ recipe.average_rating }}
					</span>
				</div>
			</div>

			<h2 class="text-xl font-bold text-darkGray mb-[8px]">
				{{ recipe?.title }}
			</h2>
			<p class="text-sm text-slateGray mb-[24px]">
				{{ recipe?.description }}
			</p>

			<IngredientsBlock
				:ingredients="recipe?.ingredients || []"
				:total-weight="recipe?.total_weight || 0"
			/>

			<RecipeTabs
				:recipe="recipe"
				class="mb-[40px]"
			/>

			<RecipeCommentsInfo
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
			</RecipeCommentsInfo>
			<div class="space-y-[12px]">
				<CommentList>
					<CommentItem
						v-for="comment in recipe?.comments"
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
			<VButton
				:color="ButtonColors.White"
				class="mt-[24px]"
				@click="allCommentPage"
			>
				<div class="flex items-center justify-center gap-[12px]">
					<div>{{ t('allReviews') }}</div>
					<div>
						<IconArrowRight icon-color="#319A6E" />
					</div>
				</div>
			</VButton>
		</div>
		<div class="px-[16px]">
			<div class="shadow-custom mt-[32px] p-[16px] rounded-[12px] flex items-center justify-between">
				<div>
					<div class="text-lg text-darkGray">
						{{ t('recipeAuthor') }}
					</div>
					<div class="flex items-center gap-[8px] mt-[12px]">
						<img
							:src="recipe?.author.avatar"
							:alt="recipe?.author.name"
							class="w-[20px] h-[20px]"
						>
						<div class="text-xs text-slateGray">
							{{ recipe?.author.name }}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="px-[16px]">
			<div class="shadow-custom mt-[32px] p-[16px] rounded-[12px] flex items-center justify-between">
				<!-- TODO: нужен NFT владелец -->

				<!-- <div>
					<div class="text-lg text-darkGray">
						{{ t('nftOwner') }}
					</div>
					<div class="flex items-center gap-[8px] mt-[12px]">
						<img
							:src="recipe?.nftOwner.image"
							:alt="recipe?.nftOwner.name"
							class="w-[20px] h-[20px]"
						>
						<div class="text-xs text-slateGray">
							{{ recipe?.nftOwner.name }}
						</div>
					</div>
				</div> -->
				<div class="w-max">
					<!-- TODO: куда ведет кнопка ????? -->
					<VButton :color="ButtonColors.White">
						<div class="flex items-center justify-center gap-[12px]">
							<div>{{ t('moreAbout') }}</div>
						</div>
					</VButton>
				</div>
			</div>
		</div>
		<div class="px-[16px] mt-[24px] mb-[16px]">
			<VButton :color="ButtonColors.White">
				<!-- TODO: унести в feature -->
				<!-- @click="exportToPDF" -->
				<div class="flex items-center justify-center gap-[12px]">
					<div>{{ t('exportToPDF') }}</div>
					<div>
						<IconLoad />
					</div>
				</div>
			</VButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { IconArrowRight, IconLoad, IconHeart } from '@/shared/components/Icon'
import { VButton, ButtonColors } from '@/shared/components/Button'
import { useTranslation } from '@/shared/lib/i18n'

import { RecipeImage, RecipeCommentsInfo, getRecipe, Recipe } from '@/entities/Recipe'
import { IngredientsBlock } from '@/entities/Ingredient'
import { CommentItem, CommentList } from '@/entities/Comment'
// TODO: нужен метод для получения списка комментариев по recipeId

import { ToggleFavoriteButton } from '@/features/Recipe/addToFavorite'
import { AddCommentButton } from '@/features/Comment/addComment'
import { ToggleComment } from '@/features/Comment/toggleComment'

import { useIntersectionObserver } from '../../lib/useIntersectionObserver'

import { RecipeTabs } from '../RecipeTabs'

import Localization from './RecipeCard.localization.json'

import { mockRecipe } from './mocks/mock-recipes-item'

const router = useRouter()
const route = useRoute()

const { t } = useTranslation(Localization)

const recipeId = ref(route.params.id as string)
const recipe = ref<Recipe | null>(null)

const imageContainer = ref<HTMLElement | null>(null)

const isImageVisible = useIntersectionObserver(imageContainer)

const editingRecipe = () => {
	if (recipe.value) {
		router.push(`/recipe/${recipe.value.id}/edit`)
	}
}

const allCommentPage = () => {
	if (recipe.value) {
		router.push(`/all-comment/${recipe.value.id}/test`)
	}
}

const fetchRecipeData = async () => {
	const { data, loading, execute } = await getRecipe({ id: recipeId.value })

	await execute()

	// TODO: добавить какой-нибудь лоадер, скелетон

	// recipe.value = data.value
	recipe.value = mockRecipe[0]
}

const handleSubmitComment = () => {
	fetchRecipeData()
}

onMounted(() => {
	fetchRecipeData()
})
</script>

<style>
</style>