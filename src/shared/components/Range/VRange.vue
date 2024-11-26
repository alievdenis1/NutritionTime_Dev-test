<template>
	<div>
		<h3
			v-if="props.title"
			class="text-darkGray text-sm font-medium mb-[12px]"
		>
			{{ props.title }}
		</h3>
		<div class="flex gap-4 mb-[12px]">
			<div class="flex-1 relative">
				<span class="absolute top-[6px] left-[12px] text-xs text-gray">
					{{ t('from') }}
				</span>
				<input
					type="number"
					:value="props.value[0]"
					:min="props.min"
					:max="props.value[1]"
					:step="props.step"
					class="w-full h-[56px] pt-[26px] pb-[10px] pl-[12px] border rounded-md"
					@input="updateStartValue"
					@blur="handleBlurStart"
				>
				<span
					v-if="props.unit"
					class="absolute unit-position"
					:style="getUnitStyle(props.value[0])"
				>
					{{ props.unit }}
				</span>
			</div>
			<div class="flex-1 relative">
				<span class="absolute top-[6px] left-[12px] text-xs text-gray">
					{{ t('to') }}
				</span>
				<input
					type="number"
					:value="props.value[1]"
					:min="props.value[0]"
					:max="props.max"
					:step="props.step"
					class="w-full h-[56px] pt-[26px] pb-[10px] pl-[12px] border  rounded-md"
					@input="updateEndValue"
					@blur="handleBlurEnd"
				>
				<span
					v-if="props.unit"
					class="absolute unit-position"
					:style="getUnitStyle(props.value[1])"
				>
					{{ props.unit }}
				</span>
			</div>
		</div>
		<VSlider
			:model-value="props.value"
			:min="props.min"
			:max="props.max"
			:step="props.step"
			class="h-[28px]"
			@update:model-value="updateSlider"
		/>
	</div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { VSlider } from '@/shared/components/ui/slider'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './Range.localization.json'
import { getCorrectLengthValue } from './helpers'
import { Range } from './types'

const { t } = useTranslation(localization)

const props = defineProps<Range>()
const emit = defineEmits<{
	(event: 'onChange', value: [number, number]): void;
}>()

const updateStartValue = (event: Event) => {
    const target = (<HTMLInputElement>event.target)
    let value = target.value

    if (value === '') return

    if (props.maxLength) {
        value = getCorrectLengthValue(value, props.maxLength)
    }

    const start = Math.max(props.min, Math.min(Number(value), props.value[1]))

    emit('onChange', [start, props.value[1]])
}

const updateEndValue = (event: Event) => {
    const target = (<HTMLInputElement>event.target)
    let value = target.value

    if (value === '') return

    if (props.maxLength) {
        value = getCorrectLengthValue(value, props.maxLength)
    }

    const hasMaxRange = typeof props.max !== 'undefined'
    const rangeThreshold = hasMaxRange ? Math.min(Number(value), props.max) : Number(value)
    const end = Math.max(props.value[0], rangeThreshold)

    emit('onChange', [props.value[0], end])
}

const handleBlurStart = (event: Event) => {
    const target = (<HTMLInputElement>event.target)
    const value = target.value

    if (value === '') {
        emit('onChange', [props.min, props.value[1]])
    }
}

const handleBlurEnd = (event: Event) => {
    const target = (<HTMLInputElement>event.target)
    const value = target.value

    if (value === '') {
        emit('onChange', [props.value[0], props.value[0]])
    }
}

const updateSlider = (payload: number[] | undefined) => {
    payload && emit('onChange', [payload[0], payload[1]])
}

const getUnitStyle = (nutrientValue: number) => {
    const nutrientBlockPaddingLeft = 13
    let marginLeft = Number(String(nutrientValue).length) * 11

    if (marginLeft > 40) {
        marginLeft = marginLeft - 3
    }

    return {
        left: `${marginLeft + nutrientBlockPaddingLeft}px`
    }
}

</script>

<style scoped>
.border{
    border: 1px solid #319A6E33;
}

.unit-position {
    bottom: 7px;
    left: 50px;
}
</style>