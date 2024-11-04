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
}

export interface Meal {
 id: number;
 dish_name: string;
 weight: number;
 calories: number;
 proteins: number;
 fats: number;
 carbs: number;
 date_added: string;
}

export interface MealStats {
 total_calories: number;
 total_proteins: number;
 total_fats: number;
 total_carbs: number;
 avg_calories_per_day: number;
 avg_proteins_per_day: number;
 avg_fats_per_day: number;
 avg_carbs_per_day: number;
}

export interface Payment {
 id: number;
 status: 'completed' | 'pending';
 wallet_address: string;
 message_id: string;
 expires_at: string;
 completed_at: string | null;
 amount_ton: number;
 payment_comment: string;
}

export interface Notification {
 id: number;
 type: string;
 scheduled_for: string;
 message_text: string;
 sent_at: string;
}