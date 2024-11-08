<template>
	<div class="flex flex-col gap-[16px]">
		<div
			v-for="recipe in recipes"
			:key="recipe.id"
		>
			<RecipeShortItem
				:recipe="recipe"
				@click="router.push(`/recipe/${recipe.id}/test`)"
			>
				<template #averageRating="{ averageRating }">
					<AverageRating :value="averageRating" />
				</template>
			</RecipeShortItem>
			<div
				class="flex items-center justify-between  mt-4"
				@click.stop
			>
				<div class="flex justify-center items-center">
					<div class="flex justify-center items-center gap-[8px] mr-[20px]">
						<img
							class="h-[20px] w-[20px]"
							:src="recipe.author.avatar"
							:alt="recipe.author.name"
						>
						{{ recipe.author.name }}
					</div>
					<!-- <button
						class="flex justify-center items-center gap-[4px] text-[#535353] cursor-pointer"
						@click="router.push(`/all-comment/${recipe.id}`)"
					>
						<IconComment />
						{{ recipe.commentsCount }}
					</button> -->
				</div>
				<div class="flex items-center justify-between gap-[16px]">
					<ShortFavoriteButton
						:likes="recipe.likes_count || 0"
						:recipe-id="recipe.id"
						:is-favorite-init="recipe?.is_favorited || false"
					/>
					<!-- <IconFavorites
						:is-liked="favoritesStates[recipe.id]"
						active-color="#319A6E"
						:disabled="isFavoriting[recipe.id]"
						@toggle="toggleFavorite(recipe.id)"
					/>
					<div @click="toggleLike(recipe.id)">
						<div class="flex justify-center items-center gap-[8px] text-[#535353]">
							<IconHeart
								:is-liked="likedStates[recipe.id]"
								icon-color="#319A6E"
								:disabled="isLiking[recipe.id]"
							/>
							<p :class="{ 'text-green': likedStates[recipe.id] }">
								{{ recipe.likes }}
							</p>
						</div>
					</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Recipe, RecipeShortItem } from '@/entities/Recipe'
import { AverageRating } from '@/shared/components/AverageRating'

import { ShortFavoriteButton } from '@/features/Recipe/addToFavorite'

import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{ recipes: Recipe[] }>()
</script>

<style lang="scss" scoped></style>
