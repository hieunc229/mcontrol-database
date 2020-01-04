import Collection, { CollectionInterface } from "./Collection";

export default class CollectionAbstraction {

    private _c: Collection;

    onObjectWillInsert(object: any) {
        return object;
    }

    onObjectWillUpdate(id: string, object: any) {
        return object;
    }

    onObjectWillRemove(id: string) {
        return id;
    }

    onObjectWillSet(id: string, object: any) {
        return object;
    }
    constructor(props: CollectionInterface) {
        this._c = new Collection(props)
    }

    insert(object: { [prop: string]: any }) {
        let data =
            this.onObjectWillInsert ? this.onObjectWillInsert(object) : object;

        return this._c.insert(data);
    }

    set(id: string, object: { [prop: string]: any }) {
        let data = this.onObjectWillSet ? this.onObjectWillSet(id, object) : object;

        return this._c.set(id, data);
    }

    update(id: string, changes: { [prop: string]: any }) {
        let data = this.onObjectWillUpdate ? this.onObjectWillUpdate(id, changes) : changes;
        return this._c.update(id, data);
    }

    remove(id: string) {
        let data = this.onObjectWillRemove ? this.onObjectWillRemove(id) : id;
        return this._c.remove(data);
    }

    get(id: string) {
        return this._c.get(id);
    }

    c() {
        return this._c;
    }
}