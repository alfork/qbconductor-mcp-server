import NodeCache from 'node-cache';
import { appConfig } from '../config.js';
import { logger } from '../logger.js';
export class CacheService {
    cache;
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
    generateKey(endpoint, params, endUserId) {
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((result, key) => {
            result[key] = params[key];
            return result;
        }, {});
        return `${endUserId}:${endpoint}:${JSON.stringify(sortedParams)}`;
    }
    get(key) {
        const value = this.cache.get(key);
        if (value !== undefined) {
            logger.debug(`Cache HIT: ${key}`);
        }
        else {
            logger.debug(`Cache MISS: ${key}`);
        }
        return value;
    }
    set(key, value, ttl) {
        if (ttl !== undefined) {
            return this.cache.set(key, value, ttl);
        }
        return this.cache.set(key, value);
    }
    del(key) {
        return this.cache.del(key);
    }
    invalidatePattern(pattern) {
        const keys = this.cache.keys();
        const matchingKeys = keys.filter(key => key.includes(pattern));
        if (matchingKeys.length > 0) {
            this.cache.del(matchingKeys);
            logger.debug(`Cache INVALIDATED: ${matchingKeys.length} keys matching pattern "${pattern}"`);
        }
    }
    clear() {
        this.cache.flushAll();
        logger.debug('Cache CLEARED');
    }
    getStats() {
        return this.cache.getStats();
    }
}
export const cacheService = new CacheService();
//# sourceMappingURL=cache-service.js.map