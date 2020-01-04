import * as fs from "fs";
import Auth from "./Auth";
import metastore from "./internal/MetaStore";
import Collection from "./Collection";
import { Filebase_TokenManager } from "./token/FilebaseToken";
import { Index } from "./indexer/indexManager";

type Props = {
    location: string
}
export default class Database {

    private _location: string;
    private _meta: any = {};
    private _metaPath: string;
    private _stores: { [collection: string]: Collection } = {};

    private _auth?: Auth;
    private _token: Filebase_TokenManager;

    constructor(opts: Props) {

        if (!fs.existsSync(opts.location)) {
            fs.mkdirSync(opts.location);
        }

        this._location = opts.location;
        this._metaPath = opts.location + '/_meta';
        this._token = new Filebase_TokenManager({ path: opts.location });

        this.createCollection = this.createCollection.bind(this);
        this.saveMeta = this.saveMeta.bind(this);
        this.getMeta = this.getMeta.bind(this);

        this.startup.bind(this)();
    }

    auth(): Auth {
        if (!this._auth) {
            this._auth = new Auth({
                location: this._location + '/_auth',
                ...this._meta.auth
            })
        }
        return this._auth;
    }
    token(): Filebase_TokenManager {
        return this._token;
    }

    collection(name: string, opts?: {
        indexes?: (string | Index)[],
        autoIndexEnabled?: boolean,
    }): Collection {
        if (name in this._stores === false) {
            this._stores[name] = this.createCollection(name, opts);
        }
        return this._stores[name];
    }

    removeCollection(name: string) {
        this._stores[name].destroyCollection();
        delete this._stores[name];
    }

    saveMeta = this._saveMeta;

    getMeta() {
        let collections: Collection[] = [], meta;
        Object.keys(this._stores).forEach(store => {
            meta = this._stores[store].getMeta();
            meta.name = store;
            meta.indexes = this._stores[store].getIndexes()
            collections.push(meta);
        })

        return {
            collections,
            auth: this._auth ? this._auth.getMeta() : {}
        }
    }

    private _saveMeta(): Promise<any> {
        let meta = this.getMeta();
        return metastore.save(this._metaPath, meta);
    }

    private createCollection(name: string, opts?: {
        indexes?: (string | Index)[],
        autoIndexEnabled?: boolean,
    }) {
        if (name in this._stores === false) {
            this._stores[name] = new Collection({ location: this._location + '/' + name, ...opts });
        }
        
        return this._stores[name]
    }

    private async startup() {
        let meta = await metastore.get(this._metaPath);
        if (!meta) { return }

        this._meta = meta;

        if (meta.collections) {
            (meta.collections as any[]).forEach(info => {
                let { name, ...rest } = info;
                this._stores[name] = this.createCollection(name, rest);
            })
        }

        if (meta.auth) {
            this.auth();
        }
    }
}