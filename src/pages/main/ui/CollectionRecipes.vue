<template>
	<!-- TODO: сделать адаптер для коллекции, чтобы она подошла к DnD -->
	<VDragAndDrop
		:items="[]"
		class="mt-[16px]"
		@edit="onEdit"
		@delete="onDelete"
		@adding="onAdding"
		@change="onChangeCollection"
	/>
	<RecipeList
		v-if="recipes?.length"
		:recipes="recipes"
	/>
	<VContentBlock
		v-else
		image="/NutritionTime_Dev-test/image/start-screen-image.webp"
		:text="t('liked')"
		:button-text="t('buttonCollection')"
		button-class="bg-forestGreen text-white"
		:button-icon="IconArrowRight"
	/>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import RecipesList from '../../Recipe/RecipesList/RecipesList.vue'
import { VContentBlock } from '@/shared/components/ContentBlock'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './MainPage.localization.json'
import { VDragAndDrop, DragTypes } from 'shared/components/DragAndDrop'
import { openConfirm } from 'shared/components/Confirm'
import { IconArrowRight } from 'shared/components/Icon'
import { useModalCreateStore } from '@/entities/Recipe/CreateRecipe/modal-create/model/model-store'
import { getFavoriteRecipeList, Recipe } from '@/entities/Recipe'
import RecipeList from './RecipeList.vue'
import { Collection } from '@/entities/Collection/model/collection'
import { mockRecipe } from '@/widgets/recipe-card/ui/RecipeCard/mocks/mock-recipes-item'

const { t } = useTranslation(Localization)

const modalCreateStore = useModalCreateStore()

const recipes = ref<Recipe[] | null>(null)
// TODO: сделать адаптер для коллекции, чтобы она подошла к DnD
const collections = ref<Collection[] | null>(null)

const onEdit = (tab: DragTypes) => {
	// store.collectionId = tab.id
	// store.openModal('edit')
}

const openModalCreateRecipe = () => {
	modalCreateStore.openModalRecipe()
}

const onDelete = async (tab: DragTypes) => {
	// store.collectionId = tab.id
	const isConfirmed = await openConfirm({
		title: t('confirmTitle'),
		description: t('confirmDescription'),
		confirmButtonText: t('confirmButton'),
	})

	if (isConfirmed) {
		// store.deleteCollection()
	}
}

const onAdding = () => {
	// store.openModal('create')
}

const onChangeCollection = (id:number) => {
	// recipesList.value = mockRecipes.filter(recipe => recipe.collectionId === id)
}

const fetchFavoriteRecipeList = async () => {
    const { data, execute } = getFavoriteRecipeList()

    await execute()

    recipes.value = mockRecipe
    // recipes.value = data.value?.data || []
}

onMounted(() => {
	// onChangeCollection(1)
    fetchFavoriteRecipeList()
    // fetchCollections()
})
</script>

<style lang="scss" scoped></style>
