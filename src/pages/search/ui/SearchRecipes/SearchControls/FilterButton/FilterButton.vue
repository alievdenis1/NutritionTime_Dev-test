<template>
	<button
		class="w-[48px] h-[44px] flex items-center justify-center bg-forestGreen text-white rounded-[8px] hover:bg-tealGreen transition-colors duration-200"
		@click="openFilters"
	>
		<IconFilter :icon-color="'#FFFFFF'" />
	</button>
</template>

<script setup lang="ts">
import { IconFilter } from '@/shared/components/Icon'
import { useRouter } from 'vue-router'

const router = useRouter()

const openFilters = () => {
	// TODO: заменить
	// Возможно урлы вынести в общие константы в shared
	router.push('/filter/test')
}
</script>

<style scoped>
</style>