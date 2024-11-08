<template>
	<TabsMain
		default-value="collections"
		class="p-[16px]"
	>
		<TabsList>
			<TabsTrigger value="collections">
				{{ t('collections') }}
			</TabsTrigger>
			<TabsTrigger value="recipes">
				{{ t('recipes') }}
			</TabsTrigger>
		</TabsList>
		<TabsContent value="collections">
			<CollectionRecipes />
		</TabsContent>
		<TabsContent value="recipes">
			<MyRecipes />
		</TabsContent>
	</TabsMain>
</template>

<script setup lang="ts">
// import RecipesList from '../../Recipe/RecipesList/RecipesList.vue'
// import { mockRecipes, addPrefix } from '../mocks/mock-recipes'
import { useTranslation } from '@/shared/lib/i18n'
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import Localization from './MainPage.localization.json'
// import { VDragAndDrop, DragTypes } from 'shared/components/DragAndDrop'
// import { openConfirm } from 'shared/components/Confirm'
// import { IconArrowRight, IconPlus, } from 'shared/components/Icon'
// import { useModalStore } from '../store/collections.store'

import MyRecipes from './MyRecipes.vue'
import CollectionRecipes from './CollectionRecipes.vue'

const { t } = useTranslation(Localization)
</script>

<style lang="scss" scoped></style>
