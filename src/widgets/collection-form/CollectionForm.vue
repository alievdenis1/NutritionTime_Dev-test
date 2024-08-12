<template>
	<form class="h-auto">
		<p class="text-[#1c1c1c] mt-2.5 text-title font-medium">
			{{ title }}
		</p>

		<p
			v-if="isTypeCreate"
			class="mt-4 text-description font-normal text-[#535353] break-words"
		>
			{{ t('creationDescription') }}
			<span class="w-auto h-auto">
				<IconFavorites
					class="form__icon w-4 h-4 inline align-middle"
					icon-color="#9F9FA0"
				/>
			</span>
		</p>

		<VInput
			v-model:value="collectionTitle"
			:title="t('placeholder')"
			class="mt-6"
		/>

		<VButton
			class="mt-7"
			@click="onClick"
		>
			<p>{{ buttonText }}</p>
		</VButton>
	</form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CollectionFormType } from 'features/collection-form'
import { VInput } from 'shared/components/Input'
import { VButton } from 'shared/components/Button'
import { IconFavorites } from 'shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'

import Localization from './CollectionForm.localization.json'

type CollectionFormEmit = {
    save: [value: void];
    create: [value: void];
}
interface CollectionFormProps {
    type: CollectionFormType
}

const props = defineProps<CollectionFormProps>()
const emits = defineEmits<CollectionFormEmit>()

const { t } = useTranslation(Localization)
const collectionTitle = ref('')

const isTypeCreate = computed((): boolean => props.type === 'create')

const title = computed(() => isTypeCreate.value ? t('collectionCreation') : t('collectionEditing'))
const buttonText = computed(() => isTypeCreate.value ? t('create') : t('save'))

const onClick = (): void => {
    isTypeCreate.value ? emits('create') : emits('save')
}
</script>