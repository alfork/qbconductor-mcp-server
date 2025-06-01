import NodeCache from 'node-cache';
import { appConfig } from '../config.js';
import { logger } from '../logger.js';

export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: appConfig.cache.ttlMinutes * 60,
      maxKeys: appConfig.cache.maxSize,
      useClones: false,
    });

    this.cache.on('set', (key, value) => {
      logger.debug(`Cache SET: ${key}`);
    });

    this.cache.on('expired', (key, value) => {
      logger.debug(`Cache EXPIRED: ${key}`);
    });
  }

  generateKey(endpoint: string, params: Record<string, any>, endUserId: string): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as Record<string, any>);

    return `${endUserId}:${endpoint}:${JSON.stringify(sortedParams)}`;
  }

  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    if (value !== undefined) {
      logger.debug(`Cache HIT: ${key}`);
    } else {
      logger.debug(`Cache MISS: ${key}`);
    }
    return value;
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    if (ttl !== undefined) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  invalidatePattern(pattern: string): void {
    const keys = this.cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    
    if (matchingKeys.length > 0) {
      this.cache.del(matchingKeys);
      logger.debug(`Cache INVALIDATED: ${matchingKeys.length} keys matching pattern "${pattern}"`);
    }
  }

  clear(): void {
    this.cache.flushAll();
    logger.debug('Cache CLEARED');
  }

  getStats() {
    return this.cache.getStats();
  }
}

export const cacheService = new CacheService();
