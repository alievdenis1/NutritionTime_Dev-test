<!-- components/PaymentMethod.vue -->
<template>
	<div
		class="p-4 rounded-lg border transition-all cursor-pointer"
		:class="[
			selected
				? 'border-green-500 bg-green-900/50'
				: 'border-gray-700 hover:border-green-500/50'
		]"
		@click="$emit('select')"
	>
		<div class="flex items-center space-x-3">
			<div class="flex-shrink-0">
				<img
					:src="getIcon"
					:alt="title"
					class="w-8 h-8"
				>
			</div>
			<div>
				<h3 class="font-medium">
					{{ title }}
				</h3>
				<p
					v-if="description"
					class="text-sm text-gray-400"
				>
					{{ description }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
 import { computed } from 'vue'
 import type { PaymentType } from '../model'

 const props = defineProps<{
  type: PaymentType
  title: string
  description?: string
  selected: boolean
 }>()

 const getIcon = computed(() => {
  const icons = {
   ton: 'https://digiseller.mycdn.ink/preview/1078014/p1_3437301_b9cb6087.png',
   usdt: 'https://digiseller.mycdn.ink/preview/1078014/p1_3437301_b9cb6087.png',
   yummy: 'https://digiseller.mycdn.ink/preview/1078014/p1_3437301_b9cb6087.png',
   gram: 'https://digiseller.mycdn.ink/preview/1078014/p1_3437301_b9cb6087.png'
  }
  return icons[props.type]
 })

 defineEmits<{
  (e: 'select'): void
 }>()
</script>