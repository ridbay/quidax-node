import { AxiosInstance, AxiosRequestConfig } from "axios";

//#region src/client.d.ts
interface QuidaxClientConfig {
  /**
   * Your Quidax 3.0 API key, generated under "My Account" > "API Management" in the
   * Quidax 3.0 web app. IP whitelisting is mandatory for these keys.
   */
  apiKey?: string;
  /**
   * @deprecated Since Quidax 3.0 you must pass the API key, not the secret key. Use `apiKey` instead.
   * Still accepted for backwards compatibility and sent the same way as `apiKey`.
   */
  secretKey?: string;
  /**
   * Base URL for the primary Exchange APIs (default: https://openapi.quidax.io/exchange-open-api/api/v1)
   */
  exchangeBaseURL?: string;
  /**
   * Base URL for the Ramp and Custodial APIs (default: https://ramp-be.quidax.io/api/v1)
   */
  rampBaseURL?: string;
  /**
   * Timeout in milliseconds (default: 30000)
   */
  timeout?: number;
}
declare class BaseClient {
  protected httpClient: AxiosInstance;
  protected exchangeBaseURL: string;
  protected rampBaseURL: string;
  constructor(config: QuidaxClientConfig);
  private resolveURL;
  protected get<T>(url: string, config?: AxiosRequestConfig & {
    isRamp?: boolean;
  }): Promise<T>;
  protected post<T>(url: string, data?: any, config?: AxiosRequestConfig & {
    isRamp?: boolean;
  }): Promise<T>;
  protected put<T>(url: string, data?: any, config?: AxiosRequestConfig & {
    isRamp?: boolean;
  }): Promise<T>;
  protected delete<T>(url: string, config?: AxiosRequestConfig & {
    isRamp?: boolean;
  }): Promise<T>;
}
//#endregion
//#region src/types/index.d.ts
interface QuidaxResponse<T> {
  status: string;
  message: string;
  data: T;
}
interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}
interface PaginatedResponse<T> extends QuidaxResponse<T[]> {
  meta: PaginationMeta;
}
type Currency = 'btc' | 'ltc' | 'eth' | 'usdt' | 'xrp' | 'dash' | 'trx' | 'doge' | 'usdc' | 'sol' | 'bnb' | 'ton' | 'xlm' | 'cngn' | 'ngn' | 'usd' | string;
/**
 * Blockchain network identifier (e.g. 'bitcoin', 'bep20', 'erc20', 'trc20').
 * Use `wallets.getOne` / `wallets.getAll` to see the networks each asset supports.
 */
