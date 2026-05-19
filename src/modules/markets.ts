import { BaseClient } from '../client';
import { QuidaxResponse } from '../types';

export interface Market {
  id: string;
  name: string;
  base_unit: string;
  quote_unit: string;
}

export interface Ticker {
  buy: string;
  sell: string;
  low: string;
  high: string;
  open: string;
  last: string;
  volume: string;
  vol: string;
}

export interface OrderBook {
  asks: [string, string][];
  bids: [string, string][];
}

export class MarketsModule {
  constructor(private client: BaseClient) {}

  /**
   * Retrieves a list of all active markets on Quidax.
   * 
   * @returns A promise resolving to an array of Market objects.
   */
  async getAll(): Promise<QuidaxResponse<Market[]>> {
    return (this.client as any).get('/markets');
  }

  /**
   * Retrieves tickers for all available markets.
   * 
   * @returns A promise resolving to a record mapping market pairs to their Ticker data.
   */
  async getTickers(): Promise<QuidaxResponse<Record<string, { ticker: Ticker; at: number }>>> {
    return (this.client as any).get('/markets/tickers');
  }

  /**
   * Retrieves the current ticker data for a specific market.
   * 
   * @param currency - The market pair (e.g., 'btcngn').
   * @returns A promise resolving to the Ticker data.
   */
  async getTicker(currency: string): Promise<QuidaxResponse<{ ticker: Ticker; at: number }>> {
    return (this.client as any).get(`/markets/tickers/${currency}`);
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
  async getKLine(market: string, params?: { limit?: number; period?: number; timestamp?: number }): Promise<QuidaxResponse<any[]>> {
    return (this.client as any).get(`/markets/${market}/k`, { params });
  }

  /**
   * Retrieves candlestick data including pending trades for a market.
   * 
   * @param currency - The market pair (e.g., 'btcngn').
   * @param tradeId - The ID of the pending trade reference.
   * @param params - Optional query parameters.
   * @returns A promise resolving to an array of k-line data points.
   */
  async getKLineWithPending(currency: string, tradeId: number, params?: { limit?: number; period?: number; timestamp?: number }): Promise<QuidaxResponse<any[]>> {
    return (this.client as any).get(`/markets/${currency}/k_with_pending_trades/${tradeId}`, { params });
  }

  /**
   * Retrieves the order book (asks and bids) for a specific market.
   * 
   * @param currency - The market pair (e.g., 'btcngn').
   * @param params - Optional query parameters to limit asks and bids.
   * @returns A promise resolving to the OrderBook object.
   */
  async getOrderBook(currency: string, params?: { asks_limit?: number; bids_limit?: number }): Promise<QuidaxResponse<OrderBook>> {
    return (this.client as any).get(`/markets/${currency}/order_book`, { params });
  }

  /**
   * Retrieves market depth data.
   * 
   * @param currency - The market pair (e.g., 'btcngn').
   * @param params - Optional limit parameter.
   * @returns A promise resolving to depth data.
   */
  async getDepth(currency: string, params?: { limit?: number }): Promise<QuidaxResponse<OrderBook>> {
    return (this.client as any).get(`/markets/${currency}/depth`, { params });
  }

  /**
   * Retrieves a high-level summary of all markets.
   * 
   * @returns A promise resolving to an array of market summaries.
   */
  async getSummary(): Promise<QuidaxResponse<any[]>> {
    return (this.client as any).get('/markets/summary/');
  }
}
