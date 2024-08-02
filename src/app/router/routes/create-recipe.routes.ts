import { RouteRecordRaw } from 'vue-router'
import { MainLayout, DefaultLayout } from 'app/layouts'

export default [
	{
		name: 'create-recipe',
		component: () => import('pages/create-recipe/CreateRecipe.vue'),
		path: '/create-recipe',
		meta: {
			title: 'Create Recipe',
			layout: MainLayout
		}
	},
	{
		name: 'check-recipe',
		component: () => import('pages/create-recipe/CheckRecipe.vue'),
		path: '/check-recipe',
		meta: {
			title: 'Check Recipe',
			layout: MainLayout
		}
	},
	{
		name: 'tag-recipe',
		component: () => import('pages/create-recipe/TagSelectionRecipe.vue'),
		path: '/tag-recipe',
		// meta: {
		// 	title: 'Tags Recipe',
		// 	layout: MainLayout
		// }
	},
	{
		name: 'select-recipe',
		component: () => import('pages/create-recipe/SelectRecipeRecipe.vue'),
		path: '/select-recipe',
		meta: {
			title: 'Select Recipe',
			layout: MainLayout
		}
	},
	{
		name: 'ideas-recipe',
		component: () => import('pages/create-recipe/ReadyIdeasRecipe.vue'),
		path: '/ideas-recipe',
		meta: {
			title: 'Select Recipe',
			layout: MainLayout
		}
	},
	{
		name: 'ingredient-recipe',
		component: () => import('pages/create-recipe/CreateIngredientRecipe.vue'),
		path: '/ingredient-recipe',
		meta: {
			title: 'Select Recipe',
			layout: MainLayout
		}
	},
	{
		name: 'details-recipe',
		component: () => import('pages/create-recipe/CardRecipe.vue'),
		path: '/recipe/:id',
		meta: {
			title: 'Card Recipe',
			layout: DefaultLayout
		}
	},
	{
		name: 'all-comment',
		component: () => import('pages/create-recipe/AllComment.vue'),
		path: '/all-comment/:id',
		meta: {
			title: 'All Comment',
			layout: MainLayout
		}
	},
	{
		name: 'recipe-edit',
		component: () => import('pages/create-recipe/EditingRecipe.vue'),
		path: '/recipe/:id/edit',
		meta: {
			title: 'Editing Recipe',
			layout: DefaultLayout
		}
	},
] as RouteRecordRaw[]