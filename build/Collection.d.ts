import { QueryObject } from "./QueryObject";
import { Index } from "./indexer/indexManager";
export interface CollectionInterface {
    indexes?: (Index | string)[];
    autoIndexEnabled?: boolean;
    location: string;
}
export interface RecordInterface {
    id: string;
    [prop: string]: any;
}
export default class Collection {
    private _dbInstance;
    private _indexManager;
    private _path;
    constructor(props: CollectionInterface);
    close(): Promise<any>;
    open(): Promise<false | void>;
    get(id: string): Promise<RecordInterface>;
    getByKeys(keys: string[]): Promise<RecordInterface[]>;
    insert(object: {
        [prop: string]: any;
    }): Promise<string>;
    update(id: string, changes: {
        [prop: string]: any;
    }): Promise<unknown>;
    set(id: string, changes: any): Promise<any>;
    remove(id: string): Promise<any>;
    batch(opts: {
        inserts?: {
            id: string;
        }[];
        updates?: {
            id: string;
        }[];
        deletes?: {
            id: string;
        }[];
    }): Promise<any>;
    q(property?: string): QueryObject;
    createIndex(def: {
        property: string;
        type?: "regular" | "fulltext";
    }): import("./indexer/IndexValue").default | import("./indexer/IndexFulltext").default | undefined;
    removeIndex(property: string): Promise<boolean>;
    getMeta(): any;
    getIndexes(): {
        property: string;
        type: string;
    }[];
    data: () => Promise<FetchResult>;
    destroyCollection(): Promise<void>;
}
export declare type FetchResult = {
    keys: string[];
    docs: {
        id: string;
        [prop: string]: any;
    }[];
    errors: string[];
};
