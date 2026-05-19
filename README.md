# Quidax Node.js SDK

A fully-typed, robust Node.js SDK for the [Quidax v3.0 API](https://docs.quidax.io/v3.0/reference). This SDK seamlessly integrates with both the Quidax Exchange APIs and the Quidax Ramp/Custodial APIs.

## Installation

```bash
npm install quidax-node
```

## Initialization

Initialize the Quidax client with your Secret Key:

```typescript
import { Quidax } from 'quidax-node';

const quidax = new Quidax({
  secretKey: 's_your_quidax_secret_key' // Keep this secure!
});
```

### Advanced Configuration
You can optionally pass custom Base URLs or adjust the timeout limit (default is 30,000ms).

```typescript
const quidax = new Quidax({
  secretKey: 's_your_quidax_secret_key',
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
const parentAccount = await quidax.users.getParentAccount();

// Create a sub-account
const subAccount = await quidax.users.create({
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe'
});
```

### 2. Wallets & Addresses
Manage cryptocurrency wallets and generate payment addresses.
```typescript
// Fetch all wallets for a specific user
const wallets = await quidax.wallets.getAll('user_id');

// Generate a payment address for a specific currency
const address = await quidax.wallets.createPaymentAddress('user_id', 'btc');
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
const deposits = await quidax.deposits.getAll('user_id');

// Process a crypto withdrawal
const withdrawal = await quidax.withdrawals.create('user_id', {
    currency: 'btc',
    amount: '0.5',
    fund_uid: 'fund_id_here'
});
```

### 5. Instant Swaps
Process crypto-to-crypto instant swaps.
```typescript
// Generate a swap quotation
const quotation = await quidax.swap.getQuotation('user_id', {
    source_currency: 'btc',
    destination_currency: 'usdt',
    amount: '1.5',
    type: 'source'
});

// Confirm the quotation
const swap = await quidax.swap.confirm('user_id', 'quotation_id_here');
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

## Error Handling

This SDK features a gracefully integrated error handling system. Instead of fighting with raw HTTP exceptions or nested Axios errors, the SDK automatically parses the payload returned by Quidax and throws a strongly-typed `QuidaxError`.

```typescript
import { Quidax, QuidaxError } from 'quidax-node';

async function processPayment() {
  try {
    const address = await quidax.wallets.createPaymentAddress('invalid_user', 'btc');
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

This project is written entirely in **TypeScript** and compiled using `tsup`. 
- It natively supports both **CommonJS** (`require`) and **ESModules** (`import`).
- It ships with comprehensive `.d.ts` type definitions out of the box, meaning you get full autocomplete for standard types like `Wallet`, `PaymentAddress`, `Trade`, `Order`, etc.

## License
MIT
