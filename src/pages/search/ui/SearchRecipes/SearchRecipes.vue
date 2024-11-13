<template>
	<div
		id="search"
		class="p-[16px]"
	>
		<!-- <search-widget v-show="isLoading" /> -->
		<!-- <VSkeletonCard v-show="!isLoading" /> -->
		<SearchControls />
		<RecipeList />
	</div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import { useFilterStore } from '@/features/Search/filter'

import { RecipeList } from './RecipeList'
import { SearchControls } from './SearchControls'

// TODO: возможно завести две сторы - для списка найденных рецептов и фильтра, и для вспомогательных списков (кухни, теги, диеты и тд)
// Начнем формировать страницу от pages, а по ходу дела будем выносить в widgets

// Возможно элементы поиска с функционалом оставить в Widgets/Search/ui, так как они будут использоваться только тут.
// В feature как будто нет смысла их выносить, так как эти элементы нигде больше использоваться не будут

// Стору(ы) и весь функционал делаем в feature/Search

// Разделяем всё на контейнеры, каждый контейнер запрашивает нужные для него данные используя стору
// Лоадер/скелетон у всех локальный
// Контейнер включает в себя логику и презентационный UI компонент, в который передаются хэндлеры

// Для лёгких и не сильно вложенных страниц можно использовать просто стейт
// Тут у нас логика сохраняется на разных страницах - поэтому стора

/*
/ searchedRecipeList
/ filter
*/

// В feature храним стору с бизнес логикой
// А UI раскидаем по widgets, там будем прикручивать логику из feature
// Хочется, чтобы UI поиска лежал рядом
// Если часть будет в feature, а часть в Widgets/Pages, то можно будет запутаться + стора будет использоваться в разных местах

const filterStore = useFilterStore()

const route = useRoute()

onUnmounted(() => {
	// TODO: заменить на корректный адрес
	if (route.path !== '/filter/test') {
		filterStore.resetSearchedRecipeList()
		filterStore.resetFilter()
	}
})
</script>

<style scoped>

</style>