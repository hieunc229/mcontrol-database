import metastore from "../internal/MetaStore";
import IndexValue from "./IndexValue";
import IndexFulltext from "./IndexFulltext";
import { ManagerChain } from "./ManagerChain";

export type Index = { property: string, type?: "regular" | "fulltext" };
type Props = {
    path: string,
    indexes?: Index[]
}
export default class IndexManager {

    _path: string;
    _indexes: (IndexValue | IndexFulltext)[] = []

    _metaPath: string;

    constructor(props: Props) {
        this._path = props.path;
        this._metaPath = this._path + '/_indexes';

        this.updateMeta = this.updateMeta.bind(this);
        this.getStore = this.getStore.bind(this);
        this.startup.bind(this)({ indexes: props.indexes });
    }

    insert(id: string, object: any): Promise<any> {
        return Promise.all(this._indexes.map(item =>
            item.put(id, object)
        ))
    }

    update(id: string, object: any, removes: any): Promise<any> {
        return Promise.all(

            Object.keys(removes).map(prop => {
                let index = this._indexes.find(item => item._prop == prop);
                return index ? index.del(id, removes) : null;
            })
                .concat(
                    Object.keys(object).map(prop => {
                        let index = this._indexes.find(item => item._prop == prop);
                        return index ? index.put(id, removes) : null;
                    })
                )
        )
    }

    batch() {
        return new ManagerChain({ indexes: this._indexes });
    }

    createIndex(property: string, type?: "regular" | "fulltext") {
        if (!this._indexes.find(i => i._prop === property)) {
            const opts = { path: this._path, property };
            let index = type !== "fulltext" ?
                new IndexValue(opts) :
                new IndexFulltext(opts)
            this._indexes.push(index);
            this.updateMeta()
            return index;
        }
        return undefined
    }

    async removeIndex(property: string) {
        let index = this._indexes.findIndex(item => item._prop === property);
        if (index) {
            await this._indexes[index].destroy();
            this._indexes.splice(index, 1);
            return true;
        }
        return false;
    }

    async destroy() {
        return Promise.all(this._indexes.map(item => item.destroy()))
    }

    getStore(property: string, type?: "regular" | "fulltext") {
        let index = this._indexes.find(s => s._prop === property);
        if (!index) {
            const opts = { path: this._path, property };
            index = type !== "fulltext" ?
                new IndexValue(opts) :
                new IndexFulltext(opts);
            this._indexes.push(index);
        }
        return index;
    }

    private async updateMeta() {
        let meta = {
            indexes: this._indexes.map(item => item.getMeta())
        }
        return metastore.save(this._metaPath, meta);
    }

    private async startup(opts: { indexes?: Index[] }) {

        if (opts.indexes && opts.indexes.length) {
            this._indexes = opts.indexes.map(id => {
                let props = { path: this._path, property: id.property };
                return id.type !== "fulltext" ? new IndexValue(props) : new IndexFulltext(props);
            })
            return;
        }

        const meta = await metastore.load(this._metaPath);
        if (meta && meta.indexes) {
            this._indexes = (meta.indexes as { property: string, type?: "regular" | "fulltext" }[]).map(item => {
                let props = { path: this._path, property: item.property };
                return item.type !== "fulltext" ? new IndexValue(props) : new IndexFulltext(props);
            })
        }
    }
}
