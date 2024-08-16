<template>
	<VAccordion :title="title">
		<div class="mt-[20px]">
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
					<span
						v-if="!isExclusionMode"
						class="text-[#535353] text-xs"
					>
						{{ ingredient.quantity }}
						{{ ingredient.type === QuantityType.WEIGHT ? t('unitGrams') : t('unitPieces') }}
					</span>
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
				<div
					class="p-4"
					@click="handleModalClick"
				>
					<h2 class="text-lg mb-4">
						{{ t('addIngredientTitle') }}
					</h2>
					<div
						ref="ingredientNameContainer"
						class="relative"
					>
						<span
							v-if="ingredientName.length > 0"
							class="absolute text-[12px] top-[6px] left-[12px] text-gray"
						>
							{{ t('ingredientPlaceholderName') }}
						</span>
						<input
							ref="ingredientNameInput"
							v-model="ingredientName"
							type="text"
							:placeholder="t('ingredientPlaceholderName')"
							class="border rounded px-[12px] py-4 text-base w-full mb-4 h-[54px]"
							:class="{ activeInput: activeInputName, filledInput: notEmptyIngredientName, 'pt-[26px]': notEmptyIngredientName }"
							@input="handleIngredientNameInput"
							@keydown.down="handleArrowDown"
							@keydown.up="handleArrowUp"
						>
						<ul
							v-if="filteredSuggestions.length > 0"
							class="absolute z-10 w-full bg-white border border-gray-300 rounded-b-md shadow-lg max-h-60 overflow-auto"
						>
							<li
								v-for="(suggestion, index) in filteredSuggestions"
								:key="index"
								:class="['px-4 py-2 cursor-pointer hover:bg-gray-100', { 'bg-gray-100': index === activeSuggestionIndex }]"
								@click="selectSuggestion(suggestion)"
							>
								{{ suggestion }}
							</li>
						</ul>
					</div>
					<div
						v-if="!isExclusionMode"
						class="relative"
					>
						<span
							v-if="ingredientQuantity.length > 0"
							class="absolute text-[12px] top-[6px] left-[12px] text-gray"
						>
							{{ t('ingredientPlaceholderQuantity') }}
						</span>
						<input
							v-model="ingredientQuantity"
							type="text"
							:placeholder="t('ingredientPlaceholderQuantity')"
							class="border rounded px-[12px] py-4 text-base w-full mb-4 h-[54px]"
							:class="{
								activeInput: activeInputQuantity,
								filledInput: notEmptyIngredientQuantity,
								'pt-[26px]': notEmptyIngredientQuantity,
							}"
							@input="filterNumericInput"
						>
					</div>
					<TabsMain
						v-if="!isExclusionMode"
						v-model="activeTab"
						default-value="weight"
						class="mb-[20px]"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { VAccordion } from '@/shared/components/Accordion'
import { VModal } from '@/shared/components/Modal'
import { IconClose, IconPlus } from 'shared/components/Icon'
import localization from './CreateRecipeIngredients.localization.json'
import { TabsMain, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { QuantityType } from '../types/enum'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'
import { useRoute } from 'vue-router'

interface Props {
	title: string;
	desc: string;
	isExclusionMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	isExclusionMode: false
})

const { t } = useTranslation(localization)
const store = useRecipeStore()
const route = useRoute()

const showModal = ref(false)
const ingredientName = ref<string>('')
const ingredientQuantity = ref<string>('')
const ingredients = ref<{ name: string; quantity?: string; type?: QuantityType }[]>([])
const tryToSave = ref(false)
const activeTab = ref<QuantityType>(QuantityType.WEIGHT)
const ingredientNameInput = ref<HTMLInputElement | null>(null)
const ingredientNameContainer = ref<HTMLElement | null>(null)
const quantityLimitReached = ref(false)

const ingredientSuggestions = [
	'Мука', 'Сахар', 'Соль', 'Яйца', 'Молоко', 'Масло', 'Картофель',
	'Морковь', 'Лук', 'Чеснок', 'Помидоры', 'Огурцы', 'Перец', 'Курица',
	'Говядина', 'Свинина', 'Рыба', 'Рис', 'Макароны', 'Сыр'
]

