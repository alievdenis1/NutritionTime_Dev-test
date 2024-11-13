import { RouteRecordRaw } from 'vue-router'
import { MainLayout, DefaultLayout } from 'app/layouts'

export default [
	{
		name: 'search',
		component: () => import('pages/search/SearchPage.vue'),
		path: '/search',
		meta: {
			title: 'Search',
			layout: MainLayout
		}
	},
	{
		name: 'filter',
		component: () => import('pages/search/FilterRecipe.vue'),
		path: '/filter',
		meta: {
			title: 'Editing Recipe',
			layout: DefaultLayout,
			backButton: true,
		}
	},
	{
		// TODO: не забыть удалить старые роуты
		name: 'searchTest',
		component: () => import('pages/search/ui/SearchRecipes/SearchRecipes.vue'),
		path: '/search/test',
		meta: {
			title: 'Search',
			layout: MainLayout
		}
	},
	{
		name: 'filterTest',
		component: () => import('pages/search/ui/RecipeFilters/RecipeFilters.vue'),
		path: '/filter/test',
		meta: {
			title: 'Filter',
			layout: DefaultLayout,
			backButton: true,
		}
	}
] as RouteRecordRaw[]