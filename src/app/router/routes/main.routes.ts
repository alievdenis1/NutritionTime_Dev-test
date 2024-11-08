import { RouteRecordRaw } from 'vue-router'
import { MainLayout } from 'app/layouts'

export default [
	{
		name: 'main',
		component: () => import('pages/main/MainPage.vue'),
		// component: () => import('pages/wallet/UserWallet.vue'), // Важно: динасический импорт, чтобы код работал в production при build
		path: '/',
		meta: {
			title: 'NutritionTime',
			layout: MainLayout
		}
	},
	{
		// TODO: поменять страницы после рефакторинга, старую страницу удалить
		name: 'mainTest',
		component: () => import('pages/main/ui/MainPage.vue'),
		// component: () => import('pages/wallet/UserWallet.vue'), // Важно: динасический импорт, чтобы код работал в production при build
		path: '/test',
		meta: {
			title: 'NutritionTime',
			layout: MainLayout
		}
	}
] as RouteRecordRaw[]
