import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { appConfig } from '../config.js';
import { logger } from '../logger.js';
import { cacheService } from './cache-service.js';

export interface ConductorApiResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface ConductorError {
  message: string;
  code?: string;
  details?: any;
}

export class ConductorClient {
  private client: AxiosInstance;
  private endUserId: string;

  constructor(endUserId?: string) {
    this.endUserId = endUserId || appConfig.conductor.defaultEndUserId;
    
    this.client = axios.create({
      baseURL: appConfig.conductor.apiBaseUrl,
      headers: {
        'Authorization': `Bearer ${appConfig.conductor.secretKey}`,
        'Content-Type': 'application/json',
        'Conductor-End-User-Id': this.endUserId,
      },
      timeout: 30000,
    });

    this.client.interceptors.request.use((config) => {
      logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        endUserId: this.endUserId,
      });
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`API Response: ${response.status} ${response.config.url}`, {
          dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'N/A',
        });
        return response;
      },
      (error) => {
        logger.error(`API Error: ${error.response?.status} ${error.config?.url}`, {
          message: error.response?.data?.message || error.message,
          endUserId: this.endUserId,
        });
        return Promise.reject(error);
      }
    );
  }

  async get<T>(
    endpoint: string,
    params: Record<string, any> = {},
    useCache: boolean = true
  ): Promise<ConductorApiResponse<T>> {
    const cacheKey = cacheService.generateKey(endpoint, params, this.endUserId);
    
    if (useCache) {
      const cached = cacheService.get<ConductorApiResponse<T>>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const response: AxiosResponse<ConductorApiResponse<T>> = await this.client.get(endpoint, { params });
      const result = response.data;
      
      if (useCache) {
        cacheService.set(cacheKey, result);
      }
      
      return result;
    } catch (error: any) {
      if (error.response?.status === 502) {
        logger.warn('QuickBooks Desktop connection error (502). Check QB connection.');
        throw new Error('QuickBooks Desktop is not connected or not responding. Please ensure QuickBooks is running and connected.');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your Conductor API credentials.');
      }
      
      if (error.response?.status === 403) {
        throw new Error(`Access denied for end-user: ${this.endUserId}. Please check permissions.`);
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Unknown API error');
    }
  }

  async post<T>(
    endpoint: string,
    data: any,
    invalidateCache: boolean = true
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(endpoint, data);
      
      if (invalidateCache) {
        cacheService.invalidatePattern(this.endUserId);
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 502) {
        throw new Error('QuickBooks Desktop is not connected or not responding. Please ensure QuickBooks is running and connected.');
      }
      
      if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'Invalid request data';
        throw new Error(`Validation error: ${message}`);
      }
      
      if (error.response?.status === 409) {
        throw new Error('Conflict error: The resource may have been modified by another process. Please refresh and try again.');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Unknown API error');
    }
  }

  async delete(
    endpoint: string,
    invalidateCache: boolean = true
  ): Promise<void> {
    try {
      await this.client.delete(endpoint);
      
      if (invalidateCache) {
        cacheService.invalidatePattern(this.endUserId);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Resource not found');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Unknown API error');
    }
  }

  async getAllPages<T>(
    endpoint: string,
    params: Record<string, any> = {},
    useCache: boolean = true
  ): Promise<T[]> {
    const allData: T[] = [];
    let cursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const requestParams = { ...params };
      if (cursor) {
        requestParams.cursor = cursor;
      }

      const response = await this.get<T>(endpoint, requestParams, useCache);
      allData.push(...response.data);
      
      hasMore = response.hasMore;
      cursor = response.nextCursor;
      
      if (hasMore && !cursor) {
        logger.warn('API indicates more data available but no cursor provided');
        break;
      }
    }

    logger.info(`Retrieved ${allData.length} total records from ${endpoint}`);
    return allData;
  }

  setEndUserId(endUserId: string): void {
    this.endUserId = endUserId;
    this.client.defaults.headers['Conductor-End-User-Id'] = endUserId;
  }

  getEndUserId(): string {
    return this.endUserId;
  }
}
