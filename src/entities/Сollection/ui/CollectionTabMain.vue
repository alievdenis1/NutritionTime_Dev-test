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
			<VDragAndDrop
				:items="dragAndDropItems"
				class="mt-[16px]"
				@edit="onEdit"
				@delete="onDelete"
				@adding="onAdding"
			/>
			<RecipesList :recipes-data="mockRecipes" />
			<VContentBlock
				v-if="mockRecipes.length === 0"
				:image="addPrefix('/image/start-screen-image.webp')"
				:text="t('liked')"
				:button-text="t('buttonCollection')"
				button-class="bg-forestGreen text-white"
				:button-icon="IconArrowRight"
			/>
		</TabsContent>
		<TabsContent value="recipes">
			<VContentBlock
				class="mt-[65px]"
				:image="addPrefix('/image/CatIllustration.png')"
				:text="t('create')"
				:button-text="t('buttonCreate')"
				button-class="bg-orange text-white flex-row-reverse"
				:button-icon="IconPlus"
			/>
		</TabsContent>
	</TabsMain>
	<ModalCollection />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RecipesList from '../../Recipe/RecipesList/RecipesList.vue'
import { VContentBlock } from 'shared/components/ContentBlock'
import { mockRecipes, addPrefix } from '../mocks/mock-recipes'
import { useTranslation } from '@/shared/lib/i18n'
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import Localization from './Collection.localization.json'
import { VDragAndDrop, DragTypes } from 'shared/components/DragAndDrop'
import { openConfirm } from 'shared/components/Confirm'
import { IconArrowRight, IconPlus, } from 'shared/components/Icon'
import { useModalStore } from '../store/collections.store'
import ModalCollection from '../../Сollection/modal/ModalCollection.vue'

const store = useModalStore()
const { t } = useTranslation(Localization)
const dragAndDropItems = ref(store.dragAndDropItems)

const onEdit = (tab: DragTypes) => {
	store.collectionId = tab.id
	console.log(store.collectionId)
	store.openModal('edit')
}

const onDelete = async (tab: DragTypes) => {
	store.collectionId = tab.id
	console.log(store.collectionId)
	const isConfirmed = await openConfirm({
		title: t('confirmTitle'),
		description: t('confirmDescription'),
		confirmButtonText: t('confirmButton'),
	})

	if (isConfirmed) {
		store.deleteCollection()
	}
}

const onAdding = () => {
	console.log(store.collectionId)
	store.openModal('create')
}
</script>

<style lang="scss" scoped></style>