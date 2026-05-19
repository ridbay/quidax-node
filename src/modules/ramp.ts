import { BaseClient } from '../client';
import { QuidaxResponse, PaginatedResponse } from '../types';

export class RampModule {
  constructor(private client: BaseClient) {}

  /**
   * Fetches available payment methods for Fiat On-ramp or Off-ramp.
   * 
   * @returns A promise resolving to the supported payment methods.
   */
  async getPaymentMethods(): Promise<QuidaxResponse<any>> {
    return (this.client as any).get('/merchants/payment_methods', { isRamp: true });
  }

  /**
   * Fetches the minimum and maximum purchase limits for buying cryptocurrency (On-ramp).
   * 
   * @returns A promise resolving to the buy limits.
   */
  async getBuyLimits(): Promise<QuidaxResponse<any>> {
    return (this.client as any).get('/merchants/purchase_limits/buy', { isRamp: true });
  }

  /**
   * Fetches the minimum and maximum purchase limits for selling cryptocurrency (Off-ramp).
   * 
   * @returns A promise resolving to the sell limits.
   */
  async getSellLimits(): Promise<QuidaxResponse<any>> {
    return (this.client as any).get('/merchants/purchase_limits/sell', { isRamp: true });
  }

  /**
   * Generates a purchase quote for buying cryptocurrency with fiat.
   * 
   * @param params - The quote parameters (e.g., fiat, crypto, amount).
   * @returns A promise resolving to the buy quote details.
   */
  async getBuyQuote(params?: any): Promise<QuidaxResponse<any>> {
    return (this.client as any).get('/merchants/purchase_quotes/buy', { params, isRamp: true });
  }

  /**
   * Generates a purchase quote for selling cryptocurrency for fiat.
   * 
   * @param params - The quote parameters.
   * @returns A promise resolving to the sell quote details.
   */
  async getSellQuote(params?: any): Promise<QuidaxResponse<any>> {
    return (this.client as any).get('/merchants/purchase_quotes/sell', { params, isRamp: true });
  }

  /**
   * Fetches the details of an existing Off-ramp transaction (Crypto -> Fiat).
   * 
   * @param reference - The unique reference of the transaction.
   * @returns A promise resolving to the transaction details.
   */
  async getOffRampTransaction(reference: string): Promise<QuidaxResponse<any>> {
    return (this.client as any).get(`/merchants/off_ramp_transaction/${reference}`, { isRamp: true });
  }

  /**
   * Fetches the details of an existing On-ramp transaction (Fiat -> Crypto).
   * 
   * @param reference - The unique reference of the transaction.
   * @returns A promise resolving to the transaction details.
   */
  async getOnRampTransaction(reference: string): Promise<QuidaxResponse<any>> {
    return (this.client as any).get(`/merchants/on_ramp_transaction/${reference}`, { isRamp: true });
  }

  /**
   * Initiates a new Custodial On-ramp transaction (Fiat -> Crypto).
   * 
   * @param data - The transaction initiation payload.
   * @returns A promise resolving to the created transaction.
   */
  async initiateOnRamp(data: any): Promise<QuidaxResponse<any>> {
    return (this.client as any).post('/merchants/custodial/on_ramp_transactions/initiate', data, { isRamp: true });
  }

  /**
   * Confirms a previously initiated Custodial On-ramp transaction.
   * 
   * @param reference - The reference of the transaction.
   * @param data - Optional confirmation payload.
   * @returns A promise resolving to the confirmed transaction.
   */
  async confirmOnRamp(reference: string, data?: any): Promise<QuidaxResponse<any>> {
    return (this.client as any).post(`/merchants/custodial/on_ramp_transactions/${reference}/confirm`, data, { isRamp: true });
  }

  /**
   * Initiates a new Custodial Off-ramp transaction (Crypto -> Fiat).
   * 
   * @param data - The transaction initiation payload.
   * @returns A promise resolving to the created transaction.
   */
  async initiateOffRamp(data: any): Promise<QuidaxResponse<any>> {
    return (this.client as any).post('/merchants/custodial/off_ramp_transactions/initiate', data, { isRamp: true });
  }

  /**
   * Confirms a previously initiated Custodial Off-ramp transaction.
   * 
   * @param reference - The reference of the transaction.
   * @param data - Optional confirmation payload.
   * @returns A promise resolving to the confirmed transaction.
   */
  async confirmOffRamp(reference: string, data?: any): Promise<QuidaxResponse<any>> {
    return (this.client as any).post(`/merchants/custodial/off_ramp_transactions/${reference}/confirm`, data, { isRamp: true });
  }

  /**
   * Fetches supported banks for Fiat Off-ramp withdrawals.
   * 
   * @returns A promise resolving to the list of supported banks.
   */
  async getBanks(): Promise<QuidaxResponse<any>> {
    return (this.client as any).get('/merchants/custodial/banks', { isRamp: true });
  }

  /**
   * Adds a bank account to a specific Off-ramp transaction.
   * 
   * @param reference - The reference of the Off-ramp transaction.
   * @param data - The bank account details.
   * @returns A promise resolving to the updated transaction.
   */
  async addBankAccount(reference: string, data: any): Promise<QuidaxResponse<any>> {
    return (this.client as any).post(`/merchants/custodial/off_ramp_transactions/${reference}/bank_account`, data, { isRamp: true });
  }
}
