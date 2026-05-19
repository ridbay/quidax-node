export interface QuidaxResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface PaginatedResponse<T> extends QuidaxResponse<T[]> {
  meta: PaginationMeta;
}

export type Currency = 'btc' | 'ltc' | 'eth' | 'usdt' | 'xrp' | 'dash' | 'trx' | 'doge' | 'usdc' | 'ngn' | 'usd' | string;

export interface User {
  id: string;
  sn: string;
  email: string;
  reference: string;
  first_name: string;
  last_name: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  currency: Currency;
  balance: string;
  locked: string;
  staked: string;
  user: {
    id: string;
    sn: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PaymentAddress {
  id: string;
  reference: string;
  currency: Currency;
  address: string;
  destination_tag: string | null;
  total_payments: number;
  created_at: string;
  updated_at: string;
}
