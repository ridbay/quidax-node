import { BaseClient } from "../client";
import { QuidaxResponse, PaginatedResponse, Currency } from "../types";

export interface Withdrawal {
  id: string;
  reference: string;
  currency: Currency;
  amount: string;
  fee: string;
  total: string;
  txid: string | null;
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export class WithdrawalsModule {
  constructor(private client: BaseClient) {}

  /**
   * Fetches a paginated list of all withdrawals for a user.
   *
   * @param userId - The unique ID of the user.
   * @returns A promise resolving to a paginated list of Withdrawal objects.
   */
  async getAll(userId: string): Promise<PaginatedResponse<Withdrawal>> {
    return (this.client as any).get(`/users/${userId}/withdraws`);
  }

  /**
   * Fetches the details of a specific withdrawal.
   *
   * @param userId - The unique ID of the user.
   * @param withdrawalId - The ID of the withdrawal to retrieve.
   * @returns A promise resolving to a single Withdrawal object.
   */
  async getOne(
    userId: string,
    withdrawalId: string,
  ): Promise<QuidaxResponse<Withdrawal>> {
    return (this.client as any).get(
      `/users/${userId}/withdraws/${withdrawalId}`,
    );
  }

  /**
   * Fetches a withdrawal by its unique reference string.
   *
   * @param userId - The unique ID of the user.
   * @param reference - The withdrawal reference string.
   * @returns A promise resolving to a single Withdrawal object.
   */
  async getByReference(
    userId: string,
    reference: string,
  ): Promise<QuidaxResponse<Withdrawal>> {
    return (this.client as any).get(
      `/users/${userId}/withdraws/reference/${reference}`,
    );
  }

  /**
   * Initiates a new cryptocurrency withdrawal.
   *
   * @param userId - The unique ID of the user.
   * @param data - The withdrawal details.
   * @param data.currency - The cryptocurrency ticker (e.g., 'btc').
   * @param data.amount - The amount to withdraw.
   * @param data.fund_uid - The ID of the destination address/fund.
   * @param data.transaction_note - Optional note for the transaction.
   * @returns A promise resolving to the created Withdrawal object.
   */
  async create(
    userId: string,
    data: {
      currency: Currency;
      amount: string;
      fund_uid: string;
      transaction_note?: string;
    },
  ): Promise<QuidaxResponse<Withdrawal>> {
    return (this.client as any).post(`/users/${userId}/withdraws`, data);
  }

  /**
   * Initiates a new ngn withdrawal to merchant.
   *
   * @param userId - The unique ID of the user.
   * @param amount - The amount to withdraw.
   * @param merchantId - The ID of the merchant.
   * @returns A promise resolving to the created Withdrawal object.
   */
  async ngn_to_merchant(
    userId: string,
    amount: string,
    merchantId: string,
  ): Promise<QuidaxResponse<Withdrawal>> {
    const payload = {
      currency: "ngn",
      amount,
      fund_uid: merchantId,
    };
    return (this.client as any).post(`/users/${userId}/withdraws`, payload);
  }
  /**
   * Cancels a pending withdrawal.
   *
   * @param userId - The unique ID of the user.
   * @param withdrawalId - The ID of the withdrawal to cancel.
   * @returns A promise resolving to the canceled Withdrawal object.
   */
  async cancel(
    userId: string,
    withdrawalId: string,
  ): Promise<QuidaxResponse<Withdrawal>> {
    return (this.client as any).post(
      `/users/${userId}/withdraws/${withdrawalId}/cancel`,
    );
  }
}
