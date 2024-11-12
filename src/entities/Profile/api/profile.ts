import useApi from '@/shared/lib/api/use-api'
import type { ProfileResponse, MealStats, Payment, Notification } from '../model'

interface GetMealsParams {
 start_date?: string;
 end_date?: string;
}

export function getProfile() {
 return useApi<ProfileResponse>('get', '/profile')
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