export interface PaymentMethod {
 type: 'ton' | 'jetton';
 symbol: string;
 decimals: number;
 address?: string;
}

export interface PreparedPayment {
 payment_id: number;
 order_id: number;
 payment_address: string;
 crypto_amount: number;
 payment_method: PaymentMethod;
}

export type PaymentStatus = 'pending' | 'completed' | 'canceled';

export interface Payment {
 id: number;
 order_id: number;
 amount: number;
 crypto_amount: number;
 payment_method: string;
 status: PaymentStatus;
 transaction_id?: string;
 payment_address: string;
 created_at: string;
 updated_at: string;
}

export type OrderStatus = 'created' | 'pending' | 'accepted' | 'delivery' | 'delivered' | 'canceled';

export interface Order {
 id: number;
 user_id: number;
 status: OrderStatus;
 payment_method?: string;
 created_at: string;
 updated_at: string;
 price: number;
 payment?: Payment;
}
