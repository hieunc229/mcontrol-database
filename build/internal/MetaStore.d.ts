export declare function save(path: string, data: any): Promise<void>;
export declare function load(path: string): Promise<any>;
declare const metastore: {
    save: typeof save;
    load: typeof load;
    get: typeof load;
};
export default metastore;
