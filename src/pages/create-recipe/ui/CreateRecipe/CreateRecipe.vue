<template>
	<TabsMain
		v-model="activeTab"
		default-value="ownRecipe"
		class="p-[16px]"
	>
		<div class="flex justify-center items-center mb-[16px] min-h-[44px]">
			<h2 class="text-center text-lg text-darkGray">
				{{ t('addRecipe') }}
			</h2>
		</div>
		<TabsList>
			<TabsTrigger
				value="ownRecipe"
			>
				{{ t('manualCreation') }}
			</TabsTrigger>
			<TabsTrigger
				value="aiRecipe"
				class="flex gap-[8px] items-center"
			>
				{{ t('aiCreation') }}
				<IconAi :icon-color="activeTab === 'aiRecipe' ? '#319A6E' : '#E1E1E1'" />
			</TabsTrigger>
		</TabsList>
		<EditRecipe v-show="activeTab === 'ownRecipe'" />
		<!-- <CreateAi v-show="activeTab === 'aiRecipe'" /> -->
		<div v-show="activeTab === 'aiRecipe'">
			{{ t('development') }}
		</div>
	</TabsMain>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { CreateOwn, CreateAi } from 'features/create-recipe'
import { TabsMain, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './CreateRecipeTabs.localization.json'
import { IconAi } from 'shared/components/Icon'
import { EditRecipe } from '@/widgets/edit-recipe'

const { t } = useTranslation(localizations)

const activeTab = ref<'ownRecipe' | 'aiRecipe'>('ownRecipe')
</script>

<style scoped></style>