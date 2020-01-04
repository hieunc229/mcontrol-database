import Database from "./Database";
import { Filebase_TokenManager } from "./token/FilebaseToken";
import { Index } from "./indexer/indexManager";
export default class DatabaseManager {
    private databases;
    private location;
    private _metaPath;
    private _config;
    private _token;
    constructor(props: {
        location: string;
    });
    token(): Filebase_TokenManager;
    db: (name: string) => Database;
    createDB(name: string): Promise<Database>;
    create(name: string, opts?: {
        name: string;
        indexes?: (string | Index)[];
        autoIndexEnabled?: boolean;
    }[]): Database;
    dbs(): any[];
    config(key: "setupComplete"): any;
    saveMeta: () => Promise<void>;
    private _saveMeta;
    private _startup;
}
