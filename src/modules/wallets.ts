import { BaseClient } from '../client';
import { QuidaxResponse, Wallet, PaymentAddress, Currency } from '../types';

export class WalletsModule {
  constructor(private client: BaseClient) {}

  /**
   * Fetches all wallets for a given user.
   * 
   * @param userId - The unique ID of the user. 'me' can be used for the authenticated user.
   * @returns A promise resolving to an array of Wallet objects.
   */
  async getAll(userId: string): Promise<QuidaxResponse<Wallet[]>> {
    return (this.client as any).get(`/users/${userId}/wallets`);
  }

  /**
   * Fetches a specific cryptocurrency wallet for a user.
   * 
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker (e.g., 'btc', 'usdt').
   * @returns A promise resolving to a single Wallet object.
   */
  async getOne(userId: string, currency: Currency): Promise<QuidaxResponse<Wallet>> {
    return (this.client as any).get(`/users/${userId}/wallets/${currency}`);
  }

  /**
   * Fetches the default Payment Address for a specific user's wallet.
   * 
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker.
   * @returns A promise resolving to the primary PaymentAddress object.
   */
  async getPaymentAddress(userId: string, currency: Currency): Promise<QuidaxResponse<PaymentAddress>> {
    return (this.client as any).get(`/users/${userId}/wallets/${currency}/address`);
  }

  /**
   * Fetches all generated Payment Addresses for a specific user's wallet.
   * 
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker.
   * @returns A promise resolving to an array of PaymentAddress objects.
   */
  async getAllPaymentAddresses(userId: string, currency: Currency): Promise<QuidaxResponse<PaymentAddress[]>> {
    return (this.client as any).get(`/users/${userId}/wallets/${currency}/addresses`);
  }

  /**
   * Fetches a specific Payment Address by its ID.
   * 
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker.
   * @param addressId - The ID of the specific payment address.
   * @returns A promise resolving to the PaymentAddress object.
   */
  async getPaymentAddressById(userId: string, currency: Currency, addressId: string): Promise<QuidaxResponse<PaymentAddress>> {
    return (this.client as any).get(`/users/${userId}/wallets/${currency}/addresses/${addressId}`);
  }

  /**
   * Generates a new Payment Address for a cryptocurrency wallet.
   * 
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker (e.g., 'btc', 'eth').
   * @returns A promise resolving to the newly generated PaymentAddress object.
   */
  async createPaymentAddress(userId: string, currency: Currency): Promise<QuidaxResponse<PaymentAddress>> {
    return (this.client as any).post(`/users/${userId}/wallets/${currency}/addresses`);
  }
}
