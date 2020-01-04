import Auth from "./Auth";
import Collection from "./Collection";
import { Filebase_TokenManager } from "./token/FilebaseToken";
import { Index } from "./indexer/indexManager";
declare type Props = {
    location: string;
};
export default class Database {
    private _location;
    private _meta;
    private _metaPath;
    private _stores;
    private _auth?;
    private _token;
    constructor(opts: Props);
    auth(): Auth;
    token(): Filebase_TokenManager;
    collection(name: string, opts?: {
        indexes?: (string | Index)[];
        autoIndexEnabled?: boolean;
    }): Collection;
    removeCollection(name: string): void;
    saveMeta: () => Promise<any>;
    getMeta(): {
        collections: Collection[];
        auth: {};
    };
    private _saveMeta;
    private createCollection;
    private startup;
}
export {};
