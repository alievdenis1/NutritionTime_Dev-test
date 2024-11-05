// entities/Profile/model/types.ts

export interface Profile {
 gender: string;
 age: number;
 weight: number;
 height: number;
 activity_level: string;
 activity_type: string;
 base_calories: number;
 target_calories: number;
 goal: string;
 bmr_formula: string;
 macro_proteins: number;
 macro_fats: number;
 macro_carbs: number;
 body_fat_percentage: number | null;
 ideal_weight: number | null;
 bmi: number | null;
 bmr: number | null;
 last_updated: string;
 diet_type: string;
 recommended_steps: number;
 water_intake: number;
 timezone: number;
}

export interface User {
 id: number;
 name: string;
 telegram_id: number;
 telegram_username: string | null;
 email: string;
 role: string;
 wallet_address: string;
 balance: string;
 created_at: string;
}

export interface ProfileResponse {
 user: User;
 profile: Profile;
}

export interface Meal {
 id: number;
 dish_name: string;
 weight: number;
 calories: number;
 proteins: number;
 fats: number;
 carbs: number;
 created_at: string;
}

export interface MealTotals {
 calories: number;
 proteins: number;
 fats: number;
 carbs: number;
 total_weight: number;
}

export interface MealDay {
 meals: Meal[];
 totals: MealTotals;
}

export interface MealsResponse {
 [date: string]: MealDay;
}

export interface MealStats {
 daily_averages: {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  weight: number;
  meals_count: number;
 };
 comparison_with_targets: {
  calories_target_diff: number;
  proteins_target_diff: number;
  fats_target_diff: number;
  carbs_target_diff: number;
 };
 daily_stats: Array<{
  date: string;
  total_calories: string;
  total_proteins: string;
  total_fats: string;
  total_carbs: string;
  total_weight: string;
  meals_count: number;
 }>;
}

export interface Payment {
 id: number;
 status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
 wallet_address: string;
 message_id: string | null;
 expires_at: string;
 completed_at: string | null;
 amount_ton: number;
 payment_comment: string;
 ton_transaction_hash: string | null;
 created_at: string;
 updated_at: string;
}

export interface Notification {
 id: number;
 type: string;
 scheduled_for: string;
 message_text: string;
 sent_at: string | null;
 created_at: string;
}
