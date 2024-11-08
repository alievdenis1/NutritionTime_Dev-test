<template>
	<div
		class="flex justify-center items-center	 gap-[5px] text-gray-500 text-sm px-[8px] py-[5px] rounded-[20px] bg-[#1C1C1C0D]"
	>
		<IconTime />
		<span>{{ t('readyInValue', { count: props.value }) }}</span>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { IconTime } from '@/shared/components/Icon'

import Localization from './RecipeListItem.localization.json'
import { useTranslation } from 'shared/lib/i18n'

const { t } = useTranslation(Localization)

const props = defineProps<{ value: number }>()
</script>

<style scoped>

</style>