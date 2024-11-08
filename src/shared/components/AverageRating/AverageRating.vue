<template>
	<!-- TODO: добавить высоту и ширину, проверить стили -->
	<!-- TODO: использовать эот компонент во всем проекте -->
	<div
		class="text-sm text-white w-[32px] h-[32px] rounded-[50%] bg-forestGreen flex items-center justify-center"
	>
		{{ props.value }}
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{ value: number }>()
</script>

<style scoped>

</style>