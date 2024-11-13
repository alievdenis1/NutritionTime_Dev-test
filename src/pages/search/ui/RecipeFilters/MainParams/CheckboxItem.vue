<template>
	<!-- TODO: создать в UI компонент Checkbox и переделать реализацию переключения checkbox -->
	<div
		class="flex items-center mb-3 cursor-pointer"
		@click="emit('changeCheckbox', !props.value, props.id)"
	>
		<div class="w-5 h-5 border-2 rounded-sm mr-2 flex items-center justify-center border">
			<IconCheck
				v-if="props.value"
				class="text-white w-4 h-4"
				icon-color="#319A6E"
			/>
		</div>
		<span>{{ props.name }}</span>
	</div>
</template>

<script setup lang="ts">
import { IconCheck } from '@/shared/components/Icon'

const props = defineProps<{
    id: number;
    name: string;
    value: boolean;
}>()

const emit = defineEmits<{
	(event: 'changeCheckbox', value: boolean, id: number): void;
}>()
</script>

<style lang="scss">
.border {
    border: 1px solid #E1E1E1;
}
.border-slide {
    border: 1px solid #319A6E33;
    border-radius: 4px;
}
</style>