const filteredSuggestions = ref<string[]>([])
const activeSuggestionIndex = ref(-1)

onMounted(() => {
	const isCreateRoute = route.name === 'CreateRecipe'
	if (!isCreateRoute && store.currentRecipe) {
		ingredients.value = store.currentRecipe.ingredients.map(ingredient => ({
			name: ingredient.name,
			quantity: ingredient.amount?.split(' ')[0],
			type: ingredient.amount?.includes('г.') ? QuantityType.WEIGHT : QuantityType.QUANTITY
		}))
	}
})

const openModal = () => {
	showModal.value = true
}

const addIngredient = () => {
	tryToSave.value = true
	if (ingredientName.value && (props.isExclusionMode || ingredientQuantity.value)) {
		const newIngredient: { name: string; quantity?: string; type?: QuantityType } = {
			name: ingredientName.value
		}
		if (!props.isExclusionMode) {
			newIngredient.quantity = ingredientQuantity.value
			newIngredient.type = activeTab.value
		}
		ingredients.value.push(newIngredient)
		closeModal()
	}
}

const removeIngredient = (index: number) => {
	ingredients.value.splice(index, 1)
}

const closeModal = () => {
	showModal.value = false
	ingredientName.value = ''
	ingredientQuantity.value = ''
	tryToSave.value = false
	filteredSuggestions.value = []
	activeSuggestionIndex.value = -1
	quantityLimitReached.value = false
}

const filterNumericInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	let value = target.value.replace(/\D/g, '')

	if (value.length > 10) {
		value = value.slice(0, 10)
		quantityLimitReached.value = true
	} else {
		quantityLimitReached.value = false
	}

	ingredientQuantity.value = value
}

const handleIngredientNameInput = () => {
	validateIngredientName()
	filteredSuggestions.value = ingredientSuggestions.filter(suggestion =>
		suggestion.toLowerCase().startsWith(ingredientName.value.toLowerCase())
	)
	activeSuggestionIndex.value = -1
}

const handleArrowDown = () => {
	if (activeSuggestionIndex.value < filteredSuggestions.value.length - 1) {
		activeSuggestionIndex.value++
	}
}

const handleArrowUp = () => {
	if (activeSuggestionIndex.value > 0) {
		activeSuggestionIndex.value--
	}
}

const selectSuggestion = (suggestion?: string) => {
	if (suggestion) {
		ingredientName.value = suggestion
	} else if (activeSuggestionIndex.value !== -1) {
		ingredientName.value = filteredSuggestions.value[activeSuggestionIndex.value]
	}
	filteredSuggestions.value = []
	activeSuggestionIndex.value = -1
}

const validateIngredientName = () => {
	ingredientName.value = ingredientName.value.replace(/[^a-zA-Zа-яА-Я\s]/g, '')
}

const handleModalClick = (event: MouseEvent) => {
	const target = event.target as HTMLElement
	if (ingredientNameContainer.value && !ingredientNameContainer.value.contains(target)) {
		filteredSuggestions.value = []
		activeSuggestionIndex.value = -1
	}
}

const activeInputName = computed(() => tryToSave.value && !ingredientName.value)
const notEmptyIngredientName = computed(() => ingredientName.value.length !== 0)
const activeInputQuantity = computed(() => !props.isExclusionMode && tryToSave.value && !ingredientQuantity.value)
const notEmptyIngredientQuantity = computed(() => ingredientQuantity.value.length !== 0)

watch(ingredients, () => {
	if (store.currentRecipe) {
		store.currentRecipe.ingredients = ingredients.value.map(ingredient => ({
			name: ingredient.name,
			amount: props.isExclusionMode ? t('excluded') : `${ingredient.quantity} ${ingredient.type === QuantityType.WEIGHT ? 'г.' : 'шт.'}`
		}))
	}
}, { deep: true })

watch(showModal, (newVal) => {
	if (newVal) {
		setTimeout(() => {
			if (ingredientNameInput.value) {
				ingredientNameInput.value.focus()
			}
		}, 0)
	}
})
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