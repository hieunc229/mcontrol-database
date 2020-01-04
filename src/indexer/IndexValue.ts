import Collection from "../Collection";

import levelup, { LevelUp } from "levelup";
import { createStore } from "../internal/createStore";
import { deleteDirRecursive } from "../internal/recursiveRemoveDir";
import { IndexChain } from "./IndexChain";

type Props = {
    path: string,
    property: string,
    status?: string
}

export default class IndexValue {

    _store: LevelUp;
    _path: string;
    _prop: string;
    _status: string;

    constructor(props: Props) {
        this._path = props.path + '/' + props.property;
        this._store = createStore(this._path);
        this._prop = props.property;
        this._status = props.status || "created";
    }

    put(id: string, object: any) {
        const batch = this.batch();
        batch.put(id, object);
        return batch.commit()
    }

    del(id: string, removes: any) {
        const batch = this.batch();
        batch.del(id, removes);
        return batch.commit();
    }

    batch() {
        return new IndexChain({
            property: this._prop,
            batch: this._store.batch()
        })
    }

    getMeta() {
        return { property: this._prop, type: "regular" };
    }

    async startIndexing(col: Collection) {

        var i = 0;
        const data = await col.data();
        let batch = this._store.batch();

        data.docs.forEach(r => {
            let { id, ...rest}=r;
            batch.put(id, JSON.stringify(rest));
        })

        await batch.write();
    }

    async destroy() {
        await deleteDirRecursive(this._path);
    }
}
