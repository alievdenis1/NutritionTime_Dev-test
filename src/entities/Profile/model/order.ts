// types/payment.ts
export const PAYMENT_METHODS = {
 TON: 'ton',
 YUMMY: 'yummy',
 GRAM: 'gram'
} as const

export type PaymentMethodType = keyof typeof PAYMENT_METHODS;

export interface PaymentMethod {
 type: 'ton' | 'jetton';
 symbol: PaymentMethodType;
 decimals: number;
 address?: string;
 displayName: string;
}

export const AVAILABLE_PAYMENT_METHODS: PaymentMethod[] = [
 {
  type: 'ton',
  symbol: 'TON',
  decimals: 9,
  displayName: 'Toncoin'
 },
 {
  type: 'jetton',
  symbol: 'YUMMY',
  decimals: 9,
  address: 'EQDD6Zc-8iF5Vk2syf7Q9mEQFmtTdsH8IIS4ffB99d-PGKga',
  displayName: 'Yummy Token'
 },
 {
  type: 'jetton',
  symbol: 'GRAM',
  decimals: 9,
  address: 'EQC47093oX5Xhb0xuk2lCr2RhS8rj-vul61u4W2UH5ORmG_O',
  displayName: 'Gram Token'
 }
]

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
