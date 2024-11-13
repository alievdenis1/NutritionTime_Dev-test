<template>
	<div>
		<div
			v-for="([categoryName, tags], index) in Object.entries(props.categoriesTags)"
			:key="index"
			class="mb-5"
		>
			<h3 class="mb-3.5 text-lg">
				{{ categoryName }}
			</h3>
			<div>
				<div class="tag-grid">
					<div
						v-for="tag in tags"
						:key="tag.id"
						class="tag-row mb-[10px] overflow-x-auto"
					>
						<button
							:class="[hasTag(tag.id) ? 'bg-forestGreen text-white' : 'bg-lightGray']"
							class="tag-button"
							@click="selectTag(tag.id)"
						>
							<span class="tag-text">{{ tag.name }}</span>
							<span
								v-if="hasTag(tag.id)"
								class="tag-close"
								@click.stop="resetTag(tag.id)"
							>
								<IconClose
									icon-color="#FFFFFF"
									class="w-[12px] h-[12px]"
								/>
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IconClose } from '@/shared/components/Icon'

import { TagsByCategory } from '@/features/Search/filter'

const props = defineProps<{
	categoriesTags: TagsByCategory;
	activeTags: number[];
}>()

const emit = defineEmits<{
	(event: 'selectTag', tagId: number): void;
	(event: 'resetTag', tagId: number): void;
}>()

const selectTag = (tagId: number) => {
	emit('selectTag', tagId)
}

const resetTag = (tagId: number) => {
	emit('resetTag', tagId)
}

const hasTag = (tagId: number) => props.activeTags.includes(tagId)
</script>

<style scoped>
.tag-grid {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	gap: 8px;
}

.tag-row {
	display: flex;
	justify-content: center;
	align-items: center;
}

.tag-row.has-active-tag {
	justify-content: flex-start;
}

.tag-wrapper {
	min-width: 0;
}

.tag-button {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 12px;
	border-radius: 9999px;
	border: 1px solid #E1E1E1;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.3s ease;
	white-space: nowrap;
}

.tag-text {
	flex-grow: 1;
	overflow: hidden;
	text-overflow: ellipsis;
}

.tag-close {
	flex-shrink: 0;
	margin-left: 8px;
}

.bg-forestGreen {
	background-color: #319A6E;
}

.bg-lightGray {
	background-color: #F3F3F3;
}

.custom-scrollbar {
	overflow-x: auto;
	scrollbar-width: thin;
	scrollbar-color: #319A6E #e0e0e0;
}

.custom-scrollbar::-webkit-scrollbar {
	height: 4px;
	background-color: #e0e0e0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background-color: #319A6E;
	border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	height: 8px;
	background-color: #24664f;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background-color: #e0e0e0;
}
</style>