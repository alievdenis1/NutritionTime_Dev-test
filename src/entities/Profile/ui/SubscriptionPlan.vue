<template>
	<div
		class="p-6 rounded-lg shadow-sm transition-all"
		:class="[
			selected
				? 'border-green-500 bg-green-900/50'
				: 'border-gray-700 hover:border-green-500/50'
		]"
	>
		<div class="flex justify-between">
			<h3 class="text-xl font-bold mb-2">
				{{ months }} месяц{{ declension }}
			</h3>
			<p class="text-xl mb-4">
				{{ price }} ₽
			</p>
		</div>

		<ul
			v-if="features.length > 0"
			class="space-y-2"
		>
			<li
				v-for="feature in features"
				:key="feature"
				class="flex items-center text-sm"
			>
				<svg
					class="w-4 h-4 mr-2 text-green-500"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
				{{ feature }}
			</li>
		</ul>
		<VButton
			class="mt-4 w-full"
			variant="outline"
			:class="{ 'bg-green-700': selected }"
			@click="$emit('select')"
		>
			{{ selected ? 'Выбрано' : 'Выбрать' }}
		</VButton>
	</div>
</template>

<script setup lang="ts">
 import { computed } from 'vue'
 import { VButton } from '@/shared/components/Button'

 const props = defineProps<{
  months: number
  price: number
  features: string[]
  selected: boolean
 }>()

 const declension = computed(() => {
  if (props.months === 1) return ''
  return props.months < 5 ? 'а' : 'ев'
 })

 defineEmits<{
  (e: 'select'): void
 }>()
</script>