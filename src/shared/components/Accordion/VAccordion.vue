<template>
	<div class="accordion">
		<button
			class="accordion-header"
			@click="toggle"
		>
			{{ props.title }}
			<IconArrow
				:class="{ 'rotate-180': isOpen }"
				icon-color="#000000"
				:icon-width="20"
				:icon-height="20"
			/>
		</button>
		<div
			ref="content"
			class="accordion-content"
			:style="contentStyle"
		>
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUpdated } from 'vue'
import { IconArrow } from 'shared/components/Icon'

interface VAccordionProps {
	title: string;
	openByDefault?: boolean;
}

const props = withDefaults(
	defineProps<VAccordionProps>(), {
		openByDefault: false
	}
)

const isOpen = ref(props.openByDefault || false)
const content = ref<HTMLElement | null>(null)

const contentScrollHeight = computed((): string => content.value?.scrollHeight ? `${content.value?.scrollHeight}px` : 'auto')

const contentStyle = computed(() => ({
	maxHeight: isOpen.value ? contentScrollHeight.value : '0',
}))

const toggle = () => {
	isOpen.value = !isOpen.value
}

const updateHeight = () => {
	if (isOpen.value && content.value) {
		content.value.style.maxHeight = contentScrollHeight.value
	}
}

onMounted(updateHeight)
onUpdated(updateHeight)

watch(isOpen, (newVal) => {
	if (newVal || isOpen.value) {
		content.value?.style.setProperty('max-height', content.value?.scrollHeight ? `${content.value?.scrollHeight}px` : 'auto')
	} else {
		content.value?.style.setProperty('max-height', '0')
	}
})
</script>

<style scoped>
.accordion {
	border: 1px solid #1C1C1C0D;
	border-radius: 16px;
	padding: 20px 16px;
}

.accordion-header {
	font-size: 18px;
	line-height: 24px;
	cursor: pointer;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.accordion-content {
	overflow: hidden;
	transition: max-height 0.3s ease;
}

.rotate-180 {
	transform: rotate(180deg);
}
</style>