<template>
	<div>
		<TabsMain default-value="cooking">
			<TabsList class="mb-[24px] mt-[38px]">
				<TabsTrigger value="cooking">
					{{ t('howToCook') }}
				</TabsTrigger>
				<TabsTrigger value="info">
					{{ t('information') }}
				</TabsTrigger>
			</TabsList>
			<TabsContent value="cooking">
				<StepList>
					<StepItem
						v-for="step in props.recipe?.steps"
						:key="step.id"
						:description="step.description"
						:image="step.image"
						:order="step.order"
					/>
				</StepList>
			</TabsContent>
			<TabsContent value="info">
				<RecipeInfo
					:recipe="props.recipe"
				/>
			</TabsContent>
		</TabsMain>
	</div>
</template>

<script setup lang="ts">
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

import { StepItem, StepList } from '@/entities/Step'
import { RecipeInfo, Recipe } from '@/entities/Recipe'

import Localization from './RecipeTabs.localization.json'
import { useTranslation } from 'shared/lib/i18n'

const { t } = useTranslation(Localization)

const props = defineProps<{
	recipe: Recipe | null,
}>()
</script>

<style>
</style>