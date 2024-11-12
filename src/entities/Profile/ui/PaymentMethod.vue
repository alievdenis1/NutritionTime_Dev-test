<template>
	<div
		class="p-4 rounded-lg border cursor-pointer transition-all"
		:class="[
			selected
				? 'border-green-500 bg-green-900/50'
				: 'border-gray-700 hover:border-green-500/50'
		]"
		@click="$emit('select')"
	>
		<p class="text-center font-medium">
			{{ title }}
		</p>
	</div>
</template>

<script setup lang="ts">
 defineProps<{
  type: 'ton' | 'yummy' | 'gram'
  title: string
  selected: boolean
 }>()

 defineEmits<{
  (e: 'select'): void
 }>()
</script>