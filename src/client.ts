import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { QuidaxError } from './errors';

export interface QuidaxClientConfig {
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

export class BaseClient {
  protected httpClient: AxiosInstance;
  protected exchangeBaseURL: string;
  protected rampBaseURL: string;

  constructor(config: QuidaxClientConfig) {
    if (!config.secretKey) {
      throw new Error('Quidax secretKey is required.');
    }

    this.exchangeBaseURL = config.exchangeBaseURL || 'https://openapi.quidax.io/exchange-open-api/api/v1';
    this.rampBaseURL = config.rampBaseURL || 'https://ramp-be.quidax.io/api/v1';

    this.httpClient = axios.create({
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    this.httpClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError | Error) => {
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          const data: any = error.response.data || {};
          const quidaxStatus = data.status || 'error';
          const message = data.message || error.message;
          throw new QuidaxError(status, quidaxStatus, message, data.data || data.errors || data);
        }
        
        // Network errors or timeout
        if (axios.isAxiosError(error) && error.request) {
            throw new QuidaxError(0, 'network_error', error.message);
        }

        throw error;
      }
    );
  }

  private resolveURL(url: string, isRamp: boolean = false): string {
    const base = isRamp ? this.rampBaseURL : this.exchangeBaseURL;
    return `${base}${url}`;
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig & { isRamp?: boolean }): Promise<T> {
    const { isRamp, ...axiosConfig } = config || {};
    const response = await this.httpClient.get<T>(this.resolveURL(url, isRamp), axiosConfig);
    return response.data;
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig & { isRamp?: boolean }): Promise<T> {
    const { isRamp, ...axiosConfig } = config || {};
    const response = await this.httpClient.post<T>(this.resolveURL(url, isRamp), data, axiosConfig);
    return response.data;
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig & { isRamp?: boolean }): Promise<T> {
    const { isRamp, ...axiosConfig } = config || {};
    const response = await this.httpClient.put<T>(this.resolveURL(url, isRamp), data, axiosConfig);
    return response.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig & { isRamp?: boolean }): Promise<T> {
    const { isRamp, ...axiosConfig } = config || {};
    const response = await this.httpClient.delete<T>(this.resolveURL(url, isRamp), axiosConfig);
    return response.data;
  }
}
