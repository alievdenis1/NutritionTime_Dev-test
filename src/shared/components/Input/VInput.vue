<template>
	<div class="wrapper">
		<p
			class="wrapper__title"
		>
			{{ props.title }}
		</p>

		<input
			v-bind="$attrs"
			v-model="inputValue"
			:value="inputValue"
			:disabled="props.disabled"
			:class="[errorClasses, focusedInputClasses]"
			@input="onInput"
			@focusin="setFocus(true)"
			@focusout="setFocus(false)"
		>

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
}

const props = defineProps<InputProps>()
const emits = defineEmits<InputEmits>()

const inputValue = ref<string>(props.value)
const isFocused = ref<boolean>(false)

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
</script>

<style lang="scss" scoped>
.wrapper {
    @apply relative w-full h-14;

    &:has(input:focus), &:has(input.focused) {
        .wrapper__title {
            @apply text-xs top-1.5;
        }

        .focused {
            @apply border-[#319A6E33] pt-[26px] py-3 pb-[10px];
        }
    }

    &__title {
        @apply flex absolute text-[#9F9FA0] font-normal top-[18px] bottom-[18px] left-3 right-3 text-description transition-[150ms];
    }

    input {
        @apply mt-0 border border-[#E1E1E1] py-1.5 px-3 border-solid rounded h-full w-full outline-none relative font-normal text-description text-[#1c1c1c];

        &:focus {
            @apply border-[#319A6E33] pt-[26px] py-3 pb-[10px];
        }
    }

    .error {
        @apply border-[#F04F4F] !important;
    }
}
</style>