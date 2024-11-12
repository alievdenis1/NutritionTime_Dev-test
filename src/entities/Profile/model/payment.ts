export interface SubscriptionPayment {
 id: number;
 telegram_id: number;
 status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
 wallet_address: string | null;
 message_id: number | null;
 expires_at: string;
 ton_transaction_hash: string | null;
 completed_at: string | null;
 amount_ton: string;
 payment_comment: string | null;
 payment_type: 'ton' | 'yummy' | 'gram';
 amount_rub: string;
 payment_status: string;
 created_at: string;
 updated_at: string;
}

export interface CreatePaymentRequest {
 telegram_id: number;
 payment_type: 'ton' | 'yummy' | 'gram';
 months: number;
}

export interface CreatePaymentResponse {
 paymentUrl: string;
 payment_id: number;
}