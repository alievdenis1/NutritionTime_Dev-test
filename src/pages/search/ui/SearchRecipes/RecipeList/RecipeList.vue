<template>
	<div class="flex flex-col gap-[24px]">
		<div
			v-for="recipe in (filterStore.searchedRecipeList || [])"
			:key="recipe.id"
		>
			<RecipeLargeItem :recipe="recipe">
				<template #controlPanel>
					<div class="flex items-center justify-between  mt-4">
						<div class="flex justify-center items-center">
							<!-- TODO: доделать кнопки на всех карточках рецептов -->

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
				</template>
			</RecipeLargeItem>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RecipeLargeItem } from '@/entities/Recipe'
import { ShortFavoriteButton } from '@/features/Recipe/addToFavorite'

import { useFilterStore } from '@/features/Search/filter'

const filterStore = useFilterStore()

// TODO: подумать над лоадером/скелетоном
onMounted(() => {
    filterStore.fetchRecipeList()
})
</script>

<style lang="scss" scoped></style>
