import { BaseClient, QuidaxClientConfig } from './client';
import { UsersModule } from './modules/users';
import { WalletsModule } from './modules/wallets';
import { WithdrawalsModule } from './modules/withdrawals';
import { MarketsModule } from './modules/markets';
import { TradesModule } from './modules/trades';
import { DepositsModule } from './modules/deposits';
import { SwapModule } from './modules/swap';
import { OrdersModule } from './modules/orders';
import { FeesModule } from './modules/fees';
import { RampModule } from './modules/ramp';

export * from './types';
export * from './errors';
export * from './client';
export * from './modules/users';
export * from './modules/wallets';
export * from './modules/withdrawals';
export * from './modules/markets';
export * from './modules/trades';
export * from './modules/deposits';
export * from './modules/swap';
export * from './modules/orders';
export * from './modules/fees';
export * from './modules/ramp';

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
export class Quidax {
  /**
   * Manage parent and sub-accounts.
   */
  public users: UsersModule;
  /**
   * Fetch wallets and manage cryptocurrency payment addresses.
   */
  public wallets: WalletsModule;
  /**
   * Process and track crypto withdrawals.
   */
  public withdrawals: WithdrawalsModule;
  /**
   * Access real-time market data, order books, and tickers.
   */
  public markets: MarketsModule;
  /**
   * View recent trades on the exchange.
   */
  public trades: TradesModule;
  /**
   * Track crypto deposits into user wallets.
   */
  public deposits: DepositsModule;
  /**
   * Process instant crypto-to-crypto swaps.
   */
  public swap: SwapModule;
  /**
   * Place, manage, and cancel limit and market orders.
   */
  public orders: OrdersModule;
  /**
   * Check current network fees for withdrawals.
   */
  public fees: FeesModule;
  /**
   * Access Fiat On-ramp and Off-ramp Custodial services.
   */
  public ramp: RampModule;

  private client: BaseClient;

  constructor(config: QuidaxClientConfig) {
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
}

export default Quidax;
