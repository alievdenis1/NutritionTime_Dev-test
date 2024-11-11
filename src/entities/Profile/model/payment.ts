// types/payment.ts
export const PAYMENT_METHODS = {
 TON: 'TON',
 YUMMY: 'YUMMY',
 GRAM: 'GRAM'
} as const

export type PaymentMethodType = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];
export type PaymentProcessingStatus = 'idle' | 'preparing' | 'checking' | 'completed' | 'failed';
export type PaymentStatus = 'pending' | 'completed' | 'canceled' | 'error';

export interface PaymentStatusResponse {
 status: PaymentStatus;
 message?: string;
}

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
  symbol: PAYMENT_METHODS.TON,
  decimals: 9,
  displayName: 'Toncoin'
 },
 {
  type: 'jetton',
  symbol: PAYMENT_METHODS.YUMMY,
  decimals: 9,
  address: 'EQDD6Zc-8iF5Vk2syf7Q9mEQFmtTdsH8IIS4ffB99d-PGKga',
  displayName: 'Yummy Token'
 },
 {
  type: 'jetton',
  symbol: PAYMENT_METHODS.GRAM,
  decimals: 9,
  address: 'EQC47093oX5Xhb0xuk2lCr2RhS8rj-vul61u4W2UH5ORmG_O',
  displayName: 'Gram Token'
 }
]

export interface PreparedPayment {
 payment_id: number;
 wallet_address: string; // было payment_address
 amount_ton: number;    // было crypto_amount
 payment_comment: string; // новое поле
 expires_at: string;    // новое поле
}

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

