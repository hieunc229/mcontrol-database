import { LevelUp } from "levelup";
import { FetchResult } from "./Collection";
export declare class QueryObject {
    __store: LevelUp;
    __opts: {
        gt?: string | number;
        lt?: string | number;
        gte?: string | number;
        lte?: string | number;
        start?: string | number;
        end?: string | number;
        arrayContains?: string | number;
        limit?: number;
    };
    __eq?: {
        gte?: string;
        lte?: string;
    };
    __prop: string;
    constructor(indexStore: LevelUp);
    range(opts: {
        start?: string | number;
        end?: string | number;
    }): QueryObject;
    filter(opts: {
        gt?: string | number;
        lt?: string | number;
        gte?: string | number;
        lte?: string | number;
    }): QueryObject;
    eq(value: string | number | boolean): QueryObject;
    arrayContains(value: string | number): QueryObject;
    limit(number: number): QueryObject;
    get: (_opts?: {
        values: boolean;
    } | undefined) => Promise<FetchResult>;
}
