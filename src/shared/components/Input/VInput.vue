<template>
	<div class="wrapper">
		<p
			class="title"
			:class="titleClasses"
			@click="setFocus(true)"
		>
			{{ props.title }}
		</p>

		<input
			v-if="!textarea"
			v-bind="$attrs"
			v-model="inputValue"
			:value="inputValue"
			:disabled="props.disabled"
			:class="[errorClasses, focusedInputClasses]"
			@input="onInput"
			@focusin="setFocus(true)"
			@focusout="setFocus(false)"
		>
		<textarea
			v-else
			ref="textareaRef"
			v-bind="$attrs"
			v-model="inputValue"
			:value="inputValue"
			:disabled="disabled"
			:class="[errorClasses, focusedInputClasses]"
			@input="onInput"
			@focusin="setFocus(true)"
			@focusout="setFocus(false)"
			@scroll="onScroll"
		/>

		<p
			v-if="hasError"
			class="text-coralRed font-medium text-xs inline-block absolute top-full left-0 ring-0 text-left mt-1"
		>
			{{ props.errorMessage }}
		</p>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export type InputEmits = {
    'update:value': [string]
    'update:error': [boolean]
}
export interface InputProps {
    value: string;
    title: string;
    required?: boolean;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    textarea?: boolean;
}

const props = defineProps<InputProps>()
const emits = defineEmits<InputEmits>()

const inputValue = ref<string>(props.value)
const isFocused = ref<boolean>(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const titleClasses = ref<string>('')

const hasError = computed((): boolean => props.error && !!props.errorMessage)
const errorClasses = computed((): string =>
    hasError.value ? 'error' : ''
)
const focusedInputClasses = computed((): string =>
    inputValue.value.length ? 'focused' : ''
)

const onInput = (): void => {
    emits('update:value', inputValue.value)
}
const setFocus = (value: boolean): void => {
    isFocused.value = value
}
const onScroll = (): void => {
    if (!textareaRef.value) return

    const scrollTop = textareaRef.value.scrollTop
    if (scrollTop >= 8) titleClasses.value = 'hidden'
    if (scrollTop < 8) titleClasses.value = ''
}
</script>

<style lang="scss" scoped>
.wrapper {
    @apply relative w-full h-14;

    &:has(textarea) {
        @apply h-auto;
    }

    &:has(input:focus), &:has(textarea:focus), &:has(input.focused), &:has(textarea.focused) {
        .title {
            @apply text-xs top-1.5;
        }

        .focused {
            @apply border-[#319A6E33] pt-[26px] py-3 pb-[10px];
        }
    }

    & .title {
        @apply flex absolute text-[#9F9FA0] font-normal top-[18px] bottom-[18px] left-3 right-3 text-description transition-[150ms] z-10 h-fit w-fit;
    }

    input, textarea {
        @apply mt-0 border border-[#E1E1E1] py-1.5 px-3 border-solid rounded h-full w-full outline-none relative font-normal text-description text-[#1c1c1c];

        &:focus {
            @apply border-[#319A6E33] pt-[26px] py-3 pb-[10px];
        }
    }

    textarea {
        @apply min-h-[122px];
        resize: none;

        &:focus {
            @apply pt-[32px] py-3 pb-[10px];
        }
    }

    .hidden {
        @apply opacity-0;
    }

    .error {
        @apply border-[#F04F4F] !important;
    }
}
</style>