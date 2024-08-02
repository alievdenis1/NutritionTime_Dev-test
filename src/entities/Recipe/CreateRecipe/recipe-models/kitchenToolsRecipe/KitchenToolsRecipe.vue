<template>
	<VAccordion :title="t('ingredientsTitle')">
		<div class="mt-[20px]">
			<p
				v-if="kitchenware.length === 0"
				class="text-gray text-xs mb-4"
			>
				{{ t('ingredientsDescription') }}
			</p>
			<div
				v-for="(item, index) in kitchenware"
				:key="index"
				class="flex items-center justify-between bg-lightGray px-[12px] py-[20px] rounded-[16px] mb-[16px]"
			>
				<span class="text-[12px]">{{ item.name }}</span>
				<div>
					<span class="text-[#535353] text-xs">
						{{ item.quantity }} {{ t('unitPieces') }}
					</span>
					<button
						class="text-forestGreen ml-[14px] cursor-pointer"
						@click="removeKitchenware(index)"
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
						<span
							v-if="kitchenwareName.length > 0"
							class="absolute text-[12px] top-[6px] left-[12px] text-gray"
						>
							{{ t('ingredientPlaceholderName') }}
						</span>
						<input
							ref="kitchenwareNameInput"
							v-model="kitchenwareName"
							type="text"
							:placeholder="t('ingredientPlaceholderName')"
							class="border rounded px-[12px] py-4 text-base w-full h-[54px]"
							:class="{ activeInput: activeInputName, filledInput: notEmptyKitchenwareName, 'pt-[26px]': notEmptyKitchenwareName }"
						>
					</div>
					<div class="text-gray mb-4">
						{{ t('forExampleBlender') }}
					</div>
					<div class="relative">
						<span
							v-if="kitchenwareQuantity.length > 0"
							class="absolute text-[12px] top-[6px] left-[12px] text-gray"
						>
							{{ t('ingredientPlaceholderQuantity') }}
						</span>
						<input
							v-model="kitchenwareQuantity"
							type="text"
							:placeholder="t('ingredientPlaceholderQuantity')"
							class="border rounded px-[12px] py-4 text-base w-full mb-4 h-[54px]"
							:class="{ activeInput: activeInputQuantity, filledInput: notEmptyKitchenwareQuantity, 'pt-[26px]': notEmptyKitchenwareQuantity }"
							@input="filterNumericInput"
						>
					</div>

					<button
						class="bg-forestGreen text-white rounded-[16px] py-2 px-4 w-[100%] text-center"
						@click="addKitchenware"
					>
						{{ t('saveIngredientButton') }}
					</button>
				</div>
			</VModal>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { VAccordion } from '@/shared/components/Accordion'
import { VModal } from '@/shared/components/Modal'
import { IconClose, IconPlus } from 'shared/components/Icon'
import localization from './KitchenToolsRecipe.localization.json'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'
import { useRoute } from 'vue-router'

const { t } = useTranslation(localization)
const store = useRecipeStore()
const route = useRoute()

const showModal = ref(false)
const kitchenwareName = ref<string>('')
const kitchenwareQuantity = ref<string>('')
const tryToSave = ref(false)
const kitchenware = ref<{ name: string, quantity: string }[]>([])
const kitchenwareNameInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
	const recipeId = route.params.id as string
	const currentRecipe = store.recipes.find(recipe => recipe.id === recipeId)
	if (currentRecipe && currentRecipe.kitchenware) {
		kitchenware.value = currentRecipe.kitchenware.map(item => ({
			name: item,
			quantity: '1' // По умолчанию устанавливаем количество 1, так как в исходных данных нет информации о количестве
		}))
	}
})

const openModal = () => {
	showModal.value = true
}

const addKitchenware = () => {
	tryToSave.value = true
	if (kitchenwareName.value && kitchenwareQuantity.value) {
		kitchenware.value.push({
			name: kitchenwareName.value,
			quantity: kitchenwareQuantity.value
		})
		updateKitchenware()
		closeModal()
	}
}

const removeKitchenware = (index: number) => {
	kitchenware.value.splice(index, 1)
	updateKitchenware()
}

const closeModal = () => {
	showModal.value = false
	kitchenwareName.value = ''
	kitchenwareQuantity.value = ''
	tryToSave.value = false
}

const filterNumericInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	target.value = target.value.replace(/\D/g, '')
	kitchenwareQuantity.value = target.value
}

const updateKitchenware = () => {
	const recipeId = route.params.id as string
	const currentRecipe = store.recipes.find(recipe => recipe.id === recipeId)
	if (currentRecipe) {
		currentRecipe.kitchenware = kitchenware.value.map(item => item.name)
	}
}

const activeInputName = computed(() => tryToSave.value && !kitchenwareName.value)
const notEmptyKitchenwareName = computed(() => kitchenwareName.value.length !== 0)
const activeInputQuantity = computed(() => tryToSave.value && !kitchenwareQuantity.value)
const notEmptyKitchenwareQuantity = computed(() => kitchenwareQuantity.value.length !== 0)

watch(showModal, (newVal) => {
	if (newVal) {
		nextTick(() => {
			if (kitchenwareNameInput.value) {
				kitchenwareNameInput.value.focus()
			}
		})
	}
})

watch(kitchenware, () => {
	updateKitchenware()
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
</style>