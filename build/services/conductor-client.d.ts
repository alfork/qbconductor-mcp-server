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
export declare class ConductorClient {
    private client;
    private endUserId;
    constructor(endUserId?: string);
    get<T>(endpoint: string, params?: Record<string, any>, useCache?: boolean): Promise<ConductorApiResponse<T>>;
    post<T>(endpoint: string, data: any, invalidateCache?: boolean): Promise<T>;
    delete(endpoint: string, invalidateCache?: boolean): Promise<void>;
    getAllPages<T>(endpoint: string, params?: Record<string, any>, useCache?: boolean): Promise<T[]>;
    setEndUserId(endUserId: string): void;
    getEndUserId(): string;
}
//# sourceMappingURL=conductor-client.d.ts.map