<template>
	<RecipeList
		v-if="recipes?.length"
		:recipes="recipes"
	/>
	<VContentBlock
		v-else
		class="mt-[65px] mb-[80px]"
		image="/NutritionTime_Dev-test/image/CatIllustration.png"
		:text="t('create')"
		:button-text="t('buttonCreate')"
		button-class="bg-orange text-white flex-row-reverse"
		:button-icon="IconPlus"
		@button-click="openModalCreateRecipe"
	/>
	<ModalCollection />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import RecipesList from '../../Recipe/RecipesList/RecipesList.vue'
import { VContentBlock } from '@/shared/components/ContentBlock'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './MainPage.localization.json'
import { IconPlus } from '@/shared/components/Icon'
import { useModalCreateStore } from '@/entities/Recipe/CreateRecipe/modal-create/model/model-store'
import ModalCollection from '@/entities/Сollection/modal/ModalCollection.vue'
import { getMyRecipeList, Recipe } from '@/entities/Recipe'

import RecipeList from './RecipeList.vue'

const { t } = useTranslation(Localization)
const recipes = ref<Recipe[] | null>(null)

const modalCreateStore = useModalCreateStore()

const openModalCreateRecipe = () => {
    modalCreateStore.openModalRecipe()
}

const fetchMyRecipeList = async () => {
    const { data, execute } = getMyRecipeList()

    await execute()

    recipes.value = data.value?.data || []
}

onMounted(() => {
    fetchMyRecipeList()
})
</script>

<style lang="scss" scoped></style>
