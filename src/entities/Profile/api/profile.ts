import useApi from '@/shared/lib/api/use-api'
import type { ProfileResponse, MealsResponse, MealStats, Payment, Notification } from '../model'

interface GetMealsParams {
 start_date?: string;
 end_date?: string;
}

export function getProfile() {
 return useApi<ProfileResponse>('get', '/profile')
}

export function getMeals(params?: GetMealsParams) {
 return useApi<MealsResponse>('get', '/meals', params)
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