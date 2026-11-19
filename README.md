# Quidax Node.js SDK

A fully-typed, robust Node.js SDK for the [Quidax v3.0 API](https://docs.quidax.io/v3.0/reference). This SDK seamlessly integrates with both the Quidax Exchange APIs and the Quidax Ramp/Custodial APIs.

## Installation

```bash
npm install quidax-node
```

## Initialization

Initialize the Quidax client with your **API key**:

```typescript
import { Quidax } from 'quidax-node';

const quidax = new Quidax({
  apiKey: 'your_quidax_api_key' // Keep this secure!
});
```

> **Quidax 3.0:** Generate new API keys in the Quidax 3.0 web app under **My Account → API Management**. IP whitelisting is mandatory, so add your server's IP when you create the key. Pass the **API key**, not the secret key. The `secretKey` option still works but is deprecated.

### Advanced Configuration
You can optionally pass custom Base URLs or adjust the timeout limit (default is 30,000ms).

```typescript
const quidax = new Quidax({
  apiKey: 'your_quidax_api_key',
  exchangeBaseURL: 'https://openapi.quidax.io/exchange-open-api/api/v1',
  rampBaseURL: 'https://ramp-be.quidax.io/api/v1',
  timeout: 10000 
});
```

## Usage Examples

The SDK is organized into intuitive, feature-based modules. 

### 1. User Accounts
Manage parent and sub-accounts.
```typescript
// Fetch parent account details
const parentAccount = await quidax.users.getMe();

// Create a sub-account
const subAccount = await quidax.users.createSubAccount({
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe'
});
```

### 2. Wallets & Addresses
Manage cryptocurrency wallets and generate payment addresses.
```typescript
// Fetch all wallets for a specific user (each wallet lists its supported `networks`)
const wallets = await quidax.wallets.listWallets('user_id');

// Generate a payment address. The network is required in v3.0 and the address is returned immediately.
const btcAddress = await quidax.wallets.createPaymentAddress('user_id', 'btc', 'bitcoin');
const usdtAddress = await quidax.wallets.createPaymentAddress('user_id', 'usdt', 'trc20');
```

### 3. Markets & Tickers
Get real-time market data.
```typescript
// Get order book for a specific market pair (e.g. BTC to NGN)
const orderBook = await quidax.markets.getOrderBook('btcngn');

// Get a specific market ticker
const ticker = await quidax.markets.getTicker('btcngn');
```

### 4. Withdrawals & Deposits
Track deposits and process withdrawals.
```typescript
// Fetch all deposits for a user
const deposits = await quidax.deposits.listDeposits('user_id');

// Process a crypto withdrawal. `reference` is required in v3.0.
const reference = 'wd_' + Date.now();
try {
  const withdrawal = await quidax.withdrawals.createWithdrawal('user_id', {
      currency: 'usdt',
      amount: '50',
      fund_uid: 'destination_address_or_sub_user_id',
      network: 'trc20',
      reference,
  });
} catch (error) {
  // The withdrawal may already have been processed. Check by reference
  // before retrying, to avoid a double debit.
  const existing = await quidax.withdrawals.getWithdrawalByReference('user_id', reference);
}
```

> **Webhooks:** Quidax recommends re-querying the transaction after you receive a webhook and treating the API response as the source of truth. Use `deposits.getDeposit`, `swap.getSwapTransaction` and `withdrawals.getWithdrawalByReference`.

### 5. Instant Swaps
Process crypto-to-crypto instant swaps.
```typescript
// Preview a swap (temporary quotation)
const preview = await quidax.swap.previewQuotation('user_id', {
    from_currency: 'btc',
    to_currency: 'usdt',
    from_amount: '0.01',
});

// Create the swap quotation (provide either from_amount or to_amount, not both)
const quotation = await quidax.swap.createQuotation('user_id', {
    from_currency: 'btc',
    to_currency: 'usdt',
    from_amount: '0.01',
});

// Confirm the quotation
const swap = await quidax.swap.confirmQuotation('user_id', quotation.data.id);

// Status is 'initiated' | 'completed' | 'failed' ('failed' is new in v3.0)
if (swap.data.status === 'failed') { /* handle failure */ }

// Refresh a quotation. In v3.0 this only works if it has expired or the value changed.
await quidax.swap.refreshQuotation('user_id', quotation.data.id, { from_amount: '0.02' });
```

### 6. Ramp & Custodial
Interact with the fiat on-ramp and off-ramp services.
```typescript
// Get available payment methods
const methods = await quidax.ramp.getPaymentMethods();

// Get a Buy Quote (Fiat to Crypto)
const quote = await quidax.ramp.getBuyQuote({
  fiat: 'ngn',
  crypto: 'usdt',
  amount: '50000'
});
```

## Migrating from 3.x to 4.0

**v4.0.0 is a breaking release.** Method names now say which resource they act on, and they all use the same verbs (`list`, `get`, `create`, `update`, `cancel`, `confirm`). The old names have been **removed**, so rename your calls using the table below.

| Module | Old name | New name |
| --- | --- | --- |
| `users` | `getParentAccount` | `getMe` |
| `users` | `getAll` | `listSubAccounts` |
| `users` | `getOne` | `getSubAccount` |
| `users` | `create` | `createSubAccount` |
| `users` | `edit` | `updateSubAccount` |
| `wallets` | `getAll` | `listWallets` |
| `wallets` | `getOne` | `getWallet` |
| `wallets` | `getAllPaymentAddresses` | `listPaymentAddresses` |
| `deposits` | `getAll` | `listDeposits` |
| `deposits` | `getOne` | `getDeposit` |
| `deposits` | `getSubUsersDeposits` | `listSubAccountDeposits` |
| `withdrawals` | `getAll` | `listWithdrawals` |
| `withdrawals` | `getOne` | `getWithdrawal` |
| `withdrawals` | `getByReference` | `getWithdrawalByReference` |
| `withdrawals` | `create` | `createWithdrawal` |
| `withdrawals` | `ngn_to_merchant` | `createNgnMerchantWithdrawal` |
| `withdrawals` | `cancel` | `cancelWithdrawal` |
| `orders` | `getAll` | `listOrders` |
| `orders` | `getOne` | `getOrder` |
| `orders` | `create` | `createOrder` |
| `orders` | `cancel` | `cancelOrder` |
| `swap` | `getQuotation` | `previewQuotation` |
| `swap` | `create` | `createQuotation` |
| `swap` | `confirm` | `confirmQuotation` |
| `swap` | `refresh` | `refreshQuotation` |
| `swap` | `getOne` | `getSwapTransaction` |
| `swap` | `getAll` | `listSwapTransactions` |
| `markets` | `getAll` | `listMarkets` |
| `markets` | `getKLine` | `getCandles` |
| `markets` | `getKLineWithPending` | `getCandlesWithPendingTrades` |
| `trades` | `getUserTrades` | `listUserTrades` |
| `trades` | `getMarketTrades` | `listMarketTrades` |

Arguments and return types have not changed. `ramp` and `fees` are unchanged.

## Error Handling

This SDK features a gracefully integrated error handling system. Instead of fighting with raw HTTP exceptions or nested Axios errors, the SDK automatically parses the payload returned by Quidax and throws a strongly-typed `QuidaxError`.

```typescript
import { Quidax, QuidaxError } from 'quidax-node';

async function processPayment() {
  try {
    const address = await quidax.wallets.createPaymentAddress('invalid_user', 'btc', 'bitcoin');
  } catch (error) {
    if (error instanceof QuidaxError) {
      console.error(`HTTP Status: ${error.statusCode}`); // e.g., 400 or 401
      console.error(`Quidax Status: ${error.status}`);   // e.g., "error" or "failed"
      console.error(`Message: ${error.message}`);        // e.g., "Validation failed"
      
      // If Quidax sends specific field validation errors, they will be here:
      console.error(`Validation Details:`, error.data);  
    } else {
      // Handle generic errors (e.g., network failure, timeouts)
      console.error('An unexpected error occurred:', error);
    }
  }
}
```

## TypeScript Support

This project is written entirely in **TypeScript** and compiled using `tsdown`. 
- It natively supports both **CommonJS** (`require`) and **ESModules** (`import`).
- It ships with comprehensive `.d.ts` type definitions out of the box, meaning you get full autocomplete for standard types like `Wallet`, `PaymentAddress`, `Trade`, `Order`, etc.

## License
ISC
