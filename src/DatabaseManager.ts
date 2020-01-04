import fs from "fs";
import Database from "./Database";
import metastore from "./internal/MetaStore";
import { Filebase_TokenManager } from "./token/FilebaseToken";
import { Index } from "./indexer/indexManager";

export default class DatabaseManager {

    private databases: { [database: string]: Database } = {};
    private location: string;
    private _metaPath: string;
    private _config: { setupCompleted: boolean } = { setupCompleted: true };
    private _token: Filebase_TokenManager;

    constructor(props: { location: string }) {

        let location = props.location;
        if (location && location[location.length - 1] === '/') {
            location = location.substr(0, location.length - 1);
        }
        this.location = location;
        this.saveMeta = this.saveMeta.bind(this);
        this._saveMeta = this._saveMeta.bind(this);

        if (!fs.existsSync(location)) {
            fs.mkdirSync(location);
        }

        this._token = new Filebase_TokenManager({ path: location });
        this._metaPath = location + "/_meta";
        this._startup.bind(this)();

        console.log('\x1b[36m%s\x1b[0m', `Initiate a DatabaseManager instance at ${location}`);
    }

    token() {
        return this._token;
    }

    db = (name: string): Database => {

        // return this._getDB(name);
        return this.databases[name];
    }

    async createDB(name: string): Promise<Database> {
        if (name in this.databases) {
            throw Error(`Database has already exists`);
        }

        const db = new Database({ location: this.location + '/' + name });
        this.databases[name] = db;
        await this._saveMeta();

        return db;
    }

    create(name: string, opts?: {
        name: string,
        indexes?: (string | Index)[],
        autoIndexEnabled?: boolean
    }[]): Database {

        let db = this.databases[name];
        if (!db) {
            db = new Database({ location: this.location + '/' + name });
            this.databases[name] = db;
        }

        opts && opts.forEach(col => {
            let { name, indexes, autoIndexEnabled } = col;
            db.collection(name, { indexes, autoIndexEnabled })
        })

        return this.databases[name];
    }

    dbs() {
        let dbNames = Object.keys(this.databases);
        let dbs = new Array(dbNames.length);
        dbNames.forEach((name, i) => {
            dbs[i] = { name }
        })
        return dbs;
    }

    config(key: "setupComplete") {

        // @ts-ignore
        return this._config[key];
    }

    saveMeta = this._saveMeta;

    private async _saveMeta() {
        let dbs: any = {
            _config: {
                setupCompleted: await this._token.count("server") !== 0
            }
        };
        Object.keys(this.databases).forEach(db => {
            dbs[db] = { name: db }
        });
        await metastore.save(this._metaPath, dbs);
    }

    private async _startup() {

        let meta = await metastore.get(this._metaPath) as
            { _config: any, [db: string]: { name: string } } | undefined;

        if (!meta) return;
        const { _config, ...rest } = meta;

        Object.keys(rest).forEach(name => {
            this.databases[name] = this.create(rest[name].name);
        });

        if (_config) { this._config = _config }
    }
}