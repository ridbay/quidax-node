import { BaseClient } from '../client';
import { QuidaxResponse, Currency } from '../types';

export class FeesModule {
  constructor(private client: BaseClient) {}

  /**
   * Fetches the current withdrawal fees for all supported cryptocurrencies.
   * 
   * @returns A promise resolving to an array of fee information objects.
   */
  async getCryptoWithdrawalFees(): Promise<QuidaxResponse<any[]>> {
    return (this.client as any).get(`/fee`);
  }
}