type Network = string;
interface WalletNetwork {
  id: Network;
  name: string;
  deposits_enabled: boolean;
  withdraws_enabled: boolean;
  [key: string]: unknown;
}
interface User {
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
interface Wallet {
  id: string;
  currency: Currency;
  balance: string;
  locked: string;
  staked: string;
  blockchain_enabled?: boolean;
  default_network?: Network | null;
  networks?: WalletNetwork[];
  user: {
    id: string;
    sn: string;
  };
  created_at: string;
  updated_at: string;
}
interface PaymentAddress {
  id: string;
  reference: string;
  currency: Currency;
  address: string;
  network?: Network | null;
  destination_tag: string | null;
  total_payments: number;
  created_at: string;
  updated_at: string;
}
//#endregion
//#region src/modules/users.d.ts
declare class UsersModule {
  private client;
  constructor(client: BaseClient);
  /**
   * Creates a new sub-account tethered to the authenticated user.
   *
   * @param data - The details of the user to create.
   * @param data.email - The email of the sub user (must be unique).
   * @param data.first_name - The first name of the sub user.
   * @param data.last_name - The last name of the sub user.
   * @param data.phone_number - Optional phone number.
   * @returns A promise resolving to the created User object.
   * @throws {QuidaxError} If validation fails or email already exists.
   */
  createSubAccount(data: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  }): Promise<QuidaxResponse<User>>;
  /**
   * Fetches the parent (master) account tied to the authenticated secret key.
   *
   * @returns A promise resolving to the Parent User object.
   */
  getMe(): Promise<QuidaxResponse<User>>;
  /**
   * Edits the details of an existing sub-account.
   *
   * @param userId - The unique ID or reference of the sub-account.
   * @param data - The data to update.
   * @returns A promise resolving to the updated User object.
   */
  updateSubAccount(userId: string, data: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  }): Promise<QuidaxResponse<User>>;
  /**
   * Fetches all sub-accounts tied to the authenticated parent account.
   *
   * @returns A promise resolving to a list of User objects.
   */
  listSubAccounts(): Promise<QuidaxResponse<User[]>>;
  /**
   * Fetches the detailed profile of a specific sub-account.
   *
   * @param userId - The unique ID or reference of the sub-account.
   * @returns A promise resolving to the User object.
   * @throws {QuidaxError} If the user is not found.
   */
  getSubAccount(userId: string): Promise<QuidaxResponse<User>>;
}
//#endregion
//#region src/modules/wallets.d.ts
declare class WalletsModule {
  private client;
  constructor(client: BaseClient);
  /**
   * Fetches all wallets for a given user.
   *
   * @param userId - The unique ID of the user. 'me' can be used for the authenticated user.
   * @returns A promise resolving to an array of Wallet objects.
   */
  listWallets(userId: string): Promise<QuidaxResponse<Wallet[]>>;
  /**
   * Fetches a specific cryptocurrency wallet for a user.
   *
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker (e.g., 'btc', 'usdt').
   * @returns A promise resolving to a single Wallet object.
   */
  getWallet(userId: string, currency: Currency): Promise<QuidaxResponse<Wallet>>;
  /**
   * Fetches the default Payment Address for a specific user's wallet.
   *
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker.
   * @returns A promise resolving to the primary PaymentAddress object.
   */
  getPaymentAddress(userId: string, currency: Currency): Promise<QuidaxResponse<PaymentAddress>>;
  /**
   * Fetches all generated Payment Addresses for a specific user's wallet.
   *
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker.
   * @returns A promise resolving to an array of PaymentAddress objects.
   */
  listPaymentAddresses(userId: string, currency: Currency): Promise<QuidaxResponse<PaymentAddress[]>>;
  /**
   * Fetches a specific Payment Address by its ID.
   *
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker.
   * @param addressId - The ID of the specific payment address.
   * @returns A promise resolving to the PaymentAddress object.
   */
  getPaymentAddressById(userId: string, currency: Currency, addressId: string): Promise<QuidaxResponse<PaymentAddress>>;
  /**
   * Generates a new Payment Address for a cryptocurrency wallet.
   * In Quidax 3.0 the network is mandatory and the address is generated immediately.
   *
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker (e.g., 'btc', 'usdt').
   * @param network - The blockchain network (e.g., 'bitcoin', 'bep20', 'trc20').
   *   Use `getWallet`/`listWallets` to see the networks a currency supports.
   * @returns A promise resolving to the newly generated PaymentAddress object.
   */
  createPaymentAddress(userId: string, currency: Currency, network: Network): Promise<QuidaxResponse<PaymentAddress>>;
}
//#endregion
//#region src/modules/withdrawals.d.ts
interface Withdrawal {
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
declare class WithdrawalsModule {
  private client;
  constructor(client: BaseClient);
  /**
   * Fetches a paginated list of all withdrawals for a user.
   *
   * @param userId - The unique ID of the user.
   * @returns A promise resolving to a paginated list of Withdrawal objects.
   */
  listWithdrawals(userId: string): Promise<PaginatedResponse<Withdrawal>>;
  /**
   * Fetches the details of a specific withdrawal.
   *
   * @param userId - The unique ID of the user.
   * @param withdrawalId - The ID of the withdrawal to retrieve.
   * @returns A promise resolving to a single Withdrawal object.
   */
  getWithdrawal(userId: string, withdrawalId: string): Promise<QuidaxResponse<Withdrawal>>;
  /**
   * Fetches a withdrawal by its unique reference string.
   *
   * @param userId - The unique ID of the user.
   * @param reference - The withdrawal reference string.
   * @returns A promise resolving to a single Withdrawal object.
   */
  getWithdrawalByReference(userId: string, reference: string): Promise<QuidaxResponse<Withdrawal>>;
  /**
   * Initiates a new cryptocurrency withdrawal.
   *
   * @param userId - The unique ID of the user.
   * @param data - The withdrawal details.
   * @param data.currency - The cryptocurrency ticker (e.g., 'btc').
   * @param data.amount - The amount to withdraw.
   * @param data.fund_uid - The ID of a sub-user or a crypto address.
   * @param data.fund_uid2 - Destination tag/memo (e.g. for XRP, XLM).
   * @param data.transaction_note - Optional note for the transaction.
   * @param data.reference - Unique reference for the withdrawal (required in v3.0).
   *   If this call fails, fetch the withdrawal with `getWithdrawalByReference` before retrying,
   *   as it may already have been processed.
   * @param data.narration - Optional narration for the transaction.
   * @param data.network - Blockchain network; required for on-chain withdrawals.
   * @returns A promise resolving to the created Withdrawal object.
   */
  createWithdrawal(userId: string, data: {
    currency: Currency;
    amount: string;
    fund_uid: string;
    fund_uid2?: string;
    transaction_note?: string;
    reference: string;
    narration?: string;
    network?: Network;
  }): Promise<QuidaxResponse<Withdrawal>>;
  /**
   * Initiates a new ngn withdrawal to merchant.
   *
   * @param userId - The unique ID of the user.
   * @param amount - The amount to withdraw.
   * @param merchantId - The ID of the merchant.
   * @param reference - The withdrawal reference string.
   * @returns A promise resolving to the created Withdrawal object.
   */
  createNgnMerchantWithdrawal(userId: string, amount: string, merchantId: string, reference: string): Promise<QuidaxResponse<Withdrawal>>;
  /**
   * Cancels a pending withdrawal.
   *
   * @param userId - The unique ID of the user.
   * @param withdrawalId - The ID of the withdrawal to cancel.
   * @returns A promise resolving to the canceled Withdrawal object.
   */
  cancelWithdrawal(userId: string, withdrawalId: string): Promise<QuidaxResponse<Withdrawal>>;
}
//#endregion
//#region src/modules/markets.d.ts
interface Market {
  id: string;
  name: string;
  base_unit: string;
  quote_unit: string;
}
interface Ticker {
  buy: string;
  sell: string;
  low: string;
  high: string;
  open: string;
  last: string;
  volume: string;
  vol: string;
}
interface OrderBook {
  asks: [string, string][];
  bids: [string, string][];
}
declare class MarketsModule {
  private client;
  constructor(client: BaseClient);
  /**
   * Retrieves a list of all active markets on Quidax.
   *
   * @returns A promise resolving to an array of Market objects.
   */
  listMarkets(): Promise<QuidaxResponse<Market[]>>;
  /**
   * Retrieves tickers for all available markets.
   *
   * @returns A promise resolving to a record mapping market pairs to their Ticker data.
   */
  getTickers(): Promise<QuidaxResponse<Record<string, {
    ticker: Ticker;
    at: number;
  }>>>;
  /**
   * Retrieves the current ticker data for a specific market.
   *
   * @param market - The market pair (e.g., 'btcngn').
   * @returns A promise resolving to the Ticker data.
   */
  getTicker(market: string): Promise<QuidaxResponse<{
    ticker: Ticker;
    at: number;
  }>>;
  /**
   * Retrieves candlestick (k-line) data for a specific market.
   *
   * @param market - The market pair (e.g., 'btcngn').
   * @param params - Optional query parameters.
   * @param params.limit - The number of data points to return.
   * @param params.period - The time period in minutes.
   * @param params.timestamp - Starting timestamp.
   * @returns A promise resolving to an array of k-line data points.
   */
  getCandles(market: string, params?: {
    limit?: number;
    period?: number;
    timestamp?: number;
  }): Promise<QuidaxResponse<any[]>>;
  /**
   * Retrieves candlestick data including pending trades for a market.
   *
   * @param market - The market pair (e.g., 'btcngn').
   * @param tradeId - The ID of the pending trade reference.
   * @param params - Optional query parameters.
   * @returns A promise resolving to an array of k-line data points.
   */
  getCandlesWithPendingTrades(market: string, tradeId: number, params?: {
    limit?: number;
    period?: number;
    timestamp?: number;
  }): Promise<QuidaxResponse<any[]>>;
  /**
   * Retrieves the order book (asks and bids) for a specific market.
   *
   * @param market - The market pair (e.g., 'btcngn').
   * @param params - Optional query parameters to limit asks and bids.
   * @returns A promise resolving to the OrderBook object.
   */
  getOrderBook(market: string, params?: {
    asks_limit?: number;
    bids_limit?: number;
  }): Promise<QuidaxResponse<OrderBook>>;
  /**
   * Retrieves market depth data.
   *
   * @param market - The market pair (e.g., 'btcngn').
   * @param params - Optional limit parameter.
   * @returns A promise resolving to depth data.
   */
  getDepth(market: string, params?: {
    limit?: number;
  }): Promise<QuidaxResponse<OrderBook>>;
  /**
   * Retrieves a high-level summary of all markets.
   *
   * @returns A promise resolving to an array of market summaries.
   */
  getSummary(): Promise<QuidaxResponse<any[]>>;
}
//#endregion
//#region src/modules/trades.d.ts
interface Trade {
  id: number;
  price: string;
  volume: string;
  funds: string;
  market: string;
  created_at: string;
  trend: 'up' | 'down';
}
declare class TradesModule {
  private client;
  constructor(client: BaseClient);
  /**
   * Fetches the user's historical trades.
   *
   * @param userId - The unique ID of the user.
   * @returns A promise resolving to a paginated list of Trade objects.
   */
  listUserTrades(userId: string): Promise<PaginatedResponse<Trade>>;
  /**
   * Fetches recent trades for a given market pair.
   *
   * @param marketPair - The market pair (e.g., 'btcngn').
   * @returns A promise resolving to an array of Trade objects.
   */
  listMarketTrades(marketPair: string): Promise<QuidaxResponse<Trade[]>>;
}
//#endregion
//#region src/modules/deposits.d.ts
interface Deposit {
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
declare class DepositsModule {
  private client;
  constructor(client: BaseClient);
  /**
   * Fetches all cryptocurrency deposits for a specific user.
   *
   * @param userId - The unique ID of the user.
   * @param params - Optional filters (state, currency).
   * @returns A promise resolving to a paginated list of Deposit objects.
   */
  listDeposits(userId: string, params?: {
    state?: string;
    currency?: string;
  }): Promise<PaginatedResponse<Deposit>>;
  /**
   * Fetches the details of a specific deposit by ID.
   *
   * @param userId - The unique ID of the user.
   * @param depositId - The unique ID of the deposit.
   * @returns A promise resolving to a single Deposit object.
   */
  getDeposit(userId: string, depositId: string): Promise<QuidaxResponse<Deposit>>;
  /**
   * Fetches deposits made by all sub-users across the platform.
   *
   * @param params - Optional filters (state, currency).
   * @returns A promise resolving to a paginated list of Deposit objects.
   */
  listSubAccountDeposits(params?: {
    state?: string;
    currency?: string;
  }): Promise<PaginatedResponse<Deposit>>;
}
//#endregion
//#region src/modules/swap.d.ts
interface SwapTransaction {
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
type SwapStatus = "initiated" | "completed" | "failed" | (string & {});
interface SwapRefreshParams {
  from_currency?: Currency;
  to_currency?: Currency;
  /** Provide either `from_amount` or `to_amount`, not both. */
  from_amount?: string;
  /** Provide either `from_amount` or `to_amount`, not both. */
  to_amount?: string;
}
declare class SwapModule {
  private client;
  constructor(client: BaseClient);
  /**
   * Generates a temporary swap quotation for previewing a swap before creation.
   *
   * @param userId - The unique ID of the user.
   * @param data - The swap quotation parameters.
   * @returns A promise resolving to the temporary swap quotation details.
   */
  previewQuotation(userId: string, data: {
    from_currency: Currency;
    to_currency: Currency;
    from_amount: string;
    to_amount?: string;
  }): Promise<QuidaxResponse<any>>;
  /**
   * Creates an Instant Swap quotation linked to the user account.
   *
   * @param userId - The unique ID of the user.
   * @param data - The swap creation payload.
   * @returns A promise resolving to a SwapTransaction object in an unconfirmed state.
   */
  createQuotation(userId: string, data: {
    from_currency: Currency;
    to_currency: Currency;
    from_amount?: string;
    to_amount?: string;
  }): Promise<QuidaxResponse<SwapTransaction>>;
  /**
   * Confirms a previously created Instant Swap quotation.
   *
   * @param userId - The unique ID of the user.
   * @param quotationId - The ID of the swap quotation to confirm.
   * @returns A promise resolving to the confirmed SwapTransaction.
   */
  confirmQuotation(userId: string, quotationId: string): Promise<QuidaxResponse<SwapTransaction>>;
  /**
   * Refreshes an Instant Swap quotation to get updated market rates.
   * In Quidax 3.0 a quotation can only be refreshed if it has expired or the value changes.
   *
   * @param userId - The unique ID of the user.
   * @param quotationId - The ID of the swap quotation.
   * @param data - Optional updated quotation values.
   * @returns A promise resolving to the refreshed SwapTransaction.
   */
  refreshQuotation(userId: string, quotationId: string, data?: SwapRefreshParams): Promise<QuidaxResponse<SwapTransaction>>;
  /**
   * Fetches the details of a specific Swap Transaction.
   *
   * @param userId - The unique ID of the user.
   * @param swapTransactionId - The ID of the swap transaction.
   * @returns A promise resolving to the SwapTransaction details.
   */
  getSwapTransaction(userId: string, swapTransactionId: string): Promise<QuidaxResponse<SwapTransaction>>;
  /**
   * Retrieves a paginated list of all swap transactions for a user.
   *
   * @param userId - The unique ID of the user.
   * @returns A promise resolving to a paginated list of SwapTransactions.
   */
  listSwapTransactions(userId: string): Promise<PaginatedResponse<SwapTransaction>>;
}
//#endregion
//#region src/modules/orders.d.ts
interface Order {
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
declare class OrdersModule {
  private client;
  constructor(client: BaseClient);
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
  createOrder(userId: string, data: {
    market: string;
    side: 'buy' | 'sell';
    ord_type: 'limit' | 'market';
    price?: string;
    volume: string;
  }): Promise<QuidaxResponse<Order>>;
  /**
   * Fetches a paginated list of all orders (buy/sell) for a user.
   *
   * @param userId - The unique ID of the user.
   * @param params - Optional filters (market, state, order_by).
   * @returns A promise resolving to a paginated list of Order objects.
   */
  listOrders(userId: string, params?: {
    market?: string;
    state?: string;
    order_by?: string;
  }): Promise<PaginatedResponse<Order>>;
  /**
   * Fetches the details of a specific order.
   *
   * @param userId - The unique ID of the user.
   * @param orderId - The unique ID of the order.
   * @returns A promise resolving to a single Order object.
   */
  getOrder(userId: string, orderId: string): Promise<QuidaxResponse<Order>>;
  /**
   * Cancels a pending or open order.
   *
   * @param userId - The unique ID of the user.
   * @param orderId - The unique ID of the order to cancel.
   * @returns A promise resolving to the canceled Order object.
   */
  cancelOrder(userId: string, orderId: string): Promise<QuidaxResponse<Order>>;
}
//#endregion
//#region src/modules/fees.d.ts
declare class FeesModule {
  private client;
  constructor(client: BaseClient);
  /**
   * Fetches the current withdrawal fees for all supported cryptocurrencies.
   *
   * @returns A promise resolving to an array of fee information objects.
   */
  getCryptoWithdrawalFees(): Promise<QuidaxResponse<any[]>>;
}
//#endregion
//#region src/modules/ramp.d.ts
declare class RampModule {
  private client;
  constructor(client: BaseClient);
  /**
   * Fetches available payment methods for Fiat On-ramp or Off-ramp.
   *
   * @returns A promise resolving to the supported payment methods.
   */
  getPaymentMethods(): Promise<QuidaxResponse<any>>;
  /**
   * Fetches the minimum and maximum purchase limits for buying cryptocurrency (On-ramp).
   *
   * @returns A promise resolving to the buy limits.
   */
  getBuyLimits(): Promise<QuidaxResponse<any>>;
  /**
   * Fetches the minimum and maximum purchase limits for selling cryptocurrency (Off-ramp).
   *
   * @returns A promise resolving to the sell limits.
   */
  getSellLimits(): Promise<QuidaxResponse<any>>;
  /**
   * Generates a purchase quote for buying cryptocurrency with fiat.
   *
   * @param params - The quote parameters (e.g., fiat, crypto, amount).
   * @returns A promise resolving to the buy quote details.
   */
  getBuyQuote(params?: any): Promise<QuidaxResponse<any>>;
  /**
   * Generates a purchase quote for selling cryptocurrency for fiat.
   *
   * @param params - The quote parameters.
   * @returns A promise resolving to the sell quote details.
   */
  getSellQuote(params?: any): Promise<QuidaxResponse<any>>;
  /**
   * Fetches the details of an existing Off-ramp transaction (Crypto -> Fiat).
   *
   * @param reference - The unique reference of the transaction.
   * @returns A promise resolving to the transaction details.
   */
  getOffRampTransaction(reference: string): Promise<QuidaxResponse<any>>;
  /**
   * Fetches the details of an existing On-ramp transaction (Fiat -> Crypto).
   *
   * @param reference - The unique reference of the transaction.
   * @returns A promise resolving to the transaction details.
   */
  getOnRampTransaction(reference: string): Promise<QuidaxResponse<any>>;
  /**
   * Initiates a new Custodial On-ramp transaction (Fiat -> Crypto).
   *
   * @param data - The transaction initiation payload.
   * @returns A promise resolving to the created transaction.
   */
  initiateOnRamp(data: any): Promise<QuidaxResponse<any>>;
  /**
   * Confirms a previously initiated Custodial On-ramp transaction.
   *
   * @param reference - The reference of the transaction.
   * @param data - Optional confirmation payload.
   * @returns A promise resolving to the confirmed transaction.
   */
  confirmOnRamp(reference: string, data?: any): Promise<QuidaxResponse<any>>;
  /**
   * Initiates a new Custodial Off-ramp transaction (Crypto -> Fiat).
   *
   * @param data - The transaction initiation payload.
   * @returns A promise resolving to the created transaction.
   */
  initiateOffRamp(data: any): Promise<QuidaxResponse<any>>;
  /**
   * Confirms a previously initiated Custodial Off-ramp transaction.
   *
   * @param reference - The reference of the transaction.
   * @param data - Optional confirmation payload.
   * @returns A promise resolving to the confirmed transaction.
   */
  confirmOffRamp(reference: string, data?: any): Promise<QuidaxResponse<any>>;
  /**
   * Fetches supported banks for Fiat Off-ramp withdrawals.
   *
   * @returns A promise resolving to the list of supported banks.
   */
  getBanks(): Promise<QuidaxResponse<any>>;
  /**
   * Adds a bank account to a specific Off-ramp transaction.
   *
   * @param reference - The reference of the Off-ramp transaction.
   * @param data - The bank account details.
   * @returns A promise resolving to the updated transaction.
   */
  addBankAccount(reference: string, data: any): Promise<QuidaxResponse<any>>;
}
//#endregion
//#region src/errors.d.ts
declare class QuidaxError extends Error {
  statusCode: number;
  status: string;
  data: any;
  isQuidaxError: boolean;
  constructor(statusCode: number, status: string, message: string, data?: any);
}
//#endregion
//#region src/index.d.ts
/**
 * The main Quidax SDK Client.
 *
 * Provides access to all Quidax v3.0 modules, seamlessly routing between the Exchange API and the Ramp API.
 *
 * @example
 * ```typescript
 * import Quidax from 'quidax-node';
 *
 * const quidax = new Quidax({ apiKey: 'your_api_key' });
 * const me = await quidax.users.getMe();
 * ```
 */
declare class Quidax {
  /**
   * Manage parent and sub-accounts.
   */
  users: UsersModule;
  /**
   * Fetch wallets and manage cryptocurrency payment addresses.
   */
  wallets: WalletsModule;
  /**
   * Process and track crypto withdrawals.
   */
  withdrawals: WithdrawalsModule;
  /**
   * Access real-time market data, order books, and tickers.
   */
  markets: MarketsModule;
  /**
   * View recent trades on the exchange.
   */
  trades: TradesModule;
  /**
   * Track crypto deposits into user wallets.
   */
  deposits: DepositsModule;
  /**
   * Process instant crypto-to-crypto swaps.
   */
  swap: SwapModule;
  /**
   * Place, manage, and cancel limit and market orders.
   */
  orders: OrdersModule;
  /**
   * Check current network fees for withdrawals.
   */
  fees: FeesModule;
  /**
   * Access Fiat On-ramp and Off-ramp Custodial services.
   */
  ramp: RampModule;
  private client;
  constructor(config: QuidaxClientConfig);
}
//#endregion
export { BaseClient, Currency, Deposit, DepositsModule, FeesModule, Market, MarketsModule, Network, Order, OrderBook, OrdersModule, PaginatedResponse, PaginationMeta, PaymentAddress, Quidax, Quidax as default, QuidaxClientConfig, QuidaxError, QuidaxResponse, RampModule, SwapModule, SwapRefreshParams, SwapStatus, SwapTransaction, Ticker, Trade, TradesModule, User, UsersModule, Wallet, WalletNetwork, WalletsModule, Withdrawal, WithdrawalsModule };