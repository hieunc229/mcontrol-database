import shortid from "shortid";
import IndexManager from "./indexer";
import * as fs from "fs";

import { LevelUp } from "levelup";
import { QueryObject } from "./QueryObject";
import { createStore } from "./internal/createStore";
import { deleteDirRecursive } from "./internal/recursiveRemoveDir";
import { Index } from "./indexer/indexManager";

const iteratorStream = require('level-iterator-stream');

export interface CollectionInterface {
    indexes?: (Index | string)[],
    autoIndexEnabled?: boolean,
    location: string
}

export interface RecordInterface {
    id: string, [prop: string]: any
}

export default class Collection {

    private _dbInstance: LevelUp;
    private _indexManager: IndexManager;
    private _path: string;

    constructor(props: CollectionInterface) {

        this._path = props.location;
        this.createIndex = this.createIndex.bind(this);
        this.insert = this.insert.bind(this);
        this.getMeta = this.getMeta.bind(this);

        if (!fs.existsSync(props.location)) {
            fs.mkdirSync(props.location);
        }
        this._dbInstance = createStore(props.location + '/store');

        this._indexManager = new IndexManager({
            path: props.location,
            indexes: props.indexes && props.indexes.map((id: string | Index) => {
                if (typeof id === "string")
                    return { property: id, type: 'regular' };
                return id
            })
        });
    }

    close(): Promise<any> {
        return this._dbInstance.close();
    }

    async open() {
        return !this._dbInstance.isOpen() && await this._dbInstance.open()
    }

    get(id: string): Promise<RecordInterface> {

        return new Promise(async (resolve, reject) => {

            !this._dbInstance.isOpen() && await this._dbInstance.open();

            !this._dbInstance.isOpen() && await this._dbInstance.open();
            this._dbInstance.get(id, { asBuffer: false }, (err, value) => {
                err ? reject(err) : resolve({ id, ...JSON.parse(value) });
            })
        });
    }

    getByKeys(keys: string[]): Promise<RecordInterface[]> {

        return new Promise(async (resolve, reject) => {

            !this._dbInstance.isOpen() && await this._dbInstance.open();

            keys = keys.sort((a, b) => b.localeCompare(a));

            let docs: RecordInterface[] = [];
            let itr = this._dbInstance.iterator();
            let stream = iteratorStream(itr), i = 0;

            stream.on("data", function (data: any) {

                docs.push({ id: data.key.toString(), ...JSON.parse(data.value.toString()) });
                seekNext(i + 1);
            })

            function seekNext(index: number) {
                i = index;
                if (keys[index] === undefined) {
                    resolve(docs);
                }
                itr.seek(keys[index]);
            }

            seekNext(0);
        })
    }

    insert(object: { [prop: string]: any }): Promise<string> {
        let _ = this;
        
        return new Promise(async (resolve, reject) => {
            let { id, ...value } = object;
            if (!id) id = shortid.generate();

            !this._dbInstance.isOpen() && await this._dbInstance.open();

            this._dbInstance.put(id, JSON.stringify(value), (err) => {

                console.log(err);

                err ? reject(err)
                    : this._indexManager.insert(id, value)
                        .then(() => resolve(id)).catch(reject)

            })
        });
    }

    // Update/merge a record, throw error if id not found
    async update(id: string, changes: { [prop: string]: any }) {
        let doc = await this.get(id);
        delete doc.id;

        let removes: { [prop: string]: any } = {}, inserts = changes;
        Object.keys(changes).forEach(prop => {
            if (prop in doc) {
                removes[prop] = doc[prop]
            }
        })
        changes = Object.assign({}, doc, changes);

        return new Promise(async (resolve, reject) => {

            !this._dbInstance.isOpen() && await this._dbInstance.open();

            this._dbInstance.put(id, JSON.stringify(changes), (err) => {
                if (err) { reject(err) } else {
                    this._indexManager.update(id, inserts, removes)
                        .then(resolve).catch(reject)
                }

            })
        });
    }

    // Insert a record, override if exists
    set(id: string, changes: any): Promise<any> {

        return new Promise(async (resolve, reject) => {

            !this._dbInstance.isOpen() && await this._dbInstance.open();

            this._dbInstance.put(id, JSON.stringify(changes), (err) => {
                err ? reject(err)
                    : this._indexManager.insert(id, changes)
                        .then(resolve).catch(reject)

            })
        })
    }

    remove(id: string): Promise<any> {
        return this._dbInstance.del(id)
    }

    batch(opts: {
        inserts?: { id: string }[],
        updates?: { id: string }[],
        deletes?: { id: string }[]
    }): Promise<any> {

        return new Promise((resolve, reject) => {
            let batch = this._dbInstance.batch();
            let batchIndexes = this._indexManager.batch();

            opts.inserts && opts.inserts.forEach(doc => {
                let { id, ...rest } = doc;
                !id && (id = shortid.generate());

                batch.put(id, JSON.stringify(rest));
                batchIndexes.put(id, rest);
            });

            opts.updates && opts.updates.forEach(doc => {
                let { id, ...rest } = doc;
                batch.put(id, JSON.stringify(rest));
                batchIndexes.put(id, rest);
            });

            opts.deletes && opts.deletes.forEach(doc => {
                batch.del(doc.id);
            });

            Promise.all([batch.write(), batchIndexes.commit()])
                .then(resolve)
                .catch(reject);
        })
    }

    q(property?: string) {

        return new QueryObject(
            !property || property === "id" ? this._dbInstance
            : this._indexManager.getStore(property)._store
        )
    }

    // Index section 
    createIndex(def: { property: string, type?: "regular" | "fulltext" }) {//"string" | "number" | "array" }) {
        return this._indexManager.createIndex(def.property, def.type);
    }

    removeIndex(property: string) {
        return this._indexManager.removeIndex(property);
    }

    getMeta() {
        let meta: any = {};
        return meta;
    }

    getIndexes() {
        return this._indexManager._indexes.map(i => i.getMeta())
    }

    data = (): Promise<FetchResult> => {
        return this.q().get({ values: true })
    }

    async destroyCollection() {
        await deleteDirRecursive(this._path);
        await this._indexManager.destroy();
    }
}

export type FetchResult = {
    keys: string[],
    docs: { id: string, [prop: string]: any }[],
    errors: string[]
}