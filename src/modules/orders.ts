import { BaseClient } from '../client';
import { QuidaxResponse, PaginatedResponse } from '../types';

export interface Order {
  id: string;
  market: string;
  side: 'buy' | 'sell';
  ord_type: 'limit' | 'market';
  price: string;
  avg_price: string;
  state: string;
  market_price: string;
  created_at: string;
  volume: string;
  remaining_volume: string;
  executed_volume: string;
  trades_count: number;
}

export class OrdersModule {
  constructor(private client: BaseClient) {}

  /**
   * Places a new limit or market order.
   * 
   * @param userId - The unique ID of the user.
   * @param data - The order details.
   * @param data.market - The market pair (e.g., 'btcngn').
   * @param data.side - The side of the order ('buy' or 'sell').
   * @param data.ord_type - The type of order ('limit' or 'market').
   * @param data.price - The price per unit (required for limit orders).
   * @param data.volume - The amount of cryptocurrency to buy or sell.
   * @returns A promise resolving to the created Order object.
   */
  async create(userId: string, data: { market: string; side: 'buy' | 'sell'; ord_type: 'limit' | 'market'; price?: string; volume: string }): Promise<QuidaxResponse<Order>> {
    return (this.client as any).post(`/users/${userId}/orders`, data);
  }

  /**
   * Fetches a paginated list of all orders (buy/sell) for a user.
   * 
   * @param userId - The unique ID of the user.
   * @param params - Optional filters (market, state, order_by).
   * @returns A promise resolving to a paginated list of Order objects.
   */
  async getAll(userId: string, params?: { market?: string; state?: string; order_by?: string }): Promise<PaginatedResponse<Order>> {
    return (this.client as any).get(`/users/${userId}/orders`, { params });
  }

  /**
   * Fetches the details of a specific order.
   * 
   * @param userId - The unique ID of the user.
   * @param orderId - The unique ID of the order.
   * @returns A promise resolving to a single Order object.
   */
  async getOne(userId: string, orderId: string): Promise<QuidaxResponse<Order>> {
    return (this.client as any).get(`/users/${userId}/orders/${orderId}`);
  }

  /**
   * Cancels a pending or open order.
   * 
   * @param userId - The unique ID of the user.
   * @param orderId - The unique ID of the order to cancel.
   * @returns A promise resolving to the canceled Order object.
   */
  async cancel(userId: string, orderId: string): Promise<QuidaxResponse<Order>> {
    return (this.client as any).post(`/users/${userId}/orders/${orderId}/cancel`);
  }
}
