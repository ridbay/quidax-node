Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let axios = require("axios");
axios = __toESM(axios);
//#region src/errors.ts
var QuidaxError = class QuidaxError extends Error {
	statusCode;
	status;
	data;
	isQuidaxError = true;
	constructor(statusCode, status, message, data) {
		super(message);
		this.name = "QuidaxError";
		this.statusCode = statusCode;
		this.status = status;
		this.data = data;
		Object.setPrototypeOf(this, QuidaxError.prototype);
	}
};
//#endregion
//#region src/client.ts
var BaseClient = class {
	httpClient;
	exchangeBaseURL;
	rampBaseURL;
	constructor(config) {
		if (!config.secretKey) throw new Error("Quidax secretKey is required.");
		this.exchangeBaseURL = config.exchangeBaseURL || "https://openapi.quidax.io/exchange-open-api/api/v1";
		this.rampBaseURL = config.rampBaseURL || "https://ramp-be.quidax.io/api/v1";
		this.httpClient = axios.default.create({
			timeout: config.timeout || 3e4,
			headers: {
				"Authorization": `Bearer ${config.secretKey}`,
				"Content-Type": "application/json"
			}
		});
		this.httpClient.interceptors.response.use((response) => response, (error) => {
			if (axios.default.isAxiosError(error) && error.response) {
				const status = error.response.status;
				const data = error.response.data || {};
				throw new QuidaxError(status, data.status || "error", data.message || error.message, data.data || data.errors || data);
			}
			if (axios.default.isAxiosError(error) && error.request) throw new QuidaxError(0, "network_error", error.message);
			throw error;
		});
	}
	resolveURL(url, isRamp = false) {
		return `${isRamp ? this.rampBaseURL : this.exchangeBaseURL}${url}`;
	}
	async get(url, config) {
		const { isRamp, ...axiosConfig } = config || {};
		return (await this.httpClient.get(this.resolveURL(url, isRamp), axiosConfig)).data;
	}
	async post(url, data, config) {
		const { isRamp, ...axiosConfig } = config || {};
		return (await this.httpClient.post(this.resolveURL(url, isRamp), data, axiosConfig)).data;
	}
	async put(url, data, config) {
		const { isRamp, ...axiosConfig } = config || {};
		return (await this.httpClient.put(this.resolveURL(url, isRamp), data, axiosConfig)).data;
	}
	async delete(url, config) {
		const { isRamp, ...axiosConfig } = config || {};
		return (await this.httpClient.delete(this.resolveURL(url, isRamp), axiosConfig)).data;
	}
};
//#endregion
//#region src/modules/users.ts
var UsersModule = class {
	constructor(client) {
		this.client = client;
	}
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
	async create(data) {
		return this.client.post("/users", data);
	}
	/**
	* Fetches the parent (master) account tied to the authenticated secret key.
	* 
	* @returns A promise resolving to the Parent User object.
	*/
	async getParentAccount() {
		return this.client.get("/users/me");
	}
	/**
	* Edits the details of an existing sub-account.
	* 
	* @param userId - The unique ID or reference of the sub-account.
	* @param data - The data to update.
	* @returns A promise resolving to the updated User object.
	*/
	async edit(userId, data) {
		return this.client.put(`/users/${userId}`, data);
	}
	/**
	* Fetches all sub-accounts tied to the authenticated parent account.
	* 
	* @returns A promise resolving to a list of User objects.
	*/
	async getAll() {
		return this.client.get("/users");
	}
	/**
	* Fetches the detailed profile of a specific sub-account.
	* 
	* @param userId - The unique ID or reference of the sub-account.
	* @returns A promise resolving to the User object.
	* @throws {QuidaxError} If the user is not found.
	*/
	async getOne(userId) {
		return this.client.get(`/users/${userId}`);
	}
};
//#endregion
//#region src/modules/wallets.ts
var WalletsModule = class {
	constructor(client) {
		this.client = client;
	}
	/**
	* Fetches all wallets for a given user.
	*
	* @param userId - The unique ID of the user. 'me' can be used for the authenticated user.
	* @returns A promise resolving to an array of Wallet objects.
	*/
	async getAll(userId) {
		return this.client.get(`/users/${userId}/wallets`);
	}
	/**
	* Fetches a specific cryptocurrency wallet for a user.
	*
	* @param userId - The unique ID of the user.
	* @param currency - The cryptocurrency ticker (e.g., 'btc', 'usdt').
	* @returns A promise resolving to a single Wallet object.
	*/
	async getOne(userId, currency) {
		return this.client.get(`/users/${userId}/wallets/${currency}`);
	}
	/**
	* Fetches the default Payment Address for a specific user's wallet.
	*
	* @param userId - The unique ID of the user.
	* @param currency - The cryptocurrency ticker.
	* @returns A promise resolving to the primary PaymentAddress object.
	*/
	async getPaymentAddress(userId, currency) {
		return this.client.get(`/users/${userId}/wallets/${currency}/address`);
	}
	/**
	* Fetches all generated Payment Addresses for a specific user's wallet.
	*
	* @param userId - The unique ID of the user.
	* @param currency - The cryptocurrency ticker.
	* @returns A promise resolving to an array of PaymentAddress objects.
	*/
	async getAllPaymentAddresses(userId, currency) {
		return this.client.get(`/users/${userId}/wallets/${currency}/addresses`);
	}
	/**
	* Fetches a specific Payment Address by its ID.
	*
	* @param userId - The unique ID of the user.
	* @param currency - The cryptocurrency ticker.
	* @param addressId - The ID of the specific payment address.
	* @returns A promise resolving to the PaymentAddress object.
	*/
	async getPaymentAddressById(userId, currency, addressId) {
		return this.client.get(`/users/${userId}/wallets/${currency}/addresses/${addressId}`);
	}
	/**
	* Generates a new Payment Address for a cryptocurrency wallet.
	*
	* @param userId - The unique ID of the user.
	* @param currency - The cryptocurrency ticker (e.g., 'btc', 'eth').
	* @returns A promise resolving to the newly generated PaymentAddress object.
	*/
	async createPaymentAddress(userId, currency, network) {
		return this.client.post(`/users/${userId}/wallets/${currency}/addresses?network=${network}`);
	}
};
//#endregion
//#region src/modules/withdrawals.ts
var WithdrawalsModule = class {
	constructor(client) {
		this.client = client;
	}
	/**
	* Fetches a paginated list of all withdrawals for a user.
	*
	* @param userId - The unique ID of the user.
	* @returns A promise resolving to a paginated list of Withdrawal objects.
	*/
	async getAll(userId) {
		return this.client.get(`/users/${userId}/withdraws`);
	}
	/**
	* Fetches the details of a specific withdrawal.
	*
	* @param userId - The unique ID of the user.
	* @param withdrawalId - The ID of the withdrawal to retrieve.
	* @returns A promise resolving to a single Withdrawal object.
	*/
	async getOne(userId, withdrawalId) {
		return this.client.get(`/users/${userId}/withdraws/${withdrawalId}`);
	}
	/**
	* Fetches a withdrawal by its unique reference string.
	*
	* @param userId - The unique ID of the user.
	* @param reference - The withdrawal reference string.
	* @returns A promise resolving to a single Withdrawal object.
	*/
	async getByReference(userId, reference) {
		return this.client.get(`/users/${userId}/withdraws/reference/${reference}`);
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
	* @param data.reference - The withdrawal reference string.
	* @param data.narration - Optional narration for the transaction.
	* @param data.network - Required only for some blockchain withdrawals.
	* @returns A promise resolving to the created Withdrawal object.
	*/
	async create(userId, data) {
		return this.client.post(`/users/${userId}/withdraws`, data);
	}
	/**
	* Initiates a new ngn withdrawal to merchant.
	*
	* @param userId - The unique ID of the user.
	* @param amount - The amount to withdraw.
	* @param merchantId - The ID of the merchant.
	* @param reference - The withdrawal reference string.
	* @returns A promise resolving to the created Withdrawal object.
	*/
	async ngn_to_merchant(userId, amount, merchantId, reference) {
		const payload = {
			currency: "ngn",
			amount,
			fund_uid: merchantId,
			reference,
			narration: `NGN ${amount} withdrawal from user`,
			transaction_note: `NGN ${amount} withdrawal to merchant`
		};
		return this.client.post(`/users/${userId}/withdraws`, payload);
	}
	/**
	* Cancels a pending withdrawal.
	*
	* @param userId - The unique ID of the user.
	* @param withdrawalId - The ID of the withdrawal to cancel.
	* @returns A promise resolving to the canceled Withdrawal object.
	*/
	async cancel(userId, withdrawalId) {
		return this.client.post(`/users/${userId}/withdraws/${withdrawalId}/cancel`);
	}
};
//#endregion
//#region src/modules/markets.ts
var MarketsModule = class {
	constructor(client) {
		this.client = client;
	}
	/**
	* Retrieves a list of all active markets on Quidax.
	* 
	* @returns A promise resolving to an array of Market objects.
	*/
	async getAll() {
		return this.client.get("/markets");
	}
	/**
	* Retrieves tickers for all available markets.
	* 
	* @returns A promise resolving to a record mapping market pairs to their Ticker data.
	*/
	async getTickers() {
		return this.client.get("/markets/tickers");
	}
	/**
	* Retrieves the current ticker data for a specific market.
	* 
	* @param currency - The market pair (e.g., 'btcngn').
	* @returns A promise resolving to the Ticker data.
	*/
	async getTicker(currency) {
		return this.client.get(`/markets/tickers/${currency}`);
	}
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
	async getKLine(market, params) {
		return this.client.get(`/markets/${market}/k`, { params });
	}
	/**
	* Retrieves candlestick data including pending trades for a market.
	* 
	* @param currency - The market pair (e.g., 'btcngn').
	* @param tradeId - The ID of the pending trade reference.
	* @param params - Optional query parameters.
	* @returns A promise resolving to an array of k-line data points.
	*/
	async getKLineWithPending(currency, tradeId, params) {
		return this.client.get(`/markets/${currency}/k_with_pending_trades/${tradeId}`, { params });
	}
	/**
	* Retrieves the order book (asks and bids) for a specific market.
	* 
	* @param currency - The market pair (e.g., 'btcngn').
	* @param params - Optional query parameters to limit asks and bids.
	* @returns A promise resolving to the OrderBook object.
	*/
	async getOrderBook(currency, params) {
		return this.client.get(`/markets/${currency}/order_book`, { params });
	}
	/**
	* Retrieves market depth data.
	* 
	* @param currency - The market pair (e.g., 'btcngn').
	* @param params - Optional limit parameter.
	* @returns A promise resolving to depth data.
	*/
	async getDepth(currency, params) {
		return this.client.get(`/markets/${currency}/depth`, { params });
	}
	/**
	* Retrieves a high-level summary of all markets.
	* 
	* @returns A promise resolving to an array of market summaries.
	*/
	async getSummary() {
		return this.client.get("/markets/summary/");
	}
};
//#endregion
//#region src/modules/trades.ts
var TradesModule = class {
	constructor(client) {
		this.client = client;
	}
	/**
	* Fetches the user's historical trades.
	* 
	* @param userId - The unique ID of the user.
	* @returns A promise resolving to a paginated list of Trade objects.
	*/
	async getUserTrades(userId) {
		return this.client.get(`/users/${userId}/trades`);
	}
	/**
	* Fetches recent trades for a given market pair.
	* 
	* @param marketPair - The market pair (e.g., 'btcngn').
	* @returns A promise resolving to an array of Trade objects.
	*/
	async getMarketTrades(marketPair) {
		return this.client.get(`/trades/${marketPair}`);
	}
};
//#endregion
//#region src/modules/deposits.ts
var DepositsModule = class {
	constructor(client) {
		this.client = client;
	}
	/**
	* Fetches all cryptocurrency deposits for a specific user.
	* 
	* @param userId - The unique ID of the user.
	* @param params - Optional filters (state, currency).
	* @returns A promise resolving to a paginated list of Deposit objects.
	*/
	async getAll(userId, params) {
		return this.client.get(`/users/${userId}/deposits`, { params });
	}
	/**
	* Fetches the details of a specific deposit by ID.
	* 
	* @param userId - The unique ID of the user.
	* @param depositId - The unique ID of the deposit.
	* @returns A promise resolving to a single Deposit object.
	*/
	async getOne(userId, depositId) {
		return this.client.get(`/users/${userId}/deposits/${depositId}`);
	}
	/**
	* Fetches deposits made by all sub-users across the platform.
	* 
	* @param params - Optional filters (state, currency).
	* @returns A promise resolving to a paginated list of Deposit objects.
	*/
	async getSubUsersDeposits(params) {
		return this.client.get("/users/deposits/all", { params });
	}
};
//#endregion
//#region src/modules/swap.ts
var SwapModule = class {
	constructor(client) {
		this.client = client;
	}
	/**
	* Generates a temporary swap quotation for previewing a swap before creation.
	*
	* @param userId - The unique ID of the user.
	* @param data - The swap quotation parameters.
	* @returns A promise resolving to the temporary swap quotation details.
	*/
	async getQuotation(userId, data) {
		return this.client.post(`/users/${userId}/temporary_swap_quotation`, data);
	}
	/**
	* Creates an Instant Swap quotation linked to the user account.
	*
	* @param userId - The unique ID of the user.
	* @param data - The swap creation payload.
	* @returns A promise resolving to a SwapTransaction object in an unconfirmed state.
	*/
	async create(userId, data) {
		return this.client.post(`/users/${userId}/swap_quotation`, data);
	}
	/**
	* Confirms a previously created Instant Swap quotation.
	*
	* @param userId - The unique ID of the user.
	* @param quotationId - The ID of the swap quotation to confirm.
	* @returns A promise resolving to the confirmed SwapTransaction.
	*/
	async confirm(userId, quotationId) {
		return this.client.post(`/users/${userId}/swap_quotation/${quotationId}/confirm`);
	}
	/**
	* Refreshes an expired Instant Swap quotation to get updated market rates.
	*
	* @param userId - The unique ID of the user.
	* @param quotationId - The ID of the expired swap quotation.
	* @returns A promise resolving to the refreshed SwapTransaction.
	*/
	async refresh(userId, quotationId) {
		return this.client.post(`/users/${userId}/swap_quotation/${quotationId}/refresh`);
	}
	/**
	* Fetches the details of a specific Swap Transaction.
	*
	* @param userId - The unique ID of the user.
	* @param swapTransactionId - The ID of the swap transaction.
	* @returns A promise resolving to the SwapTransaction details.
	*/
	async getOne(userId, swapTransactionId) {
		return this.client.get(`/users/${userId}/swap_transactions/${swapTransactionId}`);
	}
	/**
	* Retrieves a paginated list of all swap transactions for a user.
	*
	* @param userId - The unique ID of the user.
	* @returns A promise resolving to a paginated list of SwapTransactions.
	*/
	async getAll(userId) {
		return this.client.get(`/users/${userId}/swap_transactions`);
	}
};
//#endregion
//#region src/modules/orders.ts
var OrdersModule = class {
	constructor(client) {
		this.client = client;
	}
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
	async create(userId, data) {
		return this.client.post(`/users/${userId}/orders`, data);
	}
	/**
	* Fetches a paginated list of all orders (buy/sell) for a user.
	* 
	* @param userId - The unique ID of the user.
	* @param params - Optional filters (market, state, order_by).
	* @returns A promise resolving to a paginated list of Order objects.
	*/
	async getAll(userId, params) {
		return this.client.get(`/users/${userId}/orders`, { params });
	}
	/**
	* Fetches the details of a specific order.
	* 
	* @param userId - The unique ID of the user.
	* @param orderId - The unique ID of the order.
	* @returns A promise resolving to a single Order object.
	*/
	async getOne(userId, orderId) {
		return this.client.get(`/users/${userId}/orders/${orderId}`);
	}
	/**
	* Cancels a pending or open order.
	* 
	* @param userId - The unique ID of the user.
	* @param orderId - The unique ID of the order to cancel.
	* @returns A promise resolving to the canceled Order object.
	*/
	async cancel(userId, orderId) {
		return this.client.post(`/users/${userId}/orders/${orderId}/cancel`);
	}
};
//#endregion
//#region src/modules/fees.ts
var FeesModule = class {
	constructor(client) {
		this.client = client;
	}
	/**
	* Fetches the current withdrawal fees for all supported cryptocurrencies.
	* 
	* @returns A promise resolving to an array of fee information objects.
	*/
	async getCryptoWithdrawalFees() {
		return this.client.get(`/fee`);
	}
};
//#endregion
//#region src/modules/ramp.ts
var RampModule = class {
	constructor(client) {
		this.client = client;
	}
	/**
	* Fetches available payment methods for Fiat On-ramp or Off-ramp.
	* 
	* @returns A promise resolving to the supported payment methods.
	*/
	async getPaymentMethods() {
		return this.client.get("/merchants/payment_methods", { isRamp: true });
	}
	/**
	* Fetches the minimum and maximum purchase limits for buying cryptocurrency (On-ramp).
	* 
	* @returns A promise resolving to the buy limits.
	*/
	async getBuyLimits() {
		return this.client.get("/merchants/purchase_limits/buy", { isRamp: true });
	}
	/**
	* Fetches the minimum and maximum purchase limits for selling cryptocurrency (Off-ramp).
	* 
	* @returns A promise resolving to the sell limits.
	*/
	async getSellLimits() {
		return this.client.get("/merchants/purchase_limits/sell", { isRamp: true });
	}
	/**
	* Generates a purchase quote for buying cryptocurrency with fiat.
	* 
	* @param params - The quote parameters (e.g., fiat, crypto, amount).
	* @returns A promise resolving to the buy quote details.
	*/
	async getBuyQuote(params) {
		return this.client.get("/merchants/purchase_quotes/buy", {
			params,
			isRamp: true
		});
	}
	/**
	* Generates a purchase quote for selling cryptocurrency for fiat.
	* 
	* @param params - The quote parameters.
	* @returns A promise resolving to the sell quote details.
	*/
	async getSellQuote(params) {
		return this.client.get("/merchants/purchase_quotes/sell", {
			params,
			isRamp: true
		});
	}
	/**
	* Fetches the details of an existing Off-ramp transaction (Crypto -> Fiat).
	* 
	* @param reference - The unique reference of the transaction.
	* @returns A promise resolving to the transaction details.
	*/
	async getOffRampTransaction(reference) {
		return this.client.get(`/merchants/off_ramp_transaction/${reference}`, { isRamp: true });
	}
	/**
	* Fetches the details of an existing On-ramp transaction (Fiat -> Crypto).
	* 
	* @param reference - The unique reference of the transaction.
	* @returns A promise resolving to the transaction details.
	*/
	async getOnRampTransaction(reference) {
		return this.client.get(`/merchants/on_ramp_transaction/${reference}`, { isRamp: true });
	}
	/**
	* Initiates a new Custodial On-ramp transaction (Fiat -> Crypto).
	* 
	* @param data - The transaction initiation payload.
	* @returns A promise resolving to the created transaction.
	*/
	async initiateOnRamp(data) {
		return this.client.post("/merchants/custodial/on_ramp_transactions/initiate", data, { isRamp: true });
	}
	/**
	* Confirms a previously initiated Custodial On-ramp transaction.
	* 
	* @param reference - The reference of the transaction.
	* @param data - Optional confirmation payload.
	* @returns A promise resolving to the confirmed transaction.
	*/
	async confirmOnRamp(reference, data) {
		return this.client.post(`/merchants/custodial/on_ramp_transactions/${reference}/confirm`, data, { isRamp: true });
	}
	/**
	* Initiates a new Custodial Off-ramp transaction (Crypto -> Fiat).
	* 
	* @param data - The transaction initiation payload.
	* @returns A promise resolving to the created transaction.
	*/
	async initiateOffRamp(data) {
		return this.client.post("/merchants/custodial/off_ramp_transactions/initiate", data, { isRamp: true });
	}
	/**
	* Confirms a previously initiated Custodial Off-ramp transaction.
	* 
	* @param reference - The reference of the transaction.
	* @param data - Optional confirmation payload.
	* @returns A promise resolving to the confirmed transaction.
	*/
	async confirmOffRamp(reference, data) {
		return this.client.post(`/merchants/custodial/off_ramp_transactions/${reference}/confirm`, data, { isRamp: true });
	}
	/**
	* Fetches supported banks for Fiat Off-ramp withdrawals.
	* 
	* @returns A promise resolving to the list of supported banks.
	*/
	async getBanks() {
		return this.client.get("/merchants/custodial/banks", { isRamp: true });
	}
	/**
	* Adds a bank account to a specific Off-ramp transaction.
	* 
	* @param reference - The reference of the Off-ramp transaction.
	* @param data - The bank account details.
	* @returns A promise resolving to the updated transaction.
	*/
	async addBankAccount(reference, data) {
		return this.client.post(`/merchants/custodial/off_ramp_transactions/${reference}/bank_account`, data, { isRamp: true });
	}
};
//#endregion
//#region src/index.ts
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
var Quidax = class {
	/**
	* Manage parent and sub-accounts.
	*/
	users;
	/**
	* Fetch wallets and manage cryptocurrency payment addresses.
	*/
	wallets;
	/**
	* Process and track crypto withdrawals.
	*/
	withdrawals;
	/**
	* Access real-time market data, order books, and tickers.
	*/
	markets;
	/**
	* View recent trades on the exchange.
	*/
	trades;
	/**
	* Track crypto deposits into user wallets.
	*/
	deposits;
	/**
	* Process instant crypto-to-crypto swaps.
	*/
	swap;
	/**
	* Place, manage, and cancel limit and market orders.
	*/
	orders;
	/**
	* Check current network fees for withdrawals.
	*/
	fees;
	/**
	* Access Fiat On-ramp and Off-ramp Custodial services.
	*/
	ramp;
	client;
	constructor(config) {
		this.client = new BaseClient(config);
		this.users = new UsersModule(this.client);
		this.wallets = new WalletsModule(this.client);
		this.withdrawals = new WithdrawalsModule(this.client);
		this.markets = new MarketsModule(this.client);
		this.trades = new TradesModule(this.client);
		this.deposits = new DepositsModule(this.client);
		this.swap = new SwapModule(this.client);
		this.orders = new OrdersModule(this.client);
		this.fees = new FeesModule(this.client);
		this.ramp = new RampModule(this.client);
	}
};
//#endregion
exports.BaseClient = BaseClient;
exports.DepositsModule = DepositsModule;
exports.FeesModule = FeesModule;
exports.MarketsModule = MarketsModule;
exports.OrdersModule = OrdersModule;
exports.Quidax = Quidax;
exports.default = Quidax;
exports.QuidaxError = QuidaxError;
exports.RampModule = RampModule;
exports.SwapModule = SwapModule;
exports.TradesModule = TradesModule;
exports.UsersModule = UsersModule;
exports.WalletsModule = WalletsModule;
exports.WithdrawalsModule = WithdrawalsModule;
