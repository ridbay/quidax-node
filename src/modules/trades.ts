import { BaseClient } from '../client';
import { QuidaxResponse, PaginatedResponse } from '../types';

export interface Trade {
  id: number;
  price: string;
  volume: string;
  funds: string;
  market: string;
  created_at: string;
  trend: 'up' | 'down';
}

export class TradesModule {
  constructor(private client: BaseClient) {}

  /**
   * Fetches the user's historical trades.
   * 
   * @param userId - The unique ID of the user.
   * @returns A promise resolving to a paginated list of Trade objects.
   */
  async getUserTrades(userId: string): Promise<PaginatedResponse<Trade>> {
    return (this.client as any).get(`/users/${userId}/trades`);
  }

  /**
   * Fetches recent trades for a given market pair.
   * 
   * @param marketPair - The market pair (e.g., 'btcngn').
   * @returns A promise resolving to an array of Trade objects.
   */
  async getMarketTrades(marketPair: string): Promise<QuidaxResponse<Trade[]>> {
    return (this.client as any).get(`/trades/${marketPair}`);
  }
}
