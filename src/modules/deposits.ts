import { BaseClient } from '../client';
import { QuidaxResponse, PaginatedResponse, Currency } from '../types';

export interface Deposit {
  id: string;
  currency: Currency;
  amount: string;
  fee: string;
  txid: string;
  status: string;
  payment_address: {
    id: string;
    address: string;
  };
  created_at: string;
  updated_at: string;
}

export class DepositsModule {
  constructor(private client: BaseClient) {}

  /**
   * Fetches all cryptocurrency deposits for a specific user.
   * 
   * @param userId - The unique ID of the user.
   * @param params - Optional filters (state, currency).
   * @returns A promise resolving to a paginated list of Deposit objects.
   */
  async getAll(userId: string, params?: { state?: string; currency?: string }): Promise<PaginatedResponse<Deposit>> {
    return (this.client as any).get(`/users/${userId}/deposits`, { params });
  }

  /**
   * Fetches the details of a specific deposit by ID.
   * 
   * @param userId - The unique ID of the user.
   * @param depositId - The unique ID of the deposit.
   * @returns A promise resolving to a single Deposit object.
   */
  async getOne(userId: string, depositId: string): Promise<QuidaxResponse<Deposit>> {
    return (this.client as any).get(`/users/${userId}/deposits/${depositId}`);
  }

  /**
   * Fetches deposits made by all sub-users across the platform.
   * 
   * @param params - Optional filters (state, currency).
   * @returns A promise resolving to a paginated list of Deposit objects.
   */
  async getSubUsersDeposits(params?: { state?: string; currency?: string }): Promise<PaginatedResponse<Deposit>> {
    return (this.client as any).get('/users/deposits/all', { params });
  }
}
