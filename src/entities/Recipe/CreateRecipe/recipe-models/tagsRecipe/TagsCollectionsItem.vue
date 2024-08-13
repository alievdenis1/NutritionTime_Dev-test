<template>
	<div>
		<div
			v-for="(category, index) in categoriesTags"
			:key="index"
			class="mb-5"
		>
			<h3 class="mb-3.5 text-lg">
				{{ category.name }}
			</h3>
			<div class="grid grid-cols-3 gap-2 px-2">
				<button
					v-for="tag in category.tags"
					:key="tag"
					:class="['py-2 px-3 border text-xs rounded-full cursor-pointer w-fit col-span-1 flex justify-start items-center gap-3', { 'bg-forestGreen text-white': hasTag(tag), 'bg-lightGray': !hasTag(tag) }]"
					@click="toggleTag(tag)"
				>
					{{ tag }}

					<IconClose
						v-if="hasTag(tag)"
						icon-color="#FFFFFF"
						class="w-4 h-4"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { IconClose } from 'shared/components/Icon'

interface Category {
	name: string;
	tags: string[];
}

const props = defineProps<{
	categoriesTags: Category[];
	modalSelectedTags: string[];
}>()

const emit = defineEmits<{
	(event: 'tagChanged', tags: string[]): void;
}>()

const { categoriesTags } = toRefs(props)
const selectedTags = ref<string[]>([...props.modalSelectedTags])

watch(() => props.modalSelectedTags, (newTags) => {
	selectedTags.value = [...newTags]
})

const toggleTag = (tag: string) => {
	if (selectedTags.value.length === 20) return

	const index = selectedTags.value.indexOf(tag)
	if (index > -1) {
		selectedTags.value.splice(index, 1)
	} else {
		selectedTags.value.push(tag)
	}
	emit('tagChanged', selectedTags.value)
}

const hasTag = (tag: string): boolean => selectedTags.value.includes(tag)
</script>

<style scoped></style>