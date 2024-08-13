<template>
	<VAccordion :title="title">
		<div
			class="mt-[20px]"
		>
			<p
				v-if="ingredients.length === 0"
				class="text-gray text-xs mb-4"
			>
				{{ desc }}
			</p>
			<div
				v-for="(ingredient, index) in ingredients"
				:key="index"
				class="flex items-center justify-between bg-lightGray px-[12px] py-[20px] rounded-[16px] mb-[16px]"
			>
				<span class="text-[12px]">{{ ingredient.name }}</span>
				<div>
					<span class="text-[#535353] text-xs">
						{{ ingredient.quantity }}
						{{ ingredient.type === QuantityType.WEIGHT ?
							t('unitGrams') : t('unitPieces') }}</span>
					<button
						class="text-forestGreen ml-[14px] cursor-pointer"
						@click="removeIngredient(index)"
					>
						<IconClose
							icon-color="#9F9FA0"
							class="w-[12px] h-[12px]"
						/>
					</button>
				</div>
			</div>
			<button
				class="flex bg-forestGreen items-center gap-[12px] justify-center text-white rounded-[16px] py-2 px-4 w-[100%] mb-4 cursor-pointer"
				@click="openModal"
			>
				{{ t('addIngredientButton') }}
				<IconPlus
					icon-color="#FFFFFF"
					class="w-[12px] h-[12px]"
				/>
			</button>
			<VModal
				:show="showModal"
				@close="closeModal"
			>
				<div class="p-4">
					<h2 class="text-lg mb-4">
						{{ t('addIngredientTitle') }}
					</h2>
					<div class="relative">
						<VInput
							ref="ingredientNameInput"
							v-model:value="values.title"
							class="mb-2"
							:title="t('ingredientPlaceholderName')"
							:error="!!errors?.title"
							:error-message="errors?.title?.message"
							no-digital
						/>
					</div>
					<div class="relative">
						<VInput
							v-model:value="values.quantity"
							class="mb-2"
							:title="t('ingredientPlaceholderQuantity')"
							:error="!!errors?.quantity"
							:error-message="errors?.quantity?.message"
							digital
							:max-length="10"
						/>
					</div>
					<TabsMain
						v-model="activeTab"
						default-value="weight"
						class="mb-[20px] mt-[10px]"
					>
						<TabsList>
							<TabsTrigger :value="QuantityType.WEIGHT">
								{{ t('InGrams') }}
							</TabsTrigger>
							<TabsTrigger :value="QuantityType.QUANTITY">
								{{ t('InPieces') }}
							</TabsTrigger>
						</TabsList>
					</TabsMain>
					<button
						class="bg-forestGreen text-white rounded-[16px] py-2 px-4 w-[100%] text-center"
						@click="addIngredient"
					>
						{{ t('saveIngredientButton') }}
					</button>
				</div>
			</VModal>
		</div>
		<slot />
	</VAccordion>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { VAccordion } from '@/shared/components/Accordion'
import { VModal } from '@/shared/components/Modal'
import { VInput } from '@/shared/components/Input'
import { IconClose, IconPlus } from 'shared/components/Icon'
import localization from './CreateRecipeIngredients.localization.json'
import { TabsMain, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { QuantityType } from '../types/enum'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'
import { useRoute } from 'vue-router'
import { useForm } from '@/shared/utils/useForm'
import { createRecipeIngredients } from 'features/create-recipe/model'

interface Props {
	title: string;
	desc: string;
}

defineProps<Props>()

const { t } = useTranslation(localization)
const store = useRecipeStore()
const route = useRoute()

const { values, errors, validate, clearErrors } = useForm(createRecipeIngredients, {
	defaultValues: {
		title: '',
		quantity: '',
	}
})

const showModal = ref(false)
const ingredients = ref<{ name: string; quantity: string; type: QuantityType }[]>([])
const tryToSave = ref(false)
const activeTab = ref<QuantityType>(QuantityType.WEIGHT)
const ingredientNameInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
	const isCreateRoute = route.name === 'CreateRecipe'
	if (!isCreateRoute && store.currentRecipe) {
		ingredients.value = store.currentRecipe.ingredients.map(ingredient => ({
			name: ingredient.name,
			quantity: ingredient.amount.split(' ')[0],
			type: ingredient.amount.includes('г.') ? QuantityType.WEIGHT : QuantityType.QUANTITY
		}))
	}
})

const openModal = () => {
	showModal.value = true
}

const addIngredient = (): void => {
	const isValid = validate()

	if (!isValid) return

	tryToSave.value = true
	if (values.title && values.quantity) {
		ingredients.value.push({
			name: values.title,
			quantity: values.quantity,
			type: activeTab.value
		})
		closeModal()
	}
}

const removeIngredient = (index: number) => {
	ingredients.value.splice(index, 1)
}

const closeModal = () => {
	showModal.value = false
	values.title = ''
	values.quantity = ''
	tryToSave.value = false
	clearErrors()
}

watch(ingredients, () => {
	if (store.currentRecipe) {
		store.currentRecipe.ingredients = ingredients.value.map(ingredient => ({
			name: ingredient.name,
			amount: `${ingredient.quantity} ${ingredient.type === QuantityType.WEIGHT ? 'г.' : 'шт.'}`
		}))
	}
}, { deep: true })
</script>

<style scoped>
.border {
	border: 1px solid #E1E1E1;
}

.activeInput {
	border: 1px solid #F04F4F;
}

.filledInput {
	border: 2px solid #319A6E33;
}

.overflow-x-auto {
	overflow-x: auto;
	display: flex;
	white-space: nowrap;
}

.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
	display: none;
}
</style>