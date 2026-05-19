import { BaseClient } from "../client";
import { QuidaxResponse, PaginatedResponse, Currency } from "../types";

export interface SwapTransaction {
  id: string;
  source_currency: Currency;
  destination_currency: Currency;
  source_amount: string;
  destination_amount: string;
  exchange_rate: string;
  fee: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export class SwapModule {
  constructor(private client: BaseClient) {}

  /**
   * Generates a temporary swap quotation for previewing a swap before creation.
   *
   * @param userId - The unique ID of the user.
   * @param data - The swap quotation parameters.
   * @returns A promise resolving to the temporary swap quotation details.
   */
  async getQuotation(
    userId: string,
    data: {
      source_currency: Currency;
      destination_currency: Currency;
      amount: string;
      type: "source" | "destination";
    },
  ): Promise<QuidaxResponse<any>> {
    return (this.client as any).post(
      `/users/${userId}/temporary_swap_quotation`,
      data,
    );
  }

  /**
   * Creates an Instant Swap quotation linked to the user account.
   *
   * @param userId - The unique ID of the user.
   * @param data - The swap creation payload.
   * @returns A promise resolving to a SwapTransaction object in an unconfirmed state.
   */

  async create(
    userId: string,
    data: {
      from_currency: Currency;
      to_currency: Currency;
      from_amount?: string;
      to_amount?: string;
    },
  ): Promise<QuidaxResponse<SwapTransaction>> {
    return (this.client as any).post(`/users/${userId}/swap_quotation`, data);
  }

  /**
   * Confirms a previously created Instant Swap quotation.
   *
   * @param userId - The unique ID of the user.
   * @param quotationId - The ID of the swap quotation to confirm.
   * @returns A promise resolving to the confirmed SwapTransaction.
   */
  async confirm(
    userId: string,
    quotationId: string,
  ): Promise<QuidaxResponse<SwapTransaction>> {
    return (this.client as any).post(
      `/users/${userId}/swap_quotation/${quotationId}/confirm`,
    );
  }

  /**
   * Refreshes an expired Instant Swap quotation to get updated market rates.
   *
   * @param userId - The unique ID of the user.
   * @param quotationId - The ID of the expired swap quotation.
   * @returns A promise resolving to the refreshed SwapTransaction.
   */
  async refresh(
    userId: string,
    quotationId: string,
  ): Promise<QuidaxResponse<SwapTransaction>> {
    return (this.client as any).post(
      `/users/${userId}/swap_quotation/${quotationId}/refresh`,
    );
  }

  /**
   * Fetches the details of a specific Swap Transaction.
   *
   * @param userId - The unique ID of the user.
   * @param swapTransactionId - The ID of the swap transaction.
   * @returns A promise resolving to the SwapTransaction details.
   */
  async getOne(
    userId: string,
    swapTransactionId: string,
  ): Promise<QuidaxResponse<SwapTransaction>> {
    return (this.client as any).get(
      `/users/${userId}/swap_transactions/${swapTransactionId}`,
    );
  }

  /**
   * Retrieves a paginated list of all swap transactions for a user.
   *
   * @param userId - The unique ID of the user.
   * @returns A promise resolving to a paginated list of SwapTransactions.
   */
  async getAll(userId: string): Promise<PaginatedResponse<SwapTransaction>> {
    return (this.client as any).get(`/users/${userId}/swap_transactions`);
  }
}
