<template>
	<div class="relative flex flex-col gap-[16px] mt-[16px] mb-[160px]">
		<CreateRecipeBasicInfo ref="basicInfo" />
		<CreateRecipeGradation />
		<CreateRecipeTime />
		<CreateRecipeIngredients
			:title="t('title')"
			:desc="t('desc')"
		/>
		<CreateRecipeNutritional />
		<StepByStepRecipe />
		<KitchenToolsRecipe />
		<TagsRecipe />
		<div class="px-[16px] fixed bottom-[100px] left-0 w-full">
			<v-button
				:color="ButtonColors.Green"
				@click="CheckRecipe"
			>
				<div class="flex gap-[12px] items-center">
					<div>{{ t('further') }}</div>
					<IconArrowRight icon-color="#ffffff" />
				</div>
			</v-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
CreateRecipeBasicInfo,
CreateRecipeGradation,
CreateRecipeIngredients,
KitchenToolsRecipe,
CreateRecipeNutritional,
StepByStepRecipe,
TagsRecipe,
CreateRecipeTime
}
	from
	'entities/Recipe/CreateRecipe/recipe-models'
import { ButtonColors, VButton } from '@/shared/components/Button'
import { useRouter } from 'vue-router'
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './CreateOwn.localization.json'
import { ref } from 'vue'
import { IconArrowRight } from '@/shared/components/Icon'

const router = useRouter()
const { t } = useTranslation(localizations)

const basicInfo = ref<typeof CreateRecipeBasicInfo>()

const validateFields = (): boolean | void  => {
	if (!basicInfo.value) return

	const isInvalidBasicInfo = basicInfo.value.onValidate()
	return isInvalidBasicInfo
}

const CheckRecipe = () => {
	const isValid = validateFields()
	if (isValid) {
		router.push({ path: 'check-recipe' })
	}
}
</script>

<style scoped></style>