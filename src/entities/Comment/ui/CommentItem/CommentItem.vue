<template>
	<div class="rounded-lg flex flex-col gap-[12px]">
		<div class="flex items-center">
			<img
				v-if="props.authorImage"
				:src="props.authorImage"
				:alt="props.authorName"
				class="w-8 h-8 rounded-full mr-2"
			>
			<span class="font-xs text-slateGray">{{ props.authorName }}</span>
		</div>
		<p class="text-darkGray">
			{{ props.text }}
		</p>
		<!-- TODO: проверить корректность списка фотографий -->
		<div class="flex flex-col gap-[12px]">
			<img
				v-for="image in props.images"
				:key="image.id"
				:src="image.image_path"
				alt="image to comment"
				class="w-full h-auto object-cover aspect-video rounded-lg"
			>
		</div>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { Image } from '../../model'

const props = defineProps<{
    authorName: string,
    authorImage?: string;
    text: string,
    images?: Image[],
}>()

</script>

<style scoped>
</style>

