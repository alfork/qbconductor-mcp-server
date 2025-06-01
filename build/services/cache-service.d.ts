import NodeCache from 'node-cache';
export declare class CacheService {
    private cache;
    constructor();
    generateKey(endpoint: string, params: Record<string, any>, endUserId: string): string;
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T, ttl?: number): boolean;
    del(key: string): number;
    invalidatePattern(pattern: string): void;
    clear(): void;
    getStats(): NodeCache.Stats;
}
export declare const cacheService: CacheService;
//# sourceMappingURL=cache-service.d.ts.map