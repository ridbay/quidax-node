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
  status: SwapStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Swap transaction status. `failed` was added in Quidax 3.0
 * (webhook event: `swap_transaction.failed`).
 */
export type SwapStatus = "initiated" | "completed" | "failed" | (string & {});

export interface SwapRefreshParams {
  from_currency?: Currency;
  to_currency?: Currency;
  /** Provide either `from_amount` or `to_amount`, not both. */
  from_amount?: string;
  /** Provide either `from_amount` or `to_amount`, not both. */
  to_amount?: string;
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
  async getTemporarySwapQuotation(
    userId: string,
    data: {
      from_currency: Currency;
      to_currency: Currency;
      from_amount: string;
      to_amount?: string;
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

  async createQuotation(
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
  async confirmQuotation(
    userId: string,
    quotationId: string,
  ): Promise<QuidaxResponse<SwapTransaction>> {
    return (this.client as any).post(
      `/users/${userId}/swap_quotation/${quotationId}/confirm`,
    );
  }

  /**
   * Refreshes an Instant Swap quotation to get updated market rates.
   * In Quidax 3.0 a quotation can only be refreshed if it has expired or the value changes.
   *
   * @param userId - The unique ID of the user.
   * @param quotationId - The ID of the swap quotation.
   * @param data - Optional updated quotation values.
   * @returns A promise resolving to the refreshed SwapTransaction.
   */
  async refreshQuotation(
    userId: string,
    quotationId: string,
    data?: SwapRefreshParams,
  ): Promise<QuidaxResponse<SwapTransaction>> {
    return (this.client as any).post(
      `/users/${userId}/swap_quotation/${quotationId}/refresh`,
      data,
    );
  }

  /**
   * Fetches the details of a specific Swap Transaction.
   *
   * @param userId - The unique ID of the user.
   * @param swapTransactionId - The ID of the swap transaction.
   * @returns A promise resolving to the SwapTransaction details.
   */
  async getSwapTransaction(
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
  async listSwapTransactions(
    userId: string,
  ): Promise<PaginatedResponse<SwapTransaction>> {
    return (this.client as any).get(`/users/${userId}/swap_transactions`);
  }
}
