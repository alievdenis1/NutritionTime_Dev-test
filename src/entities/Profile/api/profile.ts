import useApi from '@/shared/lib/api/use-api'
import type { Profile, Meal, MealStats, Payment, Notification } from '../model'

interface GetMealsParams {
 start_date?: string;
 end_date?: string;
}

export function getProfile() {
 return useApi<Profile>('get', '/profile')
}

export function getMeals(params?: GetMealsParams) {
 return useApi<Meal[]>('get', '/meals', params)
}

export function getMealStats(params?: GetMealsParams) {
 return useApi<MealStats>('get', '/meals/stats', params)
}

export function getPayments() {
 return useApi<Payment[]>('get', '/payments')
}

export function getNotifications() {
 return useApi<Notification[]>('get', '/notifications')
}