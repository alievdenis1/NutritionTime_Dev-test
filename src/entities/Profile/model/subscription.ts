// Добавить новые
export interface SubscriptionPeriod {
 months: 1 | 3;
 price_rub: number;
}

export const SUBSCRIPTION_PERIODS: SubscriptionPeriod[] = [
 { months: 1, price_rub: 490 },  // $4.9
 { months: 3, price_rub: 990 }   // $9.9
]

export interface UserSubscription {
 telegram_id: number;
 subscription_status: 'active' | 'inactive' | 'trial' | 'expired';
 subscription_ends_at: string | null;
 trial_ends_at: string | null;
}