import fs from "fs";
import Database from "./Database";
import metastore from "./internal/MetaStore";
import DatabaseManager from ".";

import { Index } from "./indexer/indexManager";

export default class ProjectManager {

    private _projects: { [database: string]: DatabaseManager } = {};
    private location: string;
    private _metaPath: string;
    private _config: { setupCompleted: boolean } = { setupCompleted: true };

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

        this._metaPath = location + "/_meta";
        this._startup.bind(this)();

        console.log('\x1b[36m%s\x1b[0m', `Initiate a DatabaseManager instance at ${location}`);
    }

    get = (name: string): DatabaseManager => {

        return this._projects[name];
    }


    create(name: string, opts?: {
        name: string,
        indexes?: (string | Index)[],
        autoIndexEnabled?: boolean
    }[]): DatabaseManager {

        let db = this._projects[name];
        if (!db) {
            db = new DatabaseManager({ location: this.location + '/' + name });
            this._projects[name] = db;
        }

        return this._projects[name];
    }

    list() {
        let dbNames = Object.keys(this._projects);
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
            // _config: {
            //     setupCompleted: await this._token.count("server") !== 0
            // }
        };
        Object.keys(this._projects).forEach(db => {
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
            this._projects[name] = this.create(rest[name].name);
        });

        if (_config) { this._config = _config }
    }
}