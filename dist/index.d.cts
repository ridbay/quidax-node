import { AxiosInstance, AxiosRequestConfig } from "axios";

//#region src/client.d.ts
interface QuidaxClientConfig {
  /**
   * The Quidax secret API key (starts with 's_')
   */
  secretKey: string;
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
type Currency = 'btc' | 'ltc' | 'eth' | 'usdt' | 'xrp' | 'dash' | 'trx' | 'doge' | 'usdc' | 'ngn' | 'usd' | string;
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
  create(data: {
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
  getParentAccount(): Promise<QuidaxResponse<User>>;
  /**
   * Edits the details of an existing sub-account.
   *
   * @param userId - The unique ID or reference of the sub-account.
   * @param data - The data to update.
   * @returns A promise resolving to the updated User object.
   */
  edit(userId: string, data: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  }): Promise<QuidaxResponse<User>>;
  /**
   * Fetches all sub-accounts tied to the authenticated parent account.
   *
   * @returns A promise resolving to a list of User objects.
   */
  getAll(): Promise<QuidaxResponse<User[]>>;
  /**
   * Fetches the detailed profile of a specific sub-account.
   *
   * @param userId - The unique ID or reference of the sub-account.
   * @returns A promise resolving to the User object.
   * @throws {QuidaxError} If the user is not found.
   */
  getOne(userId: string): Promise<QuidaxResponse<User>>;
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
  getAll(userId: string): Promise<QuidaxResponse<Wallet[]>>;
  /**
   * Fetches a specific cryptocurrency wallet for a user.
   *
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker (e.g., 'btc', 'usdt').
   * @returns A promise resolving to a single Wallet object.
   */
  getOne(userId: string, currency: Currency): Promise<QuidaxResponse<Wallet>>;
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
  getAllPaymentAddresses(userId: string, currency: Currency): Promise<QuidaxResponse<PaymentAddress[]>>;
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
   *
   * @param userId - The unique ID of the user.
   * @param currency - The cryptocurrency ticker (e.g., 'btc', 'eth').
   * @returns A promise resolving to the newly generated PaymentAddress object.
   */
  createPaymentAddress(userId: string, currency: Currency, network: string): Promise<QuidaxResponse<PaymentAddress>>;
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
  getAll(userId: string): Promise<PaginatedResponse<Withdrawal>>;
  /**
   * Fetches the details of a specific withdrawal.
   *
   * @param userId - The unique ID of the user.
   * @param withdrawalId - The ID of the withdrawal to retrieve.
   * @returns A promise resolving to a single Withdrawal object.
   */
  getOne(userId: string, withdrawalId: string): Promise<QuidaxResponse<Withdrawal>>;
  /**
   * Fetches a withdrawal by its unique reference string.
   *
   * @param userId - The unique ID of the user.
   * @param reference - The withdrawal reference string.
   * @returns A promise resolving to a single Withdrawal object.
   */
  getByReference(userId: string, reference: string): Promise<QuidaxResponse<Withdrawal>>;
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
  create(userId: string, data: {
    currency: Currency;
    amount: string;
    fund_uid: string;
    transaction_note?: string;
  }): Promise<QuidaxResponse<Withdrawal>>;
  /**
   * Initiates a new ngn withdrawal to merchant.
   *
   * @param userId - The unique ID of the user.
   * @param amount - The amount to withdraw.
   * @param merchantId - The ID of the merchant.
   * @returns A promise resolving to the created Withdrawal object.
   */
  ngn_to_merchant(userId: string, amount: string, merchantId: string): Promise<QuidaxResponse<Withdrawal>>;
  /**
   * Cancels a pending withdrawal.
   *
   * @param userId - The unique ID of the user.
   * @param withdrawalId - The ID of the withdrawal to cancel.
   * @returns A promise resolving to the canceled Withdrawal object.
   */
  cancel(userId: string, withdrawalId: string): Promise<QuidaxResponse<Withdrawal>>;
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
  getAll(): Promise<QuidaxResponse<Market[]>>;
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
   * @param currency - The market pair (e.g., 'btcngn').
   * @returns A promise resolving to the Ticker data.
   */
  getTicker(currency: string): Promise<QuidaxResponse<{
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
  getKLine(market: string, params?: {
    limit?: number;
    period?: number;
    timestamp?: number;
  }): Promise<QuidaxResponse<any[]>>;
  /**
   * Retrieves candlestick data including pending trades for a market.
   *
   * @param currency - The market pair (e.g., 'btcngn').
   * @param tradeId - The ID of the pending trade reference.
   * @param params - Optional query parameters.
   * @returns A promise resolving to an array of k-line data points.
   */
  getKLineWithPending(currency: string, tradeId: number, params?: {
    limit?: number;
    period?: number;
    timestamp?: number;
  }): Promise<QuidaxResponse<any[]>>;
  /**
   * Retrieves the order book (asks and bids) for a specific market.
   *
   * @param currency - The market pair (e.g., 'btcngn').
   * @param params - Optional query parameters to limit asks and bids.
   * @returns A promise resolving to the OrderBook object.
   */
  getOrderBook(currency: string, params?: {
    asks_limit?: number;
    bids_limit?: number;
  }): Promise<QuidaxResponse<OrderBook>>;
  /**
   * Retrieves market depth data.
   *
   * @param currency - The market pair (e.g., 'btcngn').
   * @param params - Optional limit parameter.
   * @returns A promise resolving to depth data.
   */
  getDepth(currency: string, params?: {
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
  getUserTrades(userId: string): Promise<PaginatedResponse<Trade>>;
  /**
   * Fetches recent trades for a given market pair.
   *
   * @param marketPair - The market pair (e.g., 'btcngn').
   * @returns A promise resolving to an array of Trade objects.
   */
  getMarketTrades(marketPair: string): Promise<QuidaxResponse<Trade[]>>;
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
  getAll(userId: string, params?: {
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
  getOne(userId: string, depositId: string): Promise<QuidaxResponse<Deposit>>;
  /**
   * Fetches deposits made by all sub-users across the platform.
   *
   * @param params - Optional filters (state, currency).
   * @returns A promise resolving to a paginated list of Deposit objects.
   */
  getSubUsersDeposits(params?: {
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
  status: string;
  created_at: string;
  updated_at: string;
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
  getQuotation(userId: string, data: {
    source_currency: Currency;
    destination_currency: Currency;
    amount: string;
    type: "source" | "destination";
  }): Promise<QuidaxResponse<any>>;
  /**
   * Creates an Instant Swap quotation linked to the user account.
   *
   * @param userId - The unique ID of the user.
   * @param data - The swap creation payload.
   * @returns A promise resolving to a SwapTransaction object in an unconfirmed state.
   */
  create(userId: string, data: {
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
  confirm(userId: string, quotationId: string): Promise<QuidaxResponse<SwapTransaction>>;
  /**
   * Refreshes an expired Instant Swap quotation to get updated market rates.
   *
   * @param userId - The unique ID of the user.
   * @param quotationId - The ID of the expired swap quotation.
   * @returns A promise resolving to the refreshed SwapTransaction.
   */
  refresh(userId: string, quotationId: string): Promise<QuidaxResponse<SwapTransaction>>;
  /**
   * Fetches the details of a specific Swap Transaction.
   *
   * @param userId - The unique ID of the user.
   * @param swapTransactionId - The ID of the swap transaction.
   * @returns A promise resolving to the SwapTransaction details.
   */
  getOne(userId: string, swapTransactionId: string): Promise<QuidaxResponse<SwapTransaction>>;
  /**
   * Retrieves a paginated list of all swap transactions for a user.
   *
   * @param userId - The unique ID of the user.
   * @returns A promise resolving to a paginated list of SwapTransactions.
   */
  getAll(userId: string): Promise<PaginatedResponse<SwapTransaction>>;
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
  create(userId: string, data: {
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
  getAll(userId: string, params?: {
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
  getOne(userId: string, orderId: string): Promise<QuidaxResponse<Order>>;
  /**
   * Cancels a pending or open order.
   *
   * @param userId - The unique ID of the user.
   * @param orderId - The unique ID of the order to cancel.
   * @returns A promise resolving to the canceled Order object.
   */
  cancel(userId: string, orderId: string): Promise<QuidaxResponse<Order>>;
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
 * const quidax = new Quidax({ secretKey: 's_your_secret_key' });
 * const me = await quidax.users.getParentAccount();
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
export { BaseClient, Currency, Deposit, DepositsModule, FeesModule, Market, MarketsModule, Order, OrderBook, OrdersModule, PaginatedResponse, PaginationMeta, PaymentAddress, Quidax, Quidax as default, QuidaxClientConfig, QuidaxError, QuidaxResponse, RampModule, SwapModule, SwapTransaction, Ticker, Trade, TradesModule, User, UsersModule, Wallet, WalletsModule, Withdrawal, WithdrawalsModule };