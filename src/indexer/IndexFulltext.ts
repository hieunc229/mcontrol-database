import Collection from "../Collection";

import { LevelUp } from "levelup";
import { createStore } from "../internal/createStore";
import { deleteDirRecursive } from "../internal/recursiveRemoveDir";
import { IndexChain } from "./IndexChain";

type Props = {
    path: string,
    property: string
}

export default class IndexFulltext {

    _store: LevelUp;
    _path: string;
    _prop: string

    constructor(props: Props) {
        this._path = props.path + '/' + props.property;
        this._store = createStore(this._path);
        this._prop = props.property;
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
        return { property: this._prop, type: "fulltext" };
    }

    async startIndexing(col: Collection) {

    }

    async destroy() {
        await deleteDirRecursive(this._path);
    }
}